import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react'
import {
  useGitHubRepos,
  loadLocalImage,
  hasLocalImage,
  type ProjectRepo,
} from '../hooks/useGitHubRepos'
import { useSFX } from '../hooks/useSFX'
import { useSliderPointer } from '../hooks/useSliderPointer'

/* ==========================================================================
   PROJECTS — HORIZONTAL SLIDER

   A sliding showcase of every public repository. There is deliberately NO page,
   leaf, book or document metaphor anywhere in this file: the previous
   page-turn implementation was removed rather than restyled.

   DATA TRUTHFULNESS (unchanged from the section this replaces):
   - Count, order, names, descriptions, tech, stars, forks and links all come
     from the GitHub API via useGitHubRepos. Nothing is hardcoded; the total is
     whatever the dataset actually contains.
   - Repos without a GitHub description render an explicit "not provided" note.
   - A "Live" button only appears when GitHub reports a real homepage.
   - Archived / fork / empty states are shown as badges, never hidden.
   - If the API is unavailable the section falls back to the committed local
     snapshot and says so.

   MOTION BUDGET:
   - Sliding is one CSS transform on a track, driven by a --psl-index variable.
     No layout-animating properties, so nothing reflows while sliding.
   - Pointer spotlight / tilt / screenshot parallax come from
     useSliderPointer, which writes CSS variables inside a single rAF and never
     calls setState.
   ========================================================================== */

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Minimum travel (px) before a drag/swipe is treated as a deliberate slide. */
const SWIPE_THRESHOLD = 56
/** Matches the longest CSS transition so a release can never feel early. */
const TRANSITION_MS = 560

