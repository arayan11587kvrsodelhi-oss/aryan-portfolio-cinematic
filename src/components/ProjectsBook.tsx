import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Star, GitFork } from 'lucide-react'
import PageFlip, { type PageFlipDirection } from './PageFlip'
import { useGitHubRepos, loadLocalImage, type ProjectRepo } from '../hooks/useGitHubRepos'
import { useSFX } from '../hooks/useSFX'

/* ==========================================================================
   PROJECT BOOK
   A physical, page-turn book where every public repository is a page.

   DATA TRUTHFULNESS (the important part):
   - Page count, order, names, descriptions, tech, stars, forks and links all
     come straight from the GitHub API (see useGitHubRepos).
   - Repos without a GitHub description show an explicit "not provided" note.
     Nothing is written on their behalf.
   - A "Live" button only appears when GitHub reports a real homepage. A repo
     with no homepage simply does not get one.
   - Archived / fork / empty states are shown as badges rather than hidden.
   - If the API is unavailable the section falls back to the local snapshot
     already committed in this repo, and says so, rather than inventing.
   ========================================================================== */

const pad2 = (n: number) => String(n).padStart(2, '0')

/* ==========================================================================
   FEATURED PROJECTS — a hand-curated selection of six repositories.

   This is a manual curation, NOT an objective ranking by stars, traffic,
   quality or popularity. Each entry maps to a real repository already present
   in `repos` by its exact GitHub name; nothing is defined here beyond a
   display label and a repository name.

   `name` must match the GitHub repository name exactly (case-sensitive), e.g.
   "Nexa-ai". If a repository does not resolve it is simply skipped rather than
   substituted with invented data.
   ========================================================================== */

interface FeaturedSpec {
  /** Exact GitHub repository name. */
  name: string
  /** Curated display title. */
  label: string
}

const FEATURED: FeaturedSpec[] = [
  { name: 'sentinel-soc', label: 'Sentinel SOC' },
  { name: 'Nexa-ai', label: 'NEXA AI' },
  { name: 'velora-fintech-landing-page', label: 'VELORA' },
  {
    name: 'cyberdesk-incident-management-platform',
    label: 'CyberDesk Incident Management Platform',
  },
  { name: 'vigil-cloud-security', label: 'VIGIL — Cloud Security Intelligence' },
  { name: 'nexus-dashboard', label: 'Nexus Dashboard' },
]

/** Restrained accent treatment derived from REAL repository metadata only. */
function toneFor(repo: ProjectRepo): { accent: string; label: string } {
  const haystack = (repo.name + ' ' + repo.description + ' ' + repo.topics.join(' ')).toLowerCase()
  const lang = repo.language.toLowerCase()

  if (/\b(security|cyber|soc|incident|threat|vigil|sentinel)\b/.test(haystack)) {
    return { accent: '#19b89a', label: 'Security' }
  }
  if (/\b(fintech|finance|ledger|expense|currency|velora|currpense)\b/.test(haystack)) {
    return { accent: '#3b82f6', label: 'Fintech' }
  }
  if (lang === 'python') return { accent: '#3572A5', label: 'Python' }
  if (lang === 'typescript' || lang === 'javascript') {
    return { accent: '#4fd1c5', label: 'Web' }
  }
  return { accent: '#8b9692', label: repo.language || 'Repository' }
}

interface ProjectPageProps {
  repo: ProjectRepo
  order: number
  total: number
  image?: string
}

