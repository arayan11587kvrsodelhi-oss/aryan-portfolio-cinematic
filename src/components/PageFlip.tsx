import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type Ref,
} from 'react'

/* ==========================================================================
   SHARED PAGE-FLIP
   Extracted from the existing certificate viewer (.cflip-*) so the project has
   ONE page-turn system rather than two competing ones. Rotation model, shadow
   curve and highlight curve are identical to the certificate implementation;
   only the slot content is supplied by the caller.

   Mechanics:
   - Two-sided leaf (front + back) rotating around the correct page edge.
   - Direction aware: next rotates toward the left (origin right), prev toward
     the right (origin left).
   - Shadow opacity and specular highlight are driven per-frame from the live
     rotation angle, so the lighting tracks the physical page.
   - Pointer drag follows the finger 1:1, then commits or reverts on release.
   - A ref-guarded transition lock makes rapid clicks / swipes impossible to
     corrupt: a second turn is ignored while one is in flight.
   - Reduced motion short-circuits to an instant, fully functional swap.
   ========================================================================== */

export const PAGE_TURN_MS = 680
export const PAGE_COMMIT_THRESHOLD = 0.3

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export type PageFlipDirection = 'next' | 'prev'

/**
 * Imperative surface exposed by the book.
 *
 * External controls (the in-page Previous / Next buttons) use this instead of
 * writing the page index directly, so a button click travels the exact same
 * commit path as a swipe or an arrow key: the 3D turn runs, the transition lock
 * applies, and `onTurn` fires once the leaf settles. That keeps ONE page-turn
 * mechanism in the section rather than a competing second one.
 */
export interface PageFlipHandle {
  next: () => void
  prev: () => void
}

export interface PageFlipProps {
  /** Number of pages. Counter and bounds derive from this. */
  total: number
  /** Zero-based current page. */
  index: number
  onIndexChange: (next: number) => void
  /** Rendered into a page face. */
  renderPage: (index: number) => ReactNode
  /** Rendered on the reverse of the turning leaf (the "paper back"). */
  renderPageBack?: () => ReactNode
  /** Accessible name for the book region. */
  label: string
  /** Fired after a turn commits (not during reduced-motion swap either). */
  onTurn?: (direction: PageFlipDirection) => void
  /** Set true to opt out of pointer drag. */
  disableDrag?: boolean
}

interface FlipTransition {
  fromIndex: number
  toIndex: number
  dir: PageFlipDirection
}

interface DragState {
  pointerId: number
  startX: number
  width: number
  ratio: number
  activeDir: PageFlipDirection | null
}