/** Restrained accent derived from REAL repository metadata only. */
function toneFor(repo: ProjectRepo) {
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

/* ==========================================================================
   FEATURED PROJECTS — a hand-curated selection of repositories that ship a
   real screenshot.

   This is a manual curation, NOT an objective ranking by stars, traffic,
   quality or popularity. Each entry maps to a real repository already present
   in `repos` by its exact GitHub name; nothing is defined here beyond a
   display label and a repository name.

   An entry is ALSO skipped when the project has no real committed screenshot:
   a Featured card exists to show the work, so this section must never advertise
   a project behind an empty frame. Screenshot-less projects are not lost — they
   stay in the full slider below and remain reachable by sliding or with the
   arrow keys. `hasLocalImage` is the single source of truth for that check.
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
 * dishonest. Both remain valid projects — they are still in the full slider
 * below, with their explicit no-screenshot fallback.
 */
const FEATURED: FeaturedSpec[] = [
  { name: 'sentinel-soc', label: 'Sentinel SOC' },
  { name: 'velora-fintech-landing-page', label: 'VELORA' },
  { name: 'vigil-cloud-security', label: 'VIGIL — Cloud Security Intelligence' },
  { name: 'nexus-dashboard', label: 'Nexus Dashboard' },
]

/** The screenshot frame. Shared by the featured grid and the slider card. */
function ProjectImage({ image, name }: { image?: string; name: string }) {
  if (image) {
    return (
      <img
        className="psl-img"
        src={image}
        alt={'Screenshot of ' + name}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    )
  }
  /* Explicit fallback. No capture exists for this repository and no substitute
     image is used in its place. */
  return (
    <div className="psl-abstract" aria-hidden="true">
      <span className="psl-abstract-glyph">{name.slice(0, 2).toUpperCase()}</span>
      <span className="psl-abstract-note">Preview unavailable</span>
    </div>
  )
}

/** Repository-state badges. Never a substitute for hiding a project. */
function StatusFlags({ repo }: { repo: ProjectRepo }) {
  return (
    <>
      {repo.status.isArchived && <span className="psl-flag">Archived</span>}
      {repo.status.isFork && <span className="psl-flag">Fork</span>}
      {repo.status.isEmpty && <span className="psl-flag">Empty</span>}
      {repo.status.isDisabled && <span className="psl-flag">Disabled</span>}
    </>
  )
}

/** "View Repository" is always real; "Live" only when GitHub gave a homepage. */
function ProjectActions({ repo, compact }: { repo: ProjectRepo; compact?: boolean }) {
  return (
    <div className={'psl-actions' + (compact ? ' psl-actions--compact' : '')}>
      <a
        className="psl-btn psl-btn--primary"
        href={repo.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={'View repository ' + repo.name + ' on GitHub'}
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
          className="psl-btn"
          href={repo.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={'View live project ' + repo.name}
          data-cursor="open"
          data-cursor-text="LIVE"
          data-magnetic
          data-no-drag
        >
          <span>View Live</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
    </div>
  )
}

/**
 * One curated featured card. Memoised because the parent re-renders on every
 * slide, and these only depend on the resolved repository plus its loaded image.
 */
const FeaturedCard = memo(function FeaturedCard({
  label,
  repo,
  image,
}: {
  label: string
  repo: ProjectRepo
  image?: string
}) {
  const tone = toneFor(repo)
  const hasDescription = repo.status.hasDescription

  return (
    <article className="psl-fcard" style={{ ['--psl-accent' as string]: tone.accent }}>
      <div className="psl-fcard-media">
        <ProjectImage image={image} name={repo.name} />
      </div>

      <div className="psl-fcard-body">
        <div className="psl-fcard-head">
          <h3 className="psl-fcard-title">{label}</h3>
          <span className="psl-tone">{tone.label}</span>
        </div>

        <p className={'psl-fcard-desc' + (hasDescription ? '' : ' psl-fcard-desc--empty')}>
          {hasDescription ? repo.description : 'No repository description provided.'}
        </p>

        {repo.technologies.length > 0 && (
          <ul className="psl-chips" aria-label="Technologies">
            {repo.technologies.map((t) => (
              <li key={t} className="psl-chip">
                {t}
              </li>
            ))}
          </ul>
        )}

        <div className="psl-fcard-foot">
          <ProjectActions repo={repo} compact />
        </div>
      </div>
    </article>
  )
})

export default function ProjectsSlider() {
  const { repos, status, source, error } = useGitHubRepos()
  const { playSFX, sfxEnabled, toggleSFX } = useSFX()
  const [index, setIndex] = useState(0)
  const [images, setImages] = useState<Record<string, string>>({})

  const total = repos.length
  const canPrev = index > 0
  const canNext = index < total - 1

  /**
   * Resolve the curated set against the loaded repositories, then keep only the
   * entries that have a real committed screenshot. Both drop reasons are counted
   * separately so the section can explain itself honestly instead of silently
   * showing fewer cards.
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
   * Lazy image resolution: only the active slide, its immediate neighbours and
   * the featured cards are resolved up front. Everything else loads as it is
   * reached, so the section never pulls every project screenshot at once. The
   * featured cards share this same `images` map, so an image is resolved once.
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

  /* ==========================================================================
     SLIDE COMMIT

     Every input — button, keyboard, drag release, swipe — funnels through
     `commit`, so there is exactly one navigation path and the transition and
     the sound always fire together, exactly once per real move. Clamping (not
     looping) matches the brief: the first item disables Previous and the last
     disables Next.
     ========================================================================== */
  const commit = useCallback(
    (next: number) => {
      if (total === 0) return
      const clamped = Math.max(0, Math.min(total - 1, next))
      /* Bail ONLY when the move is a genuine no-op: the clamped target is
         already the active slide, i.e. we are sitting on a boundary.

         This must be compared against the CURRENT index, not against the
         requested value. Comparing against `next` is inverted — an in-range
         target always satisfies `clamped === next`, so every valid step was
         rejected and only the clamped boundary no-ops were applied. */
      if (clamped === index) return
      setIndex(clamped)
      playSFX('nav')
    },
    [total, index, playSFX]
  )

  const goNext = useCallback(() => commit(index + 1), [commit, index])
  const goPrev = useCallback(() => commit(index - 1), [commit, index])

  /* Pointer-reactive depth + spotlight live on the stage WRAPPER, so the cards
     keep sole ownership of their own slide transform. The hook itself disables
     everything for touch/pen and for prefers-reduced-motion.

     This MUST sit with the other hooks, above the early returns further down: a
     hook called conditionally is a hooks-order violation that unmounts the tree. */
  const stageRef = useSliderPointer<HTMLDivElement>()
  const stageElRef = useRef<HTMLDivElement | null>(null)
  const setStageNode = useCallback(
    (node: HTMLDivElement | null) => {
      stageElRef.current = node
      stageRef(node)
    },
    [stageRef]
  )

  /* ==========================================================================
     DRAG / SWIPE

     Pointer Events cover mouse drag and touch swipe with one code path. The
     live offset is written straight to a CSS variable (never to React state),
     so dragging cannot re-render the tree; only the release commits an index.
     ========================================================================== */
  const drag = useRef({
    active: false,
    startX: 0,
    startY: 0,
    dx: 0,
    axis: null as 'x' | 'y' | null,
    pointerId: -1,
  })

  /** Written directly to the DOM: this runs at pointer frequency. */
  const setDragOffset = useCallback((px: number) => {
    const stage = stageElRef.current
    if (!stage) return
    stage.style.setProperty('--psl-drag', px.toFixed(1) + 'px')
  }, [])

  const endDrag = useCallback(
    (commitOnRelease: boolean) => {
      const state = drag.current
      drag.current = { active: false, startX: 0, startY: 0, dx: 0, axis: null, pointerId: -1 }
      stageElRef.current?.classList.remove('is-dragging')
      setDragOffset(0)
      if (!commitOnRelease) return
      if (Math.abs(state.dx) >= SWIPE_THRESHOLD) {
        commit(state.dx < 0 ? index + 1 : index - 1)
      }
    },
    [commit, index, setDragOffset]
  )

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    /* Interactive children (links/buttons) keep their own behaviour. */
    const target = e.target as HTMLElement
    if (target.closest('a, button, [data-no-drag]')) return
    if (e.pointerType === 'mouse' && e.button !== 0) return

    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      dx: 0,
      axis: null,
      pointerId: e.pointerId,
    }
  }, [])

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const state = drag.current
      if (!state.active || e.pointerId !== state.pointerId) return

      const dx = e.clientX - state.startX
      const dy = e.clientY - state.startY

      /* Lock the gesture axis once, after a small deadzone. This is what keeps a
         vertical page scroll from being swallowed: a mostly-vertical drag is
         released straight back to the browser, and `touch-action: pan-y` on the
         stage lets the browser own vertical scrolling in the first place. */
      if (state.axis === null) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
        if (state.axis === 'x') {
          stageElRef.current?.classList.add('is-dragging')
        }
      }
      if (state.axis !== 'x') return

      /* Rubber-band past the ends so the finite collection visibly resists. */
      const atStart = index === 0 && dx > 0
      const atEnd = index === total - 1 && dx < 0
      state.dx = atStart || atEnd ? dx * 0.32 : dx
      setDragOffset(state.dx)
    },
    [index, total, setDragOffset]
  )

  const onPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (!drag.current.active || e.pointerId !== drag.current.pointerId) return
      endDrag(true)
    },
    [endDrag]
  )

  const onPointerCancel = useCallback(() => endDrag(false), [endDrag])

  /**
   * Keyboard navigation. Bound to the slider stage rather than the document, so
   * the arrow keys never hijack normal page scrolling for a visitor who has not
   * actually focused the slider.
   */
  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        commit(index + 1)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        commit(index - 1)
      }
    },
    [commit, index]
  )

  const current = repos[index]
  /* The track renders EVERY repository as a stably-keyed child. That is what
     makes this a real slide instead of a crossfade: advancing one step reuses
     the existing DOM nodes, which physically translate, and the outgoing card
     leaves through the left edge. A 3-item window would look right in the
     middle of the collection but collapse to two children at the ends, which
     silently breaks the centring. Screenshots are still resolved lazily for only
     the active slide and its immediate neighbours, so this costs no extra
     network: every off-screen card simply shows its honest no-screenshot
     placeholder until it is actually reached. */

  if (status === 'loading' && total === 0) {
    return (
      <section className="psl-section">
        <div className="psl-loading" role="status" aria-live="polite">
          <span className="psl-loading-dot" />
          Loading repositories from GitHub
        </div>
      </section>
    )
  }

  if (total === 0) {
    return (
      <section className="psl-section">
        <div className="psl-empty" role="status">
          <p className="psl-empty-title">Projects are temporarily unavailable.</p>
          <p className="psl-empty-note">
            The GitHub API could not be reached{error ? ' (' + error + ')' : ''}. Please try
            again later, or view the profile directly on GitHub.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="psl-section">
      <header className="psl-section-head">
        <span className="text-eyebrow text-accent">[ 03. PROJECTS ]</span>
        <span className="h-[1px] w-12 bg-border" />
        <span className="text-xs font-mono text-white/40">
          {total} public {total === 1 ? 'repository' : 'repositories'}
        </span>
        <div className="ml-auto">
          {/* Sound is controlled and persisted independently by the existing
              SoundProvider; sliding works identically while it is off. */}
          <button
            type="button"
            className="psl-sound"
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
      <div className="psl-featured">
        <div className="psl-featured-head">
          <h2 className="psl-section-title">Featured Projects</h2>
          <span className="psl-featured-count">{pad2(featured.items.length)} Selected</span>
        </div>
        <p className="psl-featured-note">
          A hand-picked selection of work that ships a real screenshot, committed with this
          site.
        </p>

        {/* Two separate, honest explanations rather than one blanket excuse: an
            entry can be missing because the local snapshot lacks it, or because
            the project genuinely has no screenshot to show. */}
        {featured.unresolved > 0 && (
          <p className="psl-partial">
            Showing {pad2(featured.items.length)} of {pad2(FEATURED.length)} curated projects —{' '}
            {pad2(featured.unresolved)}{' '}
            {featured.unresolved === 1 ? 'entry is' : 'entries are'} available only from live
            GitHub data.
          </p>
        )}

        {featured.imageLess > 0 && (
          <p className="psl-partial">
            {pad2(featured.imageLess)}{' '}
            {featured.imageLess === 1 ? 'curated project has' : 'curated projects have'} no
            screenshot to show, so {featured.imageLess === 1 ? 'it is' : 'they are'} listed in
            the full slider below instead.
          </p>
        )}

        {featured.items.length === 0 && (
          <p className="psl-partial">
            No featured project currently has a committed screenshot to display.
          </p>
        )}

        <div className="psl-featured-grid">
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

      {/* ================== ALL PROJECTS (slider) ================== */}
      <div className="psl-split">
        <span className="psl-split-line" />
        <h2 className="psl-split-label">All Projects</h2>
        <span className="psl-split-line" />
      </div>

      <p className="psl-section-sub">
        Every public repository on the profile. Slide through them, drag, swipe, or use the
        arrow keys.
      </p>

      {source === 'fallback' && (
        <p className="psl-notice" role="status">
          Live GitHub data is unavailable right now, so this section is showing the local
          snapshot committed with this site.
        </p>
      )}

      {/* The slider. `role="group"` + tabIndex makes the whole stage reachable so
          the arrow keys work once it is focused, without ever stealing arrow
          keys from a visitor who is simply scrolling the page.
          `touch-action: pan-y` (CSS) lets the browser keep vertical scrolling. */}
      <div
        className="psl-stage"
        ref={setStageNode}
        style={{ ['--psl-index' as string]: index }}
        role="group"
        aria-roledescription="carousel"
        aria-label={'Project showcase, project ' + (index + 1) + ' of ' + total}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        data-cursor="drag"
        data-cursor-text="SLIDE"
      >
        <div className="psl-track">
          {repos.map((repo, i) => {
            const isActive = i === index
            const tone = toneFor(repo)

            return (
              <article
                key={repo.name}
                className={'psl-slide' + (isActive ? ' is-active' : '')}
                style={{ ['--psl-accent' as string]: tone.accent }}
                /* Only the active card is exposed. The peeking neighbours are
                   decorative duplicates of projects the visitor can reach with
                   the arrows, the swipe or by sliding. */
                aria-hidden={!isActive}
                {...(isActive ? {} : { inert: '' })}
              >
                <div className="psl-shot">
                  <ProjectImage image={images[repo.name]} name={repo.name} />
                  <span className="psl-shot-veil" aria-hidden="true" />
                  {/* Mouse-follow spotlight. Kept small and low-opacity so it
                      reveals detail near the pointer rather than glowing. */}
                  <span className="psl-spot" aria-hidden="true" />
                  <span className="psl-shot-index" aria-hidden="true">
                    {pad2(i + 1)}
                  </span>
                </div>

                <div className="psl-info">
                  <header className="psl-card-head">
                    <span className="psl-tone">{tone.label}</span>
                    <StatusFlags repo={repo} />
                    <span className="psl-lang">{repo.language || '—'}</span>
                  </header>

                  <h3 className="psl-title">
                    <span className="psl-title-text">{repo.name}</span>
                  </h3>

                  <p
                    className={
                      'psl-desc' + (repo.status.hasDescription ? '' : ' psl-desc--empty')
                    }
                  >
                    {repo.status.hasDescription
                      ? repo.description
                      : 'No repository description provided.'}
                  </p>

                  {repo.technologies.length > 0 && (
                    <ul className="psl-chips" aria-label="Technologies">
                      {repo.technologies.slice(0, 6).map((t) => (
                        <li key={t} className="psl-chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <ProjectActions repo={repo} />
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* Controls + counter. One navigation surface, with first/last disabled so
          the ends of a finite collection are explicit rather than looping. */}
      <div className="psl-controls">
        <button
          type="button"
          className="psl-arrow"
          onClick={goPrev}
          disabled={!canPrev}
          aria-label="Previous project"
          data-cursor="drag"
          data-cursor-text="PREV"
          data-magnetic
          data-no-drag
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>

        <div className="psl-counter" aria-hidden="true">
          {/* `key` forces a remount per slide so the CSS entry animation
              replays. The values themselves still come from the dataset. */}
          <span className="psl-counter-cur" key={'cur-' + index}>
            {pad2(index + 1)}
          </span>
          <span className="psl-counter-sep">/</span>
          <span className="psl-counter-total">{pad2(total)}</span>
          <span className="psl-counter-name">{current ? current.name : ''}</span>
        </div>

        <button
          type="button"
          className="psl-arrow"
          onClick={goNext}
          disabled={!canNext}
          aria-label="Next project"
          data-cursor="drag"
          data-cursor-text="NEXT"
          data-magnetic
          data-no-drag
        >
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>

      {/* Polite live region, kept OUTSIDE the sliding track so it is never
          duplicated by a card caught mid-transition. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        Project {index + 1} of {total}
        {current ? '. ' + current.name : ''}
      </p>

      <div className="psl-rail" aria-hidden="true">
        <span className="psl-rail-fill" style={{ width: ((index + 1) / total) * 100 + '%' }} />
      </div>

      <p className="psl-hint" aria-hidden="true">
        DRAG · SWIPE · ARROW KEYS
      </p>
    </section>
  )
}
