import { useEffect, useRef, useState } from 'react'
import {
  githubRepos as localFallbackRepos,
  GITHUB_OWNER,
  type GitHubRepo,
} from '../data/githubRepos'

/* ==========================================================================
   GITHUB REPOSITORY DATA LAYER
   Fetches the real public repository list and normalises it into the shape the
   rest of the portfolio already consumes, so the project book and the existing
   workbench stay consistent.

   INTEGRITY RULES (deliberate, do not relax):
   - Every field comes from the GitHub API response or from the local snapshot
     that already ships in this repo. Nothing is invented.
   - Repositories are NEVER filtered out. Archived / forked / empty repos are
     represented with their true state instead of being dropped.
   - No description is ever authored. An empty GitHub description renders as an
     explicit "not provided" note rather than invented prose.
   - Only real `html_url` / `homepage` values become links. No guessed URLs.

   CACHING: module-level in-flight promise dedupe (re-renders never refetch),
   localStorage (7 days) and sessionStorage (30 min) tiers.
   ========================================================================== */

const API_URL = `https://api.github.com/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated`

const CACHE_KEY = 'portfolio_github_repos_v1'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000
const SESSION_CACHE_KEY = 'portfolio_github_repos_session_v1'
const SESSION_TTL_MS = 30 * 60 * 1000
/** Raw shape we consume from the GitHub REST response. */
interface RawRepo {
  id: number
  name: string
  html_url: string
  homepage: string | null
  description: string | null
  language: string | null
  topics?: string[]
  stargazers_count: number
  forks_count: number
  fork: boolean
  archived: boolean
  disabled?: boolean
  created_at: string
  updated_at: string
  default_branch: string
  license?: { spdx_id?: string | null } | null
  size: number
}

export interface RepoStatus {
  isEmpty: boolean
  isFork: boolean
  isArchived: boolean
  isDisabled: boolean
  hasLiveUrl: boolean
  hasDescription: boolean
}

export interface ProjectRepo {
  id: string
  name: string
  githubUrl: string
  /** Only ever a real GitHub `homepage`. Empty string when none exists. */
  demoUrl: string
  /** Raw GitHub description, or '' when GitHub has none. Never invented. */
  description: string
  language: string
  /** GitHub topics plus primary language. Only real values. */
  technologies: string[]
  topics: string[]
  stars: number
  forks: number
  createdAt: string
  updatedAt: string
  defaultBranch: string
  license: string
  /** Local screenshot from src/assets/photos when one exists for this repo. */
  image?: string
  status: RepoStatus
}
/* Local screenshots that already exist in this repository, keyed by repo name.
   These are real committed project images, so they are the highest-priority
   visual source. Each is loaded lazily via dynamic import, so they are never
   bundled into the entry chunk. */
const LOCAL_IMAGE_MAP: Record<string, () => Promise<string>> = {
  'sentinel-soc': () => import('../assets/photos/sentinel-soc-v2.2.png').then((m) => m.default),
  'vigil-cloud-security': () => import('../assets/photos/vigil-project-preview.webp').then((m) => m.default),
  'haya-footwear': () => import('../assets/photos/haya-project-preview.webp').then((m) => m.default),
  'velora-fintech-landing-page': () => import('../assets/photos/velora.png').then((m) => m.default),
  'amber-hour': () => import('../assets/photos/amber-hour.png').then((m) => m.default),
  'aryan-portfolio-cinematic': () => import('../assets/photos/portfolio.png').then((m) => m.default),
  'portfolio-card': () => import('../assets/photos/portfolio-card.png').then((m) => m.default),
  'aryan-portfolio-auth': () => import('../assets/photos/portfolio-auth.png').then((m) => m.default),
  'auth-client': () => import('../assets/photos/auth-client.png').then((m) => m.default),
  'nexus-dashboard': () => import('../assets/photos/nexus-dashboard.png').then((m) => m.default),
  currpense: () => import('../assets/photos/currpense.png').then((m) => m.default),
  calc: () => import('../assets/photos/calculator.png').then((m) => m.default),
  'Responsive-Business-Landing-Page': () =>
    import('../assets/photos/business-landing.png').then((m) => m.default),
  'nissan-gtr-clone': () => import('../assets/photos/nissan.jpg').then((m) => m.default),
  aryan: () => import('../assets/photos/aryan-project.png').then((m) => m.default),
}