function PageFlipImpl(
  {
    total,
    index,
    onIndexChange,
    renderPage,
    renderPageBack,
    label,
    onTurn,
    disableDrag = false,
  }: PageFlipProps,
  ref: Ref<PageFlipHandle>
) {
  const [transition, setTransition] = useState<FlipTransition | null>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  const bookRef = useRef<HTMLDivElement>(null)
  const leafRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<FlipTransition | null>(null)
  const settleTimer = useRef<number | null>(null)
  const dragRef = useRef<DragState | null>(null)
  // Read the live index inside async/gesture callbacks without re-binding them.
  const indexRef = useRef(index)
  indexRef.current = index

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setIsReducedMotion(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(
    () => () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
    },
    []
  )

  const canNext = index < total - 1
  const canPrev = index > 0

  /** Drive the live leaf visuals from the current rotation angle. */
  const applyLeafVisuals = useCallback((rotYDeg: number, dir: PageFlipDirection) => {
    const leaf = leafRef.current
    const book = bookRef.current
    if (!leaf || !book) return

    leaf.style.transform = `rotateY(${rotYDeg.toFixed(2)}deg)`

    const norm = clamp(Math.abs(rotYDeg) / 180, 0, 1)
    // 0deg -> 0.08, 45deg -> ~0.27, 90deg -> 0.35, mirroring on the way out.
    const shadowStrength = 0.08 + 0.27 * Math.sin(norm * Math.PI)
    book.style.setProperty('--cflip-shadow-opacity', shadowStrength.toFixed(3))

    const highlight = Math.sin(norm * Math.PI)
    leaf.style.setProperty('--cflip-highlight', highlight.toFixed(3))
    const highlightPos = dir === 'next' ? 100 - norm * 100 : norm * 100
    leaf.style.setProperty('--cflip-highlight-pos', `${highlightPos.toFixed(1)}%`)
  }, [])

  const clearLeaf = useCallback(() => {
    const leaf = leafRef.current
    const book = bookRef.current
    if (leaf) {
      leaf.classList.remove('is-animating', 'turn-next', 'turn-prev')
      leaf.style.transition = ''
      leaf.style.transform = ''
      leaf.style.willChange = 'auto'
      leaf.style.removeProperty('--cflip-highlight')
      leaf.style.removeProperty('--cflip-highlight-pos')
    }
    if (book) book.style.removeProperty('--cflip-shadow-opacity')
  }, [])

  const commitTurn = useCallback(
    (dir: PageFlipDirection) => {
      // Hard lock: ignore any turn requested while one is already in flight.
      if (transitionRef.current) return
      const from = indexRef.current
      const target = dir === 'next' ? from + 1 : from - 1
      if (target < 0 || target >= total) return

      const trans: FlipTransition = { fromIndex: from, toIndex: target, dir }
      transitionRef.current = trans
      setTransition(trans)

      if (isReducedMotion) {
        onIndexChange(target)
        setTransition(null)
        transitionRef.current = null
        onTurn?.(dir)
        return
      }

      const leaf = leafRef.current
      const book = bookRef.current
      if (leaf && book) {
        leaf.style.willChange = 'transform'
        leaf.classList.add('is-animating')
        leaf.classList.add(dir === 'next' ? 'turn-next' : 'turn-prev')
      }

      if (settleTimer.current) window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(
        () => {
          clearLeaf()
          onIndexChange(target)
          setTransition(null)
          transitionRef.current = null
          settleTimer.current = null
          onTurn?.(dir)
        },
        PAGE_TURN_MS + 20
      )
    },
    [total, isReducedMotion, onIndexChange, onTurn, clearLeaf]
  )

  const startTurn = useCallback(
    (dir: PageFlipDirection) => {
      if (transitionRef.current || dragRef.current) return
      if (dir === 'next' && !canNext) return
      if (dir === 'prev' && !canPrev) return
      commitTurn(dir)
    },
    [canNext, canPrev, commitTurn]
  )

  /* Exposed to the parent so the in-page Previous / Next buttons drive the very
     same animated commit path as a swipe or an arrow key. startTurn already
     refuses to start a turn while one is in flight or mid-drag, so the buttons
     can never overlap or corrupt a transition. */
  useImperativeHandle(
    ref,
    () => ({
      next: () => startTurn('next'),
      prev: () => startTurn('prev'),
    }),
    [startTurn]
  )

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      startTurn('next')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      startTurn('prev')
    }
  }

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (disableDrag) return
    // Never hijack a drag that starts on an interactive control.
    if ((e.target as HTMLElement).closest('a, button, [data-no-drag]')) return
    if (transitionRef.current || dragRef.current || !e.isPrimary) return
    const book = bookRef.current
    if (!book) return

    const rect = book.getBoundingClientRect()
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      width: Math.max(140, rect.width * 0.75),
      ratio: 0,
      activeDir: null,
    }
    try {
      book.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture is best effort */
    }
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return

    const dx = e.clientX - d.startX
    const ratio = clamp(dx / d.width, -1, 1)
    d.ratio = ratio
    const current = indexRef.current

    if (Math.abs(ratio) > 0.03 && !d.activeDir) {
      if (ratio < 0 && current < total - 1) {
        d.activeDir = 'next'
        const trans: FlipTransition = { fromIndex: current, toIndex: current + 1, dir: 'next' }
        transitionRef.current = trans
        setTransition(trans)
      } else if (ratio > 0 && current > 0) {
        d.activeDir = 'prev'
        const trans: FlipTransition = { fromIndex: current, toIndex: current - 1, dir: 'prev' }
        transitionRef.current = trans
        setTransition(trans)
      }
    }

    if (!d.activeDir) return
    const leaf = leafRef.current
    if (!leaf) return
    leaf.classList.remove('is-animating', 'turn-next', 'turn-prev')
    leaf.style.willChange = 'transform'

    if (d.activeDir === 'next') {
      applyLeafVisuals(-180 * clamp(-ratio, 0, 1), 'next')
    } else {
      applyLeafVisuals(180 * clamp(ratio, 0, 1), 'prev')
    }
  }

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return
    dragRef.current = null

    const activeDir = d.activeDir
    if (!activeDir || !transitionRef.current) return

    const magnitude = Math.abs(d.ratio)
    const leaf = leafRef.current
    const book = bookRef.current
    const current = indexRef.current
    const target = activeDir === 'next' ? current + 1 : current - 1

    const finish = (delay: number, commit: boolean) => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(
        () => {
          clearLeaf()
          if (commit) {
            onIndexChange(target)
            onTurn?.(activeDir)
          }
          setTransition(null)
          transitionRef.current = null
          settleTimer.current = null
        },
        delay
      )
    }

    if (magnitude >= PAGE_COMMIT_THRESHOLD) {
      // Continue the rotation from wherever the finger left it.
      if (leaf) {
        const remain = PAGE_TURN_MS * (1 - magnitude) * 0.85
        leaf.style.transition =
          'transform ' + (remain + 180) + 'ms cubic-bezier(0.22, 0.61, 0.36, 1)'
        leaf.style.transform = activeDir === 'next' ? 'rotateY(-180deg)' : 'rotateY(180deg)'
        if (book) book.style.setProperty('--cflip-shadow-opacity', '0.08')
      }
      finish(PAGE_TURN_MS * (1 - magnitude) * 0.85 + 200, true)
    } else {
      // Not far enough: settle back to flat without changing page.
      if (leaf) {
        leaf.style.transition = 'transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1)'
        leaf.style.transform = 'rotateY(0deg)'
        if (book) book.style.setProperty('--cflip-shadow-opacity', '0.08')
      }
      finish(300, false)
    }
  }

  // Which sheet sits underneath, and what the turning leaf shows.
  let baseIndex: number | null = null
  let leafFrontIndex: number | null = null

  if (transition) {
    if (transition.dir === 'next') {
      // Turning away toward the left reveals the next page underneath.
      baseIndex = transition.toIndex
      leafFrontIndex = transition.fromIndex
    } else {
      baseIndex = transition.fromIndex
      leafFrontIndex = transition.toIndex
    }
  }

  return (
    <div
      ref={bookRef}
      className={'cflip-book-3d' + (transition ? ' is-flipping' : '')}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="cflip-leaf-shadow" aria-hidden="true" />

      {/* Static underlying page */}
      <div className="cflip-sheet cflip-base-sheet">
        {baseIndex === null ? renderPage(index) : renderPage(baseIndex)}
      </div>

      {/* Turning leaf, mounted only while a turn or drag is in flight */}
      {transition && leafFrontIndex !== null && (
        <div
          ref={leafRef}
          className={
            'cflip-sheet cflip-turning-leaf ' +
            (transition.dir === 'next' ? 'origin-right' : 'origin-left')
          }
        >
          <div className="cflip-face cflip-face--front">
            {renderPage(leafFrontIndex)}
            <div className="cflip-highlight-overlay" aria-hidden="true" />
          </div>
          <div className="cflip-face cflip-face--back">
            <div className="cflip-back-paper">
              <div className="cflip-back-texture" />
              <div className="cflip-back-center">
                {renderPageBack ? (
                  renderPageBack()
                ) : (
                  <>
                    <div className="cflip-colophon-emblem">✦</div>
                    <span className="cflip-back-title">ARYAN SHARMA</span>
                    <span className="cflip-back-sub">PROJECT INDEX</span>
                  </>
                )}
              </div>
            </div>
            <div className="cflip-highlight-overlay" aria-hidden="true" />
          </div>
        </div>
      )}

      <span className="cflip-spine" aria-hidden="true" />
    </div>
  )
}

/**
 * The shared page-turn book. Forwarding a ref is what lets the caller's
 * Previous / Next buttons reuse this component's own animation and transition
 * lock instead of re-implementing a second navigation path.
 */
const PageFlip = forwardRef<PageFlipHandle, PageFlipProps>(PageFlipImpl)

export default PageFlip

