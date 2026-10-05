import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { Certificate } from '../data/certifications'
import { useSFX } from '../hooks/useSFX'

const TURN_MS = 680
const COMMIT_THRESHOLD = 0.30

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const pad2 = (n: number) => String(n).padStart(2, '0')

interface CertCardProps {
  cert: Certificate
  total: number
  onInspect: (cert: Certificate) => void
}

function CertCard({ cert, total, onInspect }: CertCardProps) {
  const isMerit = cert.hierarchyTier === 'Merit Recognition'
  const isIndustry = cert.hierarchyTier === 'Industry Certification'

  return (
    <div className="cflip-content">
      <div className="cflip-face-top">
        <span
          className={`cflip-badge ${isMerit ? 'cflip-badge--merit' : isIndustry ? 'cflip-badge--industry' : ''}`}
        >
          {cert.hierarchyTier}
        </span>
        <span className="cflip-pagenum" aria-hidden="true">
          {pad2(cert.order)} / {pad2(total)}
        </span>
      </div>

      <button
        type="button"
        className="cflip-media"
        onClick={() => onInspect(cert)}
        data-cursor="view"
        data-cursor-text="VIEW"
        aria-label={`Inspect ${cert.title} certificate`}
      >
        <img
          src={cert.image}
          alt={`${cert.title} — ${cert.issuer} certificate`}
          loading="eager"
          decoding="async"
          draggable={false}
        />
        <span className="cflip-media-hint" aria-hidden="true">
          INSPECT ↗
        </span>
      </button>

      <div className="cflip-meta">
        <p className="cflip-title">{cert.title}</p>
        <p className="cflip-issuer">
          {cert.issuer} · {cert.type}
          {cert.date ? ` · ${cert.date}` : ''}
        </p>
        {cert.description && <p className="cflip-desc">{cert.description}</p>}
        <button type="button" className="cflip-inspect" onClick={() => onInspect(cert)}>
          <span>Open full certificate</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    </div>
  )
}

interface CertificateViewerProps {
  certs: Certificate[]
  onInspect: (cert: Certificate) => void
}

interface FlipTransition {
  fromIndex: number
  toIndex: number
  dir: 'next' | 'prev'
}

interface DragState {
  pointerId: number
  startX: number
  width: number
  ratio: number // -1 to 1 (-1 = complete turn to next, 1 = complete turn to prev)
  activeDir: 'next' | 'prev' | null
}