/** Resolve a local screenshot URL without pulling it into the critical path. */
export function loadLocalImage(repoName: string): Promise<string | undefined> {
  const loader = LOCAL_IMAGE_MAP[repoName]
  if (!loader) return Promise.resolve(undefined)
  return loader().catch(() => undefined)
}

/**
 * True when a real, committed screenshot exists for this repository name.
 *
 * Synchronous and side-effect free, so callers can decide *before* rendering
 * whether an entry has a genuine visual. Used by the curated Featured selection
 * to guarantee it only advertises projects that actually ship a screenshot,
 * rather than showing an empty frame. Nothing is ever fabricated for repos
 * that return false - they simply keep their honest no-image fallback in the
 * full book below.
 */
export function hasLocalImage(repoName: string): boolean {
  return Boolean(LOCAL_IMAGE_MAP[repoName])
}

/** Normalise one raw GitHub repository. Pure - no side effects. */
function normalise(raw: RawRepo): ProjectRepo {
  const description = (raw.description ?? '').trim()
  const homepage = (raw.homepage ?? '').trim()
  const topics = Array.isArray(raw.topics) ? raw.topics.filter(Boolean) : []
  const language = (raw.language ?? '').trim()

  /* GitHub sometimes reports an empty `homepage` even when the repository has a
     real, working deployment. When the API says nothing, fall back to the
     deployment URL already recorded in this project's own data — but only for
     repositories that actually have one recorded.

     Today that applies to a single repository (vigil-cloud-security), whose
     github.io URL was independently verified before being trusted: HTTP 200,
     `has_pages: true`, and a page titled "VIGIL — Cloud Security Intelligence".
     No URL is constructed or guessed here. */
  const knownLocal = localFallbackRepos.find((r) => r.name === raw.name)
  const demoUrl = homepage || (knownLocal?.demoUrl ?? '').trim()

  // Technologies are strictly real: GitHub topics plus the primary language.
  const technologies = [...new Set([...topics, language].filter(Boolean))]

  return {
    id: String(raw.id),
    name: raw.name,
    githubUrl: raw.html_url,
    demoUrl,
    description,
    language,
    technologies,
    topics,
    stars: raw.stargazers_count ?? 0,
    forks: raw.forks_count ?? 0,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    defaultBranch: raw.default_branch,
    license: raw.license?.spdx_id ?? '',
    status: {
      // size is the GitHub repo size in KB; 0 means no content committed.
      isEmpty: typeof raw.size === 'number' && raw.size === 0,
      isFork: Boolean(raw.fork),
      isArchived: Boolean(raw.archived),
      isDisabled: Boolean(raw.disabled),
      hasLiveUrl: demoUrl.length > 0,
      hasDescription: description.length > 0,
    },
  }
}

/* Sort: meaningful projects first (description + live URL), then most recently
   updated, then alphabetical. Stable and deterministic. Nothing is dropped. */
function sortRepos(list: ProjectRepo[]): ProjectRepo[] {
  return [...list].sort((a, b) => {
    const score = (r: ProjectRepo) =>
      (r.status.hasDescription ? 2 : 0) + (r.status.hasLiveUrl ? 1 : 0)
    const diff = score(b) - score(a)
    if (diff !== 0) return diff
    const byUpdated = Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    if (!Number.isNaN(byUpdated) && byUpdated !== 0) return byUpdated
    return a.name.localeCompare(b.name)
  })
}
function readCache<T>(key: string, ttl: number): T | null {
  try {
    const raw = localStorage.getItem(key) ?? sessionStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { at: number; data: T }
    if (Date.now() - parsed.at > ttl) return null
    return parsed.data
  } catch {
    return null
  }
}

function writeCache(key: string, data: unknown, session = false) {
  try {
    const payload = JSON.stringify({ at: Date.now(), data })
    if (session) sessionStorage.setItem(key, payload)
    else localStorage.setItem(key, payload)
  } catch {
    /* storage unavailable (private mode / quota) - non-fatal */
  }
}