function ProjectPage({ repo, order, total, image }: ProjectPageProps) {
  const tone = toneFor(repo)

  return (
    <article className="pbk-page" style={{ ['--pbk-accent' as string]: tone.accent }}>
      <div className="pbk-content">
        <header className="pbk-head">
          <span className="pbk-index">{pad2(order)}</span>
          <div className="pbk-head-meta">
            <span className="pbk-tone">{tone.label}</span>
            {repo.status.isArchived && <span className="pbk-flag">Archived</span>}
            {repo.status.isFork && <span className="pbk-flag">Fork</span>}
            {repo.status.isEmpty && <span className="pbk-flag">Empty</span>}
            {repo.status.isDisabled && <span className="pbk-flag">Disabled</span>}
          </div>
        </header>

        <h3 className="pbk-title">{repo.name}</h3>

        <div className="pbk-visual" data-has-image={image ? 'true' : 'false'}>
          {image ? (
            <img
              src={image}
              alt={`Screenshot of ${repo.name}`}
              className="pbk-visual-img"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          ) : (
            /* Abstract cover built from real metadata. Explicitly NOT */
            /* presented as a screenshot of the application. */
            <div className="pbk-abstract" aria-hidden="true">
              <span className="pbk-abstract-glyph">
                {repo.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="pbk-abstract-note">
                No screenshot available for this repository
              </span>
            </div>
          )}
        </div>

        <p className="pbk-desc">
          {repo.status.hasDescription
            ? repo.description
            : 'No repository description provided.'}
        </p>

        {repo.technologies.length > 0 && (
          <ul className="pbk-tech" aria-label="Technologies">
            {repo.technologies.map((t) => (
              <li key={t} className="pbk-chip">
                {t}
              </li>
            ))}
          </ul>
        )}

        <footer className="pbk-foot">
          <div className="pbk-stats">
            <span className="pbk-stat">
              <Star size={12} aria-hidden="true" />
              <span>{repo.stars}</span>
              <span className="sr-only"> stars</span>
            </span>
            <span className="pbk-stat">
              <GitFork size={12} aria-hidden="true" />
              <span>{repo.forks}</span>
              <span className="sr-only"> forks</span>
            </span>
            {repo.license && <span className="pbk-license">{repo.license}</span>}
          </div>

          <div className="pbk-links">
            <a
              className="pbk-link"
              href={repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open GitHub repository ${repo.name}`}
              data-cursor="open"
              data-no-drag
            >
              <Github size={13} aria-hidden="true" />
              <span>GitHub</span>
            </a>

            {/* Only rendered when GitHub actually reports a homepage. */}
            {repo.status.hasLiveUrl && (
              <a
                className="pbk-link pbk-link--live"
                href={repo.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open live demo of ${repo.name}`}
                data-cursor="open"
                data-no-drag
              >
                <span>Live</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            )}
          </div>
        </footer>
      </div>

      <span className="pbk-page-num" aria-hidden="true">
        {pad2(order)} / {pad2(total)}
      </span>
    </article>
  )
}

interface FeaturedCardProps {
  label: string
  repo: ProjectRepo
  image?: string
}

/**
 * One curated featured card. Memoised because the parent re-renders on every
 * page flip of the book below, and these six cards only depend on the resolved
 * repository plus its already-loaded image.
 */
const FeaturedCard = memo(function FeaturedCard({ label, repo, image }: FeaturedCardProps) {
  const tone = toneFor(repo)
  const hasDescription = repo.status.hasDescription

  return (
    <article className="pbk-fcard" style={{ ['--pbk-accent' as string]: tone.accent }}>
      {/* Explicit image frame: fixed aspect ratio, image fills it, centred crop. */}
      <div className="pbk-media">
        {image ? (
          <img
            className="pbk-media-img"
            src={image}
            alt={'Screenshot of ' + repo.name}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : (
          /* No screenshot: same frame, no portrait, no fabricated image. */
          <div className="pbk-media-fallback">
            <span className="pbk-media-fallback-glyph" aria-hidden="true">
              {repo.name.slice(0, 2).toUpperCase()}
            </span>
            <span className="pbk-media-fallback-note">
              No screenshot available for this repository
            </span>
          </div>
        )}
      </div>

      <div className="pbk-fcard-body">
        <div className="pbk-fcard-head">
          <h3 className="pbk-fcard-title">{label}</h3>
          <span className="pbk-tone">{tone.label}</span>
        </div>

        <p className={'pbk-fcard-desc' + (hasDescription ? '' : ' pbk-fcard-desc--empty')}>
          {hasDescription ? repo.description : 'No repository description provided.'}
        </p>

        {repo.technologies.length > 0 && (
          <ul className="pbk-fcard-tech" aria-label="Technologies">
            {repo.technologies.map((t) => (
              <li key={t} className="pbk-chip">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="pbk-fcard-foot">
          <a
            className="pbk-fbtn pbk-fbtn--primary"
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={'View Repository for ' + label}
            data-cursor="open"
            data-no-drag
          >
            <Github size={14} aria-hidden="true" />
            <span>View Repository</span>
          </a>

          {/* Rendered only when a real deployment URL exists. */}
          {repo.status.hasLiveUrl && repo.demoUrl && (
            <a
              className="pbk-fbtn"
              href={repo.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={'View Live for ' + label}
              data-cursor="open"
              data-no-drag
            >
              <span>View Live</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
})

export default function ProjectsBook() {
  const { repos, status, source, error } = useGitHubRepos()
  const { playSFX, sfxEnabled, toggleSFX } = useSFX()
  const [index, setIndex] = useState(0)
  const [images, setImages] = useState<Record<string, string>>({})

  const total = repos.length

  /**
   * Resolve the curated six against the loaded repositories. Entries that do
   * not match a real repository are dropped rather than replaced, so a naming
   * mismatch can never surface fabricated data.
   */
  const featured = useMemo(
    () =>
      FEATURED.flatMap(({ label, name }) => {
        const repo = repos.find((r) => r.name === name)
        return repo ? [{ label, repo }] : []
      }),
    [repos]
  )

  // Keep the index valid if the dataset shrinks (e.g. cache cleared).
  useEffect(() => {
    setIndex((i) => (total > 0 ? Math.min(i, total - 1) : 0))
  }, [total])

  /**
   * Lazy image resolution: only the current page, its immediate neighbours and
   * the featured cards are resolved up front. Everything else loads as it is
   * reached, so the section never pulls every project screenshot at once.
   * The featured cards share this same `images` map with the book below, so an
   * image is resolved once and reused rather than requested twice.
   */
  useEffect(() => {
    const wanted = [
      ...[index - 1, index, index + 1]
        .filter((i) => i >= 0 && i < total)
        .map((i) => repos[i]),
      ...featured.map((f) => f.repo),
    ].filter(Boolean)

    let cancelled = false
    Promise.all(
      wanted.map(async (repo) => {
        const url = await loadLocalImage(repo.name)
        if (url && !cancelled) {
          setImages((prev) => (prev[repo.name] ? prev : { ...prev, [repo.name]: url }))
        }
      })
    )
    return () => {
      cancelled = true
    }
    // images is intentionally omitted: including it would re-run this loop
    // every time one resolves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, repos, total])

  const handleTurn = useCallback(
    (_dir: PageFlipDirection) => {
      // Fires only after a turn actually commits, never on page load.
      playSFX('pageFlip')
    },
    [playSFX]
  )

  const goNext = useCallback(() => {
    setIndex((i) => (i < total - 1 ? i + 1 : i))
  }, [total])

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i))
  }, [])

  const current = repos[index]
  const progressPercent = total > 0 ? ((index + 1) / total) * 100 : 0

  const renderPage = useCallback(
    (i: number) => {
      const repo = repos[i]
      if (!repo) return null
      return <ProjectPage repo={repo} order={i + 1} total={total} image={images[repo.name]} />
    },
    [repos, total, images]
  )

  if (status === 'loading' && total === 0) {
    return (
      <section className="pbk-section">
        <div className="pbk-loading" role="status" aria-live="polite">
          <span className="pbk-loading-dot" />
          Loading repositories from GitHub
        </div>
      </section>
    )
  }

  if (total === 0) {
    return (
      <section className="pbk-section">
        <div className="pbk-empty" role="status">
          <p className="pbk-empty-title">Projects are temporarily unavailable.</p>
          <p className="pbk-empty-note">
            The GitHub API could not be reached{error ? ' (' + error + ')' : ''}. Please try
            again later, or view the profile directly on GitHub.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="pbk-section">
      <header className="pbk-section-head">
        <span className="text-eyebrow text-accent">[ 03. PROJECTS ]</span>
        <span className="h-[1px] w-12 bg-border" />
        <span className="text-xs font-mono text-white/40">
          {total} public {total === 1 ? 'repository' : 'repositories'}
        </span>
        <div className="ml-auto">
          {/* Sound is controlled and persisted independently by the existing
              SoundProvider; flipping works identically while it is off. */}
          <button
            type="button"
            className="pbk-sound"
            onClick={() => {
              playSFX('toggle')
              toggleSFX()
            }}
            aria-pressed={sfxEnabled}
            aria-label={sfxEnabled ? 'Turn sound off' : 'Turn sound on'}
          >
            <span aria-hidden="true">{sfxEnabled ? '\u{1F50A}' : '\u{1F507}'}</span>
            <span>Sound: {sfxEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </header>

      {/* ================== FEATURED PROJECTS (curated six) ================== */}
      <div className="pbk-featured">
        <div className="pbk-featured-head">
          <h2 className="pbk-section-title">Featured Projects</h2>
          <span className="pbk-featured-count">{pad2(featured.length)} Selected</span>
        </div>
        <p className="pbk-featured-note">
          A hand-picked selection from the repositories below — a curation, not a ranking by
          stars, traffic or popularity.
        </p>

        {/* Curated entries that exist only in live GitHub data drop out when the
            snapshot is in use. Say so plainly instead of silently showing fewer. */}
        {featured.length < FEATURED.length && (
          <p className="pbk-featured-partial">
            Showing {pad2(featured.length)} of {pad2(FEATURED.length)} curated projects — the
            remainder are available only from live GitHub data.
          </p>
        )}

        <div className="pbk-featured-grid">
          {featured.map(({ label, repo }) => (
            <FeaturedCard
              key={repo.name}
              label={label}
              repo={repo}
              image={images[repo.name]}
            />
          ))}
        </div>
      </div>

      {/* ================== ALL PROJECTS (full book) ================== */}
      <div className="pbk-split">
        <span className="pbk-split-line" />
        <h2 className="pbk-split-label">All Projects</h2>
        <span className="pbk-split-line" />
      </div>

      <p className="pbk-section-sub">
        Every public repository on the profile, bound as a page. Turn the leaf to browse.
      </p>

      {source === 'fallback' && (
        <p className="pbk-notice" role="status">
          Live GitHub data is unavailable right now, so this book is showing the local
          snapshot committed with this site.
        </p>
      )}

      <div className="pbk-stage">
        <PageFlip
          total={total}
          index={index}
          onIndexChange={setIndex}
          renderPage={renderPage}
          onTurn={handleTurn}
          label={
            'Project book, project ' +
            (index + 1) +
            ' of ' +
            total +
            (current ? ': ' + current.name : '')
          }
        />
      </div>

      <div className="pbk-controls">
        <button
          type="button"
          className="pbk-nav"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous project"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          <span>Previous</span>
        </button>

        <div className="pbk-counter" aria-live="polite" aria-atomic="true">
          <span className="pbk-counter-cur" aria-hidden="true">
            {pad2(index + 1)}
          </span>
          <span className="pbk-counter-sep" aria-hidden="true">
            /
          </span>
          <span className="pbk-counter-total" aria-hidden="true">
            {pad2(total)}
          </span>
          <span className="sr-only">
            Project {index + 1} of {total}
            {current ? '. ' + current.name : ''}
          </span>
        </div>

        <button
          type="button"
          className="pbk-nav"
          onClick={goNext}
          disabled={index >= total - 1}
          aria-label="Next project"
        >
          <span>Next</span>
          <ArrowRight size={15} aria-hidden="true" />
        </button>
      </div>

      <div className="pbk-rail" aria-hidden="true">
        <span className="pbk-rail-fill" style={{ width: progressPercent + '%' }} />
      </div>

      <p className="pbk-hint" aria-hidden="true">
        DRAG · SWIPE · ARROW KEYS
      </p>
    </section>
  )
}