export default function CertificateViewer({ certs, onInspect }: CertificateViewerProps) {
  const total = certs.length
  const [index, setIndex] = useState(0)
  const [transition, setTransition] = useState<FlipTransition | null>(null)
  const [isReducedMotion, setIsReducedMotion] = useState(false)
  const { playSFX } = useSFX()

  const bookRef = useRef<HTMLDivElement>(null)
  const leafRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<FlipTransition | null>(null)
  const settleTimer = useRef<number | null>(null)
  const dragRef = useRef<DragState | null>(null)

  // Listen for reduced motion preferences
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setIsReducedMotion(mq.matches)
    updateMotion()
    mq.addEventListener('change', updateMotion)
    return () => mq.removeEventListener('change', updateMotion)
  }, [])

  // Listen for external open events (e.g. from Merit spotlight)
  useEffect(() => {
    const handleOpenCert = (e: Event) => {
      const targetIdx = (e as CustomEvent<number>).detail ?? 0
      if (targetIdx >= 0 && targetIdx < total) {
        setIndex(targetIdx)
      }
    }
    window.addEventListener('certifications:open', handleOpenCert)
    return () => window.removeEventListener('certifications:open', handleOpenCert)
  }, [total])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current)
    }
  }, [])

  const canNext = index < total - 1
  const canPrev = index > 0

  // Update dynamic CSS variables for lighting and shadow during flip
  const applyLeafVisuals = useCallback((rotYDeg: number, dir: 'next' | 'prev') => {
    const leaf = leafRef.current
    const book = bookRef.current
    if (!leaf || !book) return

    leaf.style.transform = `rotateY(${rotYDeg.toFixed(2)}deg)`

    // Angle absolute: 0 -> 180
    const absAngle = Math.abs(rotYDeg)
    const norm = clamp(absAngle / 180, 0, 1)

    // Shadow strength specification:
    // 0° -> 0.08, 45° -> 0.18, 90° -> 0.35, 135° -> 0.18, 180° -> 0.08
    const shadowStrength = 0.08 + 0.27 * Math.sin(norm * Math.PI)
    book.style.setProperty('--cflip-shadow-opacity', shadowStrength.toFixed(3))

    // Light highlight specification: 90° is peak
    const highlight = Math.sin(norm * Math.PI)
    leaf.style.setProperty('--cflip-highlight', highlight.toFixed(3))
    const highlightPos = dir === 'next' ? (100 - norm * 100) : (norm * 100)
    leaf.style.setProperty('--cflip-highlight-pos', `${highlightPos.toFixed(1)}%`)
  }, [])

  const commitTurn = useCallback(
    (dir: 'next' | 'prev') => {
      if (transitionRef.current) return
      const target = dir === 'next' ? index + 1 : index - 1
      if (target < 0 || target >= total) return

      const trans: FlipTransition = { fromIndex: index, toIndex: target, dir }
      transitionRef.current = trans
      setTransition(trans)

      if (isReducedMotion) {
        setIndex(target)
        setTransition(null)
        transitionRef.current = null
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
      settleTimer.current = window.setTimeout(() => {
        if (leaf) {
          leaf.classList.remove('is-animating', 'turn-next', 'turn-prev')
          leaf.style.transform = ''
          leaf.style.willChange = 'auto'
          leaf.style.removeProperty('--cflip-highlight')
          leaf.style.removeProperty('--cflip-highlight-pos')
        }
        if (book) {
          book.style.removeProperty('--cflip-shadow-opacity')
        }
        setIndex(target)
        setTransition(null)
        transitionRef.current = null
        settleTimer.current = null
      }, TURN_MS + 20)
    },
    [index, total, isReducedMotion]
  )

  const startTurn = useCallback(
    (dir: 'next' | 'prev') => {
      if (transitionRef.current || dragRef.current) return
      if (dir === 'next' && !canNext) return
      if (dir === 'prev' && !canPrev) return

      playSFX('click')
      commitTurn(dir)
    },
    [canNext, canPrev, commitTurn, playSFX]
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      startTurn('next')
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      startTurn('prev')
    }
  }

  // Pointer drag & swipe handling with real-time physical follow
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If the click is on an interactive inspect button or inside the media button, don't initiate drag
    if ((e.target as HTMLElement).closest('.cflip-inspect, .cflip-media')) {
      return
    }
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
      /* pointer capture fallback */
    }
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return

    const dx = e.clientX - d.startX
    const ratio = clamp(dx / d.width, -1, 1)
    d.ratio = ratio

    if (Math.abs(ratio) > 0.03 && !d.activeDir) {
      if (ratio < 0 && canNext) {
        d.activeDir = 'next'
        const trans: FlipTransition = { fromIndex: index, toIndex: index + 1, dir: 'next' }
        transitionRef.current = trans
        setTransition(trans)
      } else if (ratio > 0 && canPrev) {
        d.activeDir = 'prev'
        const trans: FlipTransition = { fromIndex: index, toIndex: index - 1, dir: 'prev' }
        transitionRef.current = trans
        setTransition(trans)
      }
    }

    if (d.activeDir) {
      const leaf = leafRef.current
      if (!leaf) return

      leaf.classList.remove('is-animating', 'turn-next', 'turn-prev')
      leaf.style.willChange = 'transform'

      if (d.activeDir === 'next') {
        const dragNorm = clamp(-ratio, 0, 1) // 0 -> 1
        const rotY = -180 * dragNorm
        applyLeafVisuals(rotY, 'next')
      } else if (d.activeDir === 'prev') {
        const dragNorm = clamp(ratio, 0, 1) // 0 -> 1
        const rotY = 180 * dragNorm
        applyLeafVisuals(rotY, 'prev')
      }
    }
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return
    dragRef.current = null

    const activeDir = d.activeDir
    const ratio = d.ratio
    const leaf = leafRef.current
    const book = bookRef.current

    if (!activeDir || !transitionRef.current) {
      return
    }

    const dragMagnitude = Math.abs(ratio)

    if (dragMagnitude >= COMMIT_THRESHOLD) {
      // Commit: animate remainder of flip smoothly
      playSFX('click')
      const target = activeDir === 'next' ? index + 1 : index - 1

      if (leaf) {
        leaf.style.transition = `transform ${TURN_MS * (1 - dragMagnitude) * 0.85 + 180}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
        leaf.style.transform = activeDir === 'next' ? 'rotateY(-180deg)' : 'rotateY(180deg)'
        if (book) {
          book.style.setProperty('--cflip-shadow-opacity', '0.08')
        }
      }

      if (settleTimer.current) window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(() => {
        if (leaf) {
          leaf.style.transition = ''
          leaf.style.transform = ''
          leaf.style.willChange = 'auto'
          leaf.style.removeProperty('--cflip-highlight')
          leaf.style.removeProperty('--cflip-highlight-pos')
        }
        if (book) {
          book.style.removeProperty('--cflip-shadow-opacity')
        }
        setIndex(target)
        setTransition(null)
        transitionRef.current = null
        settleTimer.current = null
      }, TURN_MS * (1 - dragMagnitude) * 0.85 + 200)
    } else {
      // Revert: animate back to 0deg smoothly
      if (leaf) {
        leaf.style.transition = 'transform 280ms cubic-bezier(0.22, 0.61, 0.36, 1)'
        leaf.style.transform = 'rotateY(0deg)'
        if (book) {
          book.style.setProperty('--cflip-shadow-opacity', '0.08')
        }
      }

      if (settleTimer.current) window.clearTimeout(settleTimer.current)
      settleTimer.current = window.setTimeout(() => {
        if (leaf) {
          leaf.style.transition = ''
          leaf.style.transform = ''
          leaf.style.willChange = 'auto'
          leaf.style.removeProperty('--cflip-highlight')
          leaf.style.removeProperty('--cflip-highlight-pos')
        }
        if (book) {
          book.style.removeProperty('--cflip-shadow-opacity')
        }
        setTransition(null)
        transitionRef.current = null
        settleTimer.current = null
      }, 300)
    }
  }

  // Preload adjacent images
  useEffect(() => {
    const nextIdx = index + 1
    const prevIdx = index - 1
    if (nextIdx < total && certs[nextIdx]?.image) {
      const img = new Image()
      img.src = certs[nextIdx].image
    }
    if (prevIdx >= 0 && certs[prevIdx]?.image) {
      const img = new Image()
      img.src = certs[prevIdx].image
    }
  }, [index, certs, total])

  const currentCert = certs[index]
  const progressPercent = ((index + 1) / total) * 100

  // Determine underlying base sheet and turning leaf sheets
  let baseCert: Certificate | null = null
  let leafFrontCert: Certificate | null = null
  let leafBackCert: Certificate | null = null

  if (transition) {
    if (transition.dir === 'next') {
      // Moving next: Base sheet underneath is nextCert;
      // Leaf turning right-to-left: Front shows currentCert, Back shows physical paper back
      baseCert = certs[transition.toIndex]
      leafFrontCert = certs[transition.fromIndex]
      leafBackCert = null
    } else {
      // Moving prev: Base sheet underneath is currentCert;
      // Leaf starts on left and flips to right: Front shows prevCert, Back shows paper back
      baseCert = certs[transition.fromIndex]
      leafFrontCert = certs[transition.toIndex]
      leafBackCert = null
    }
  } else {
    baseCert = currentCert
  }

  return (
    <div className="cflip">
      <div className="cflip-head">
        <div>
          <span className="text-eyebrow text-accent">INTERACTIVE LEDGER — 3D PAGE TURN</span>
          <h3 className="font-display text-xl md:text-2xl text-white mt-2">
            Flip through the recognition archive.
          </h3>
        </div>
        <p className="cflip-hint" aria-hidden="true">
          DRAG · SWIPE · ARROW KEYS
        </p>
      </div>

      <div
        ref={bookRef}
        className={`cflip-book-3d ${transition ? 'is-flipping' : ''}`}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`Certificate flip book — certificate ${index + 1} of ${total}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* Dynamic drop shadow under the turning leaf */}
        <div className="cflip-leaf-shadow" aria-hidden="true" />

        {/* 1. Underlying static page */}
        <div className="cflip-sheet cflip-base-sheet">
          {baseCert && (
            <CertCard cert={baseCert} total={total} onInspect={onInspect} />
          )}
        </div>

        {/* 2. Active 3D Turning Leaf (only active during transition/drag) */}
        {transition && leafFrontCert && (
          <div
            ref={leafRef}
            className={`cflip-sheet cflip-turning-leaf ${transition.dir === 'next' ? 'origin-right' : 'origin-left'}`}
          >
            {/* Front of leaf */}
            <div className="cflip-face cflip-face--front">
              <CertCard cert={leafFrontCert} total={total} onInspect={onInspect} />
              <div className="cflip-highlight-overlay" aria-hidden="true" />
            </div>

            {/* Back of leaf (restrained tactile dark paper texture with cyan/teal rim) */}
            <div className="cflip-face cflip-face--back">
              <div className="cflip-back-paper">
                <div className="cflip-back-texture" />
                <div className="cflip-back-center">
                  <div className="cflip-colophon-emblem">✦</div>
                  <span className="cflip-back-title">ARYAN SHARMA</span>
                  <span className="cflip-back-sub">VERIFIED MERIT & CREDENTIALS</span>
                </div>
              </div>
              <div className="cflip-highlight-overlay" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* 3. Subtle vertical spine anchor */}
        <span className="cflip-spine" aria-hidden="true" />
      </div>

      {/* Navigation Controls */}
      <div className="cflip-controls">
        <button
          type="button"
          className="cert-nav-btn"
          onClick={() => startTurn('prev')}
          disabled={!canPrev || Boolean(transition)}
          aria-label="Previous certificate"
        >
          <ArrowLeft size={16} />
        </button>

        <div className="cflip-counter" aria-live="polite">
          <span>{pad2(index + 1)}</span>
          <span className="cflip-counter-sep">/</span>
          <span>{pad2(total)}</span>
        </div>

        <button
          type="button"
          className="cert-nav-btn"
          onClick={() => startTurn('next')}
          disabled={!canNext || Boolean(transition)}
          aria-label="Next certificate"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Progress rail */}
      <div className="cert-rail" aria-hidden="true">
        <span className="cert-rail-fill" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  )
}


