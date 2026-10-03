import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Star, GitFork } from 'lucide-react'
import PageFlip, { type PageFlipDirection, type PageFlipHandle } from './PageFlip'
import {
  useGitHubRepos,
  loadLocalImage,
  hasLocalImage,
  type ProjectRepo,
} from '../hooks/useGitHubRepos'
import { useSFX } from '../hooks/useSFX'
import { useBookPointer } from '../hooks/useBookPointer'

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
   FEATURED PROJECTS — a hand-curated selection of repositories that ship a real
   screenshot.

   This is a manual curation, NOT an objective ranking by stars, traffic,
   quality or popularity. Each entry maps to a real repository already present
   in `repos` by its exact GitHub name; nothing is defined here beyond a
   display label and a repository name.

   `name` must match the GitHub repository name exactly (case-sensitive), e.g.
   "Nexa-ai". If a repository does not resolve it is simply skipped rather than
   substituted with invented data.

   An entry is ALSO skipped when the project has no real, committed screenshot:
   a Featured card exists to show the work, and this section must never
   advertise a project behind an empty frame. Screenshot-less projects are not
   lost - they stay in the full book below under their existing honest
   "no screenshot available" fallback and remain reachable with Previous /
   Next. `hasLocalImage` is the single source of truth for that check.
   ========================================================================== */

interface FeaturedSpec {
  /** Exact GitHub repository name. */
  name: string
  /** Curated display title. */
  label: string
}

/**
 * Only repositories that ship a real screenshot are listed here.
 *
 * Nexa-ai and cyberdesk-incident-management-platform are deliberately absent:
 * neither has an image in `src/assets/photos`, and fabricating one would be
 * dishonest. Both remain valid projects - they are still bound as pages in the
 * full book below, with their explicit no-screenshot fallback, and can be
 * reached like any other project with Previous / Next.
 */
const FEATURED: FeaturedSpec[] = [
  { name: 'sentinel-soc', label: 'Sentinel SOC' },
  { name: 'velora-fintech-landing-page', label: 'VELORA' },
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
  /**
   * Previous / Next over the WHOLE collection, not the featured subset. These
   * are the book's own turn functions, so a click animates the leaf and plays
   * the existing page-flip sound instead of snapping the page.
   */
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
  /**
   * Neighbour names, used only for the compact hover peek on Previous / Next.
   * Taken from the same `repos` array as everything else, so nothing extra is
   * fetched and the peek can never describe a project that is not in the book.
   */
  prevName?: string
  nextName?: string
}