/** Module-level dedupe so concurrent mounts share exactly one request. */
let inFlight: Promise<ProjectRepo[]> | null = null

/**
 * Convert the local snapshot (src/data/githubRepos.ts) into the same shape.
 * Used only when the network is unavailable. That snapshot already exists in
 * this repository, so this is existing data - not invented data.
 */
function fromLocalSnapshot(): ProjectRepo[] {
  return sortRepos(
    localFallbackRepos.map((r: GitHubRepo): ProjectRepo => {
      const description = (r.description ?? '').trim()
      const language = r.primaryLanguage ?? ''
      return {
        id: r.id,
        name: r.name,
        githubUrl: r.githubUrl,
        demoUrl: r.demoUrl ?? '',
        description,
        language,
        technologies: [...new Set([...(r.topics ?? []), language].filter(Boolean))],
        topics: r.topics ?? [],
        stars: r.stars ?? 0,
        forks: r.forks ?? 0,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        defaultBranch: 'main',
        license: '',
        status: {
          isEmpty: false,
          isFork: false,
          isArchived: false,
          isDisabled: false,
          hasLiveUrl: Boolean(r.demoUrl),
          hasDescription: description.length > 0,
        },
      }
    })
  )
}

async function fetchRepos(): Promise<ProjectRepo[]> {
  const cached = readCache<ProjectRepo[]>(CACHE_KEY, CACHE_TTL_MS)
  if (cached && cached.length) return cached

  const sessionCached = readCache<ProjectRepo[]>(SESSION_CACHE_KEY, SESSION_TTL_MS)
  if (sessionCached && sessionCached.length) {
    writeCache(CACHE_KEY, sessionCached)
    return sessionCached
  }

  const res = await fetch(API_URL, { headers: { Accept: 'application/vnd.github+json' } })

  if (res.status === 403 || res.status === 429) {
    // Stale-but-valid cache is better than an empty section.
    const stale = readCache<ProjectRepo[]>(CACHE_KEY, Number.POSITIVE_INFINITY)
    if (stale && stale.length) return stale
    throw new Error('GitHub API rate limited (' + res.status + ')')
  }

  if (!res.ok) throw new Error('GitHub API responded ' + res.status)

  const raw = (await res.json()) as RawRepo[]
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new Error('GitHub API returned no repositories')
  }

  const repos = sortRepos(raw.map(normalise))
  writeCache(SESSION_CACHE_KEY, repos, true)
  writeCache(CACHE_KEY, repos)
  return repos
}

export type ReposSource = 'api' | 'cache' | 'fallback'

export interface GitHubReposState {
  repos: ProjectRepo[]
  status: 'loading' | 'ready' | 'error'
  source: ReposSource
  error: string | null
}

const INITIAL: GitHubReposState = { repos: [], status: 'loading', source: 'api', error: null }

/**
 * Loads the real public repositories once per session.
 * Falls back to the repository's existing local snapshot on any failure.
 */
export function useGitHubRepos(): GitHubReposState {
  const [state, setState] = useState<GitHubReposState>(INITIAL)
  // Guard against React 18 StrictMode double-invoking effects.
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true

    const cached = readCache<ProjectRepo[]>(CACHE_KEY, CACHE_TTL_MS)
    if (cached && cached.length) {
      setState({ repos: cached, status: 'ready', source: 'cache', error: null })
    }

    if (!inFlight) {
      inFlight = fetchRepos().finally(() => {
        inFlight = null
      })
    }

    let cancelled = false
    inFlight
      .then((repos) => {
        if (cancelled) return
        setState((prev) => ({
          repos,
          status: 'ready',
          source: prev.source === 'cache' && prev.status === 'ready' ? 'cache' : 'api',
          error: null,
        }))
      })
      .catch((err: unknown) => {
        if (cancelled) return
        // If cached data is already showing, keep it and ignore the error.
        setState((prev) => {
          if (prev.status === 'ready' && prev.repos.length) return prev
          return {
            repos: fromLocalSnapshot(),
            status: 'ready',
            source: 'fallback',
            error: err instanceof Error ? err.message : 'Unable to load repositories',
          }
        })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}