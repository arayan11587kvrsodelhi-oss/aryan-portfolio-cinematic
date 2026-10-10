import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Gamepad2, Github, Play, X } from 'lucide-react'
import { games, type Game } from '../data/games'
import { useSFX } from '../hooks/useSFX'
import typingRacerRace from '../assets/photos/typing-racer-race.png'
import cybertagImage from '../assets/photos/cybertag-arena.png'

/* ==========================================================================
   PLAY GAME — the arcade rail

   This section is ADDITIVE. CyberTag Arena was already reachable from the
   navigation and keeps working exactly as before; the Typing Car Racer is
   added as a second entry rather than replacing it.

   Every action resolves to a real URL:
     Play Now    -> the deployed game (never the source repository)
     View Source -> the GitHub repository

   The styling deliberately reuses the existing design-system tokens
   (--accent / --surface / --border / --muted, Space Grotesk + JetBrains Mono)
   and the same 44px touch targets, visible hover and visible focus ring used
   by the project cards, so nothing here introduces a new visual language.
   ========================================================================== */

const EASE = [0.16, 1, 0.3, 1] as const

/** Real committed screenshots only. Keyed by the value used in games.ts. */
const GAME_IMAGES: Record<string, string> = {
  'typing-racer-race': typingRacerRace,
  'cybertag-arena': cybertagImage,
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  return reduced
}

export default function PlayGame() {
  const { playSFX } = useSFX()
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState<Game | null>(null)

  return (
    <section id="play-game" className="relative z-10 bg-background text-foreground">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pt-[var(--spacing-section)] pb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-eyebrow text-accent">[ 05. ARCADE ]</span>
          <span className="h-[1px] w-12 bg-border" />
          <span className="text-xs font-mono text-white/50">{games.length} Playable Builds</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white">
              PLAY&nbsp;GAME
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl font-mono">
              Browser games I designed and built. Each one opens in its own live deployment.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/40">
            <Gamepad2 size={14} className="text-accent" />
            <span>SELECT A GAME TO PLAY</span>
          </div>
        </div>
      </div>

      {/* Game selection rail. A real list of cards: each card is one game and
          carries its own Play Now / View Source pair, so a card is never a
          dead end and no entry is duplicated. */}
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pb-[var(--spacing-section)]">
        <ul className="pg-grid" aria-label="Available games">
          {games.map((game) => (
            <li key={game.id}>
              <GameCard
                game={game}
                image={GAME_IMAGES[game.image]}
                reduced={reduced}
                onHover={() => playSFX('hover')}
                onInspect={() => {
                  playSFX('projectOpen')
                  setActive(game)
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {active && (
          <GameDetail game={active} image={GAME_IMAGES[active.image]} reduced={reduced} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* One game card                                                              */
/* -------------------------------------------------------------------------- */

function GameCard({
  game,
  image,
  reduced,
  onHover,
  onInspect,
}: {
  game: Game
  image?: string
  reduced: boolean
  onHover: () => void
  onInspect: () => void
}) {
  const inDev = game.status === 'In Development'

  return (
    <article className="pg-card" style={{ ['--pg-accent' as string]: game.accent }} onMouseEnter={onHover}>
      <div className="pg-card-media">
        {image ? (
          <img
            className="pg-card-img"
            src={image}
            alt={`Gameplay screenshot of ${game.title}`}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : (
          /* Explicit fallback. No fabricated gameplay image is ever used. */
          <div className="pg-card-noimg" aria-hidden="true">
            <span>{game.title.slice(0, 2)}</span>
          </div>
        )}

        <span className={`pg-card-status ${inDev ? 'pg-card-status--dev' : ''}`}>{game.status}</span>
      </div>

      <div className="pg-card-body">
        <div className="pg-card-head">
          <span className="pg-card-cat">{game.category}</span>
        </div>

        <h3 className="pg-card-title">{game.title}</h3>
        <p className="pg-card-tagline">{game.tagline}</p>
        <p className="pg-card-desc">{game.description}</p>

        <ul className="pg-card-tech" aria-label={`${game.title} technologies`}>
          {game.tech.map((t) => (
            <li key={t} className="pg-card-chip">
              {t}
            </li>
          ))}
        </ul>

        {/* Both actions are real anchors. Play Now is the deployed game;
            View Source is the repository. Never swapped. */}
        <div className="pg-card-actions">
          <a
            className="pg-btn pg-btn--primary"
            href={game.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={onHover}
            aria-label={`Play ${game.title} — opens the live game in a new tab`}
            data-cursor="open"
            data-cursor-text="PLAY"
            data-magnetic
          >
            <Play size={14} aria-hidden="true" />
            <span>Play Now</span>
          </a>

          <a
            className="pg-btn"
            href={game.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={onHover}
            aria-label={`View the ${game.title} source code on GitHub — opens in a new tab`}
            data-cursor="open"
            data-cursor-text="SOURCE"
            data-magnetic
          >
            <Github size={14} aria-hidden="true" />
            <span>View Source</span>
          </a>

          <button
            type="button"
            className="pg-btn pg-btn--ghost"
            onClick={onInspect}
            onMouseEnter={onHover}
            aria-label={`Read more about ${game.title}`}
            data-cursor="view"
            data-cursor-text="DETAILS"
          >
            <span>Details</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {reduced ? null : <span className="pg-card-glow" aria-hidden="true" />}
    </article>
  )
}


/* -------------------------------------------------------------------------- */
/* Detail modal — ESC to close, focus management, scroll lock                */
/* -------------------------------------------------------------------------- */

function GameDetail({
  game,
  image,
  reduced,
  onClose,
}: {
  game: Game
  image?: string
  reduced: boolean
  onClose: () => void
}) {
  const { playSFX } = useSFX()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSFX('modalClose')
        onClose()
      }
    }

    const onTrapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) {
        event.preventDefault()
        return
      }
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keydown', onTrapFocus)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keydown', onTrapFocus)
    }
  }, [onClose, playSFX])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-background/92 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pg-detail-title"
      onClick={onClose}
      data-cursor="close"
      data-cursor-text="CLOSE"
    >
      <motion.div
        ref={panelRef}
        tabIndex={-1}
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 24 }}
        transition={{ duration: reduced ? 0.01 : 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-surface border border-border shadow-2xl rounded-md my-auto max-h-[94vh] flex flex-col overflow-hidden text-foreground"
        style={{ ['--pg-accent' as string]: game.accent }}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-border bg-background/95 backdrop-blur-md">
          <span className="text-eyebrow text-accent border border-accent/40 bg-accent/5 px-2.5 py-1 rounded text-[0.62rem] sm:text-xs">
            {game.status.toUpperCase()}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => {
              playSFX('modalClose')
              onClose()
            }}
            onMouseEnter={() => playSFX('hover')}
            className="p-2 text-muted hover:text-foreground hover:bg-white/10 rounded-full transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close game details"
            data-cursor="close"
            data-cursor-text="CLOSE"
          >
            <X size={18} />
          </button>
        </div>


        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <p className="text-eyebrow text-muted">{game.category}</p>
            <h2
              id="pg-detail-title"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white mt-1"
            >
              {game.title}
            </h2>
            <p className="text-accent text-sm sm:text-base font-mono mt-1">{game.tagline}</p>
          </div>

          {image && (
            <div className="rounded-md overflow-hidden border border-border bg-black/50">
              {/* object-contain preserves the 16:9 capture's true aspect ratio:
                  the screenshot is never stretched or cropped. */}
              <img
                src={image}
                alt={`Gameplay screenshot of ${game.title}`}
                decoding="async"
                className="w-full h-auto max-h-[52vh] object-contain"
              />
            </div>
          )}

          <p className="text-muted text-sm leading-relaxed">{game.description}</p>

          <section aria-labelledby="pg-features">
            <h3
              id="pg-features"
              className="text-sm font-semibold tracking-wider uppercase text-accent mb-2 border-b border-border/40 pb-1"
            >
              What Is Built
            </h3>
            <ul className="space-y-1.5 text-muted text-sm list-disc list-inside leading-relaxed">
              {game.keyFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="pg-tech">
            <h3
              id="pg-tech"
              className="text-sm font-semibold tracking-wider uppercase text-accent mb-2 border-b border-border/40 pb-1"
            >
              Technology
            </h3>
            <ul className="flex flex-wrap gap-2" aria-label={`${game.title} technologies`}>
              {game.tech.map((t) => (
                <li key={t} className="pg-card-chip">
                  {t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="sticky bottom-0 z-20 p-4 sm:p-5 border-t border-border bg-background/95 backdrop-blur-md flex flex-wrap items-center gap-3">
          <a
            href={game.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSFX('click')}
            onMouseEnter={() => playSFX('hover')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-display text-xs sm:text-sm font-semibold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(53,224,224,0.3)] min-h-[44px]"
            aria-label={`Play ${game.title} — opens the live game in a new tab`}
          >
            <Play size={14} aria-hidden="true" />
            <span>Play Now</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          <a
            href={game.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => playSFX('click')}
            onMouseEnter={() => playSFX('hover')}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-border bg-surface text-foreground hover:border-accent hover:text-accent font-display text-xs sm:text-sm rounded-full transition-colors min-h-[44px]"
            aria-label={`View the ${game.title} source code on GitHub — opens in a new tab`}
          >
            <Github size={14} aria-hidden="true" />
            <span>View Source</span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