function ProjectPage({
  repo,
  order,
  total,
  image,
  onPrev,
  onNext,
  canPrev,
  canNext,
  prevName,
  nextName,
}: ProjectPageProps) {
  const tone = toneFor(repo)

  return (
    /* Pointer + custom-cursor context for the page surface itself. The cursor
       already understands these states; no second cursor is introduced. */
    <article
      className="pbk-page"
      style={{ ['--pbk-accent' as string]: tone.accent }}
      data-cursor="view"
      data-cursor-text="VIEW"
    >
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

        {/* Media sits beside the details on a wide page and stacks above them on
            a narrow one, so the screenshot gets real room to be inspected. */}
        <div className="pbk-body">
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
              /* Explicit fallback. No capture exists for this repository and no
                 substitute image is used in its place. */
              <div className="pbk-abstract" aria-hidden="true">
                <span className="pbk-abstract-glyph">
                  {repo.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="pbk-abstract-note">Project preview unavailable</span>
              </div>
            )}
          </div>

          <div className="pbk-info">
            <h3 className="pbk-title">{repo.name}</h3>

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

              {/* Same action treatment as the featured cards: one primary, and a
                  secondary only when a real deployment URL exists. No disabled
                  placeholder is ever rendered for a project without one. */}
              <div className="pbk-actions">
                <a
                  className="pbk-action pbk-action--primary"
                  href={repo.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View repository ${repo.name} on GitHub`}
                  data-cursor="open"
                  data-cursor-text="REPO"
                  data-magnetic
                  data-no-drag
                >
                  <Github size={14} aria-hidden="true" />
                  <span>View Repository</span>
                </a>

                {repo.status.hasLiveUrl && repo.demoUrl && (
                  <a
                    className="pbk-action"
                    href={repo.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View live project ${repo.name}`}
                    data-cursor="open"
                    data-cursor-text="LIVE"
                    data-magnetic
                    data-no-drag
                  >
                    <span>View Live Project</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </footer>
          </div>
        </div>

        {/* Previous / Next across the COMPLETE collection, routed through the
            book's own turn mechanism so the flip animation and the existing
            page-flip sound are reused rather than duplicated. Both the position
            and the total are derived from the live dataset. */}
        <nav className="pbk-pagenav" aria-label="Project navigation">
          <button
            type="button"
            className="pbk-nav"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous project"
            data-cursor="drag"
            data-cursor-text="PREV"
            data-magnetic
            data-no-drag
          >
            <ArrowLeft size={15} aria-hidden="true" />
            <span className="pbk-nav-label">
              Previous<span className="pbk-nav-word"> Project</span>
            </span>
            {/* Compact peek. Purely additive decoration: it is hidden from
                assistive tech and the button already names itself. */}
            {canPrev && prevName && (
              <span className="pbk-peek" aria-hidden="true">
                <span className="pbk-peek-kicker">Previous</span>
                <span className="pbk-peek-name">{prevName}</span>
              </span>
            )}
          </button>

          <span className="pbk-pagenav-count" aria-hidden="true">
            {/* `key` forces a remount per page so the CSS entry animation
                replays. The value itself is still derived from the dataset. */}
            <span className="pbk-pagenav-cur" key={'cur-' + order}>
              {pad2(order)}
            </span>
            <span className="pbk-pagenav-sep">/</span>
            <span className="pbk-pagenav-total">{pad2(total)}</span>
          </span>

          <button
            type="button"
            className="pbk-nav"
            onClick={onNext}
            disabled={!canNext}
            aria-label="Next project"
            data-cursor="drag"
            data-cursor-text="NEXT"
            data-magnetic
            data-no-drag
          >
            <span className="pbk-nav-label">
              Next<span className="pbk-nav-word"> Project</span>
            </span>
            <ArrowRight size={15} aria-hidden="true" />
            {canNext && nextName && (
              <span className="pbk-peek pbk-peek--next" aria-hidden="true">
                <span className="pbk-peek-kicker">Next</span>
                <span className="pbk-peek-name">{nextName}</span>
              </span>
            )}
          </button>
        </nav>
      </div>
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
  /* Handle on the book, so the in-page Previous / Next buttons drive the
     component's own animated turn instead of a second navigation path. */
  const flipRef = useRef<PageFlipHandle>(null)

  const total = repos.length

  /**
   * Resolve the curated set against the loaded repositories, then keep only the
   * entries that have a real, committed screenshot. Both drop reasons are
   * counted separately so the section can explain itself honestly instead of
   * silently showing fewer cards.
   */
  const featured = useMemo(() => {
    const items: { label: string; repo: ProjectRepo }[] = []
    let unresolved = 0
    let imageLess = 0

    for (const { label, name } of FEATURED) {
      const repo = repos.find((r) => r.name === name)
      if (!repo) {
        unresolved += 1
      } else if (!hasLocalImage(repo.name)) {
        imageLess += 1
      } else {
        items.push({ label, repo })
      }
    }

    return { items, unresolved, imageLess }
  }, [repos])

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
      ...featured.items.map((f) => f.repo),
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

  const canPrev = index > 0
  const canNext = index < total - 1

  /* Turns are requested from the book itself rather than by writing the index
     here, so a button click runs the same animated commit as a swipe or an
     arrow key, and fires the existing page-flip sound exactly once. */
  const goNext = useCallback(() => {
    flipRef.current?.next()
  }, [])

  const goPrev = useCallback(() => {
    flipRef.current?.prev()
  }, [])

  /* Pointer-reactive depth lives on the stage WRAPPER, so PageFlip keeps sole
     ownership of the leaf's inline rotateY transform. Disabled for touch and for
     prefers-reduced-motion inside the hook itself.

     This MUST sit with the other hooks, above the early returns further down: a
     hook called conditionally is a hooks-order violation that unmounts the tree. */
  const stageRef = useBookPointer<HTMLDivElement>()

  const current = repos[index]
  const progressPercent = total > 0 ? ((index + 1) / total) * 100 : 0

  const renderPage = useCallback(
    (i: number) => {
      const repo = repos[i]
      if (!repo) return null
      return (
        <ProjectPage
          repo={repo}
          order={i + 1}
          total={total}
          image={images[repo.name]}
          onPrev={goPrev}
          onNext={goNext}
          canPrev={canPrev}
          canNext={canNext}
          prevName={repos[i - 1]?.name}
          nextName={repos[i + 1]?.name}
        />
      )
    },
    [repos, total, images, goPrev, goNext, canPrev, canNext]
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

      {/* ================== FEATURED PROJECTS (curated) ================== */}
      <div className="pbk-featured">
        <div className="pbk-featured-head">
          <h2 className="pbk-section-title">Featured Projects</h2>
          <span className="pbk-featured-count">{pad2(featured.items.length)} Selected</span>
        </div>
        <p className="pbk-featured-note">
          A hand-picked selection from the repositories below — a curation, not a ranking by
          stars, traffic or popularity. Every project shown here ships a real screenshot
          committed with this site.
        </p>

        {/* Two separate, honest explanations rather than one blanket excuse: an
            entry can be missing because the local snapshot lacks it, or because
            the project genuinely has no screenshot to show. */}
        {featured.unresolved > 0 && (
          <p className="pbk-featured-partial">
            Showing {pad2(featured.items.length)} of {pad2(FEATURED.length)} curated projects —{' '}
            {pad2(featured.unresolved)}{' '}
            {featured.unresolved === 1 ? 'entry is' : 'entries are'} available only from live
            GitHub data.
          </p>
        )}

        {featured.imageLess > 0 && (
          <p className="pbk-featured-partial">
            {pad2(featured.imageLess)}{' '}
            {featured.imageLess === 1 ? 'curated project has' : 'curated projects have'} no
            screenshot to show, so {featured.imageLess === 1 ? 'it is' : 'they are'} listed in
            the full book below instead.
          </p>
        )}

        {featured.items.length === 0 && (
          <p className="pbk-featured-partial">
            No featured project currently has a committed screenshot to display.
          </p>
        )}

        <div className="pbk-featured-grid">
          {featured.items.map(({ label, repo }) => (
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

      <div className="pbk-stage" ref={stageRef}>
        <PageFlip
          ref={flipRef}
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

      {/* The Previous / Next controls now live on the page itself, so this is
          the section's only navigation. This live region is kept OUTSIDE the
          flipping leaf: the leaf briefly contains a second copy of the page
          mid-turn, and a duplicated live region would announce twice. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Project {index + 1} of {total}
        {current ? '. ' + current.name : ''}
      </p>

      <div className="pbk-rail" aria-hidden="true">
        <span className="pbk-rail-fill" style={{ width: progressPercent + '%' }} />
      </div>

      <p className="pbk-hint" aria-hidden="true">
        DRAG · SWIPE · ARROW KEYS
      </p>
    </section>
  )
}

