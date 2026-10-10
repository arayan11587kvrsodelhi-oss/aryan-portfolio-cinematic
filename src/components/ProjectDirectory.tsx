import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search, X, Layers } from 'lucide-react'
import { useGitHubRepos, hasLocalImage, loadLocalImage, type ProjectRepo } from '../hooks/useGitHubRepos'
import {
  canonicalByRepoName,
  PROJECT_CATEGORIES,
  featuredProjects,
  type CanonicalProject,
  type ProjectCategory,
} from '../data/projectRegistry'
import { useSFX } from '../hooks/useSFX'
import { FeaturedProjects } from './FeaturedProjects'
import { ArchiveCard, EmptyState } from './ProjectDirectoryParts'

/* ==========================================================================
   PROJECT DIRECTORY — filterable gallery + numbered archive

   Replaces the previous slider. Two patterns in one section:

     - the six curated FEATURED projects (own presentation, own ordering)
     - the full numbered ARCHIVE of every verified project, searchable and
       filterable

   The archive is keyed by repository and DEDUPLICATED on the normalised
   repository URL, so a project present in both the canonical registry and the
   GitHub API response can only ever appear once. Featured projects are
   therefore shown in the archive too (they are part of the collection) but
   never twice.

   NUMBERING IS STABLE: numbers come from the canonical registry order and are
   computed once for the whole collection. Filtering and searching never
   renumber — a card keeps `01` whether you are looking at everything or at a
   single category.
   ========================================================================== */

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Lowercased, trailing-slash-free URL — the dedupe key. */
function normalizeRepoUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, '').replace(/\.git$/, '')
}

export interface ArchiveEntry {
  /** Stable React key. Never duplicated. */
  key: string
  /** Canonical registry entry, when this repository has one. */
  canonical?: CanonicalProject
  /** The live GitHub record, when the API resolved it. */
  repo?: ProjectRepo
  title: string
  summary: string
  category: ProjectCategory
  tech: string[]
  /** Only ever a real URL. */
  liveUrl?: string
  /** Only ever a real URL. */
  sourceUrl?: string
  /** True when a real committed screenshot exists for this repository. */
  hasImage: boolean
  featured: boolean
  /** Fixed archive number, assigned once from canonical order. */
  number: string
}

type Filter = ProjectCategory | 'ALL'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'ALL', label: 'All Projects' },
  { id: 'CYBERSECURITY', label: 'Cybersecurity' },
  { id: 'WEB DEVELOPMENT', label: 'Web Development' },
  { id: 'AI & BACKEND', label: 'AI & Backend' },
  { id: 'GAMES & EXPERIMENTS', label: 'Games & Experiments' },
]
export default function ProjectDirectory() {
  const { playSFX } = useSFX()
  const { repos, status, source, error } = useGitHubRepos()
  const [filter, setFilter] = useState<Filter>('ALL')
  const [query, setQuery] = useState('')
  const [images, setImages] = useState<Record<string, string>>({})
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  /* ---- Build the canonical, deduplicated collection --------------------- */
  const all = useMemo<ArchiveEntry[]>(() => {
    const byUrl = new Map<string, ArchiveEntry>()
    const repoByName = new Map(repos.map((r) => [r.name, r]))
    const seenIds = new Set<string>()

    // Walk the canonical registry first: this fixes both the ordering and the
    // archive numbers, and guarantees the featured six are never reordered by
    // the API's sort order.
    for (const canonical of canonicalByRepoName.values()) {
      const repo = repoByName.get(canonical.repoName)
      const sourceUrl =
        repo?.githubUrl ?? `https://github.com/arayan11587kvrsodelhi-oss/${canonical.repoName}`
      const key = normalizeRepoUrl(sourceUrl)
      if (byUrl.has(key)) continue
      if (repo) seenIds.add(repo.id)

      byUrl.set(key, {
        key,
        canonical,
        repo,
        title: canonical.title,
        summary: canonical.summary,
        category: canonical.category,
        tech: canonical.tech,
        liveUrl: repo?.demoUrl || canonical.liveUrl || undefined,
        sourceUrl,
        hasImage: hasLocalImage(canonical.repoName),
        featured: canonical.featured,
        number: '',
      })
    }

    // Then add any real repository the API returned that the registry does not
    // cover. Nothing is invented: the API's own name and URLs are used.
    for (const repo of repos) {
      const key = normalizeRepoUrl(repo.githubUrl)
      if (byUrl.has(key)) continue
      if (seenIds.has(repo.id)) continue
      seenIds.add(repo.id)

      byUrl.set(key, {
        key,
        repo,
        title: repo.name,
        summary: repo.description,
        category: 'WEB DEVELOPMENT',
        tech: repo.technologies.slice(0, 6),
        liveUrl: repo.demoUrl || undefined,
        sourceUrl: repo.githubUrl,
        hasImage: hasLocalImage(repo.name),
        featured: false,
        number: '',
      })
    }

    const list = [...byUrl.values()]
    // Assign fixed numbers from this canonical order, exactly once.
    list.forEach((entry, i) => {
      entry.number = pad2(i + 1)
    })
    return list
  }, [repos])

  /* ---- Per-category counts (always from the FULL collection) ------------ */
  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: all.length }
    for (const cat of PROJECT_CATEGORIES) map[cat] = 0
    for (const entry of all) map[entry.category] = (map[entry.category] ?? 0) + 1
    return map
  }, [all])

  /* ---- Filtering + search ---------------------------------------------- */
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((entry) => {
      if (filter !== 'ALL' && entry.category !== filter) return false
      if (!q) return true
      // Search matches name, description, technologies and category.
      const haystack = [
        entry.title,
        entry.summary,
        entry.category,
        entry.repo?.name ?? '',
        ...entry.tech,
        ...(entry.repo?.topics ?? []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [all, filter, query])

  /* ---- Lazy-load screenshots only for what is rendered ------------------ */
  useEffect(() => {
    if (status !== 'ready') return
    let cancelled = false
    for (const entry of visible) {
      if (!entry.hasImage || images[entry.key]) continue
      const repoName = entry.canonical?.repoName ?? entry.repo?.name
      if (!repoName) continue
      loadLocalImage(repoName).then((url) => {
        if (url && !cancelled) {
          setImages((prev) => (prev[entry.key] ? prev : { ...prev, [entry.key]: url }))
        }
      })
    }
    return () => {
      cancelled = true
    }
  }, [visible, images, status])

  const onFilter = useCallback(
    (next: Filter) => {
      playSFX('nav')
      setFilter(next)
    },
    [playSFX]
  )

  const reset = useCallback(() => {
    playSFX('click')
    setFilter('ALL')
    setQuery('')
  }, [playSFX])

  const isFiltered = filter !== 'ALL' || query.trim().length > 0


  return (
    <section id="workbench" className="relative z-10 bg-background text-foreground">
      {/* ---- Header ------------------------------------------------------- */}
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pt-[var(--spacing-section)] pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-eyebrow text-accent">PROJECT DIRECTORY / 2026</span>
          <span className="h-[1px] w-12 bg-border" />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white">
              The Complete Collection
            </h2>
            <p className="text-muted text-sm sm:text-base mt-3 max-w-2xl font-mono">
              Security tools, web experiences, AI experiments, and engineering projects.
            </p>
          </div>

          {/* Count is derived from the deduplicated data. Never hardcoded. */}
          <span className="pdir-count" aria-live="polite">
            <Layers size={13} aria-hidden="true" />
            {pad2(all.length)} PROJECTS
          </span>
        </div>
      </div>

      {/* ---- FEATURED SIX (separate presentation + selection logic) -------- */}
      <FeaturedProjects projects={featuredProjects} repos={repos} reduced={reduced} />

      {/* ---- NUMBERED ARCHIVE -------------------------------------------- */}
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pb-[var(--spacing-section)]">
        <div className="flex flex-wrap items-center gap-3 mb-3 border-t border-border pt-10">
          <span className="text-eyebrow text-accent">FULL ARCHIVE</span>
          <span className="h-[1px] flex-1 min-w-[2rem] bg-border" />
        </div>

        {/* Archive description: explains the numbering contract up front. */}
        <p className="max-w-2xl mb-7 text-sm font-mono leading-relaxed text-white/55">
          Every verified project in one numbered index — stable numbers that never renumber as you
          search or filter. The featured selection above always stays exactly as curated.
        </p>

        {/* ---- Archive controls: search + category filters -----------------
            Moved here from the section header so filtering the archive never
            requires scrolling past the featured cards. Only the archive below
            is affected — the featured six keep their own ordering. */}
        <div className="mb-7 flex flex-col gap-4">
          <div className="pdir-search-wrap">
            <Search className="pdir-search-icon" size={16} aria-hidden="true" />
            <input
              type="search"
              className="pdir-search"
              placeholder="Search projects, technologies, categories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setQuery('')
              }}
              aria-label="Search archive projects"
            />
            {query.length > 0 && (
              <button
                type="button"
                className="pdir-search-clear"
                onClick={() => {
                  playSFX('click')
                  setQuery('')
                }}
                aria-label="Clear search"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="pdir-filters" role="group" aria-label="Filter archive projects by category">
            {FILTERS.map((f) => {
              const active = filter === f.id
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`pdir-filter ${active ? 'is-active' : ''}`}
                  onClick={() => onFilter(f.id)}
                  aria-pressed={active}
                >
                  <span>{f.label}</span>
                  <span className="pdir-filter-count">{pad2(counts[f.id] ?? 0)}</span>
                </button>
              )
            })}
            {isFiltered && (
              <button type="button" className="pdir-filter pdir-filter--reset" onClick={reset}>
                <X size={12} aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Filtered archive result count + honest data-source notes: the
              archive explains itself rather than silently degrading when the
              API is unavailable. The count is aria-live so keyboard and
              screen-reader users hear it change as they filter. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs font-mono text-white/45" aria-live="polite">
              {pad2(visible.length)} OF {pad2(all.length)} SHOWN
            </span>
            {status === 'loading' && (
              <span className="pdir-note">Loading the project directory…</span>
            )}
            {status === 'ready' && source === 'fallback' && (
              <span className="pdir-note">
                Showing the committed project snapshot — the live GitHub API is unavailable
                {error ? ` (${error})` : ''}.
              </span>
            )}
          </div>
        </div>

        {visible.length > 0 ? (
          <ul className="pdir-grid">
            {visible.map((entry) => (
              <li key={entry.key}>
                <ArchiveCard
                  entry={entry}
                  image={images[entry.key]}
                  onHover={() => playSFX('projectHover')}
                />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState query={query} onReset={reset} />
        )}
      </div>
    </section>
  )
}
