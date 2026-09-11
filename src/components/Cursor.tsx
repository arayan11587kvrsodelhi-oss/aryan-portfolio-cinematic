import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'

export type CursorState =
  | 'default'
  | 'view'
  | 'open'
  | 'drag'
  | 'sound'
  | 'copy'
  | 'copied'
  | 'close'
  | 'text'
  | 'hidden'

interface Ripple {
  id: number
  x: number
  y: number
}

const DEFAULT_LABELS: Record<string, string> = {
  view: 'VIEW',
  drag: 'DRAG',
  sound: 'AUDIO',
  copy: 'COPY',
  copied: 'COPIED!',
  close: 'CLOSE',
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const auraRef = useRef<HTMLDivElement>(null)

  const [state, setState] = useState<CursorState>('default')
  const [customText, setCustomText] = useState<string>('')
  const [isTouch, setIsTouch] = useState(false) // start false so elements mount; effect corrects if touch device
  const [ripples, setRipples] = useState<Ripple[]>([])

  // Track dot scale separately from RAF transform
  const dotScaleRef = useRef(1)

  // Physics state stored in refs — only the RAF loop owns style.transform on these elements
  const mousePos = useRef({ x: -300, y: -300 })
  const ringPos = useRef({ x: -300, y: -300 })
  const dotPos = useRef({ x: -300, y: -300 })
  const magneticTarget = useRef<{ x: number; y: number } | null>(null)
  const magneticEl = useRef<HTMLElement | null>(null)
  const isVisible = useRef(false)
  const idleTimer = useRef<number | null>(null)
  const rafId = useRef<number | null>(null)
  const copiedTimeoutRef = useRef<number | null>(null)
  const currentAngle = useRef(0)
  const currentStretch = useRef(0)
  const currentStateRef = useRef<CursorState>('default')
  const currentTextRef = useRef('')
  const reducedMotionRef = useRef(false)

  const setCursorState = useCallback((next: CursorState) => {
    if (currentStateRef.current === next) return
    currentStateRef.current = next
    setState(next)
  }, [])

  const setCursorText = useCallback((next: string) => {
    if (currentTextRef.current === next) return
    currentTextRef.current = next
    setCustomText(next)
  }, [])

  const showCursor = useCallback(() => {
    if (dotRef.current) dotRef.current.style.opacity = '1'
    if (ringRef.current) ringRef.current.style.opacity = '1'
    if (auraRef.current) auraRef.current.style.opacity = '1'
  }, [])

  const hideCursor = useCallback(() => {
    if (dotRef.current) dotRef.current.style.opacity = '0'
    if (ringRef.current) ringRef.current.style.opacity = '0'
    if (auraRef.current) auraRef.current.style.opacity = '0'
  }, [])

  const resetIdleTimer = useCallback(() => {
    showCursor()
    if (idleTimer.current) clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      if (isVisible.current && ringRef.current && auraRef.current) {
        ringRef.current.style.opacity = '0.2'
        auraRef.current.style.opacity = '0.1'
      }
    }, 4000)
  }, [showCursor])

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine) and (hover: hover)')
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotionRef.current = motionQuery.matches
    const isFinePointer = pointerQuery.matches

    if (!isFinePointer) {
      setIsTouch(true)
      return
    }
    setIsTouch(false)
    document.body.classList.add('custom-cursor-active')

    const dot = dotRef.current
    const ring = ringRef.current
    const aura = auraRef.current
    if (!dot || !ring || !aura) return

    // ── IMPORTANT: Set initial opacity only. Never set x/y via GSAP on these elements.
    // The RAF loop exclusively owns style.transform for positioning.
    dot.style.opacity = '0'
    ring.style.opacity = '0'
    aura.style.opacity = '0'

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX
      mousePos.current.y = e.clientY

      if (!isVisible.current) {
        isVisible.current = true
        showCursor()
      }
      resetIdleTimer()
    }

    const onMouseDown = (e: MouseEvent) => {
      if (!reducedMotionRef.current) {
        const newRipple: Ripple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }
        setRipples((prev) => [...prev.slice(-4), newRipple])
      }

      const target = e.target as HTMLElement
      if (target.closest('[data-cursor="copy"]')) {
        setCursorState('copied')
        if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
        copiedTimeoutRef.current = window.setTimeout(() => setCursorState('copy'), 1200)
      }
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null
      const cursorTextEl = target.closest('[data-cursor-text]') as HTMLElement | null
      const magneticItem = target.closest('[data-magnetic]') as HTMLElement | null

      setCursorText(cursorTextEl?.getAttribute('data-cursor-text') ?? '')

      if (cursorEl) {
        setCursorState((cursorEl.getAttribute('data-cursor') as CursorState) || 'open')
      } else if (target.closest('input, textarea, [contenteditable="true"]')) {
        setCursorState('text')
      } else if (target.closest('a, button, select, [role="button"], summary')) {
        setCursorState('open')
      } else {
        setCursorState('default')
      }

      if (magneticItem) {
        magneticEl.current = magneticItem
        const rect = magneticItem.getBoundingClientRect()
        magneticTarget.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      } else {
        if (magneticEl.current) {
          const el = magneticEl.current
          gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' })
          magneticEl.current = null
        }
        magneticTarget.current = null
      }
    }

    const onMouseLeave = () => { isVisible.current = false; hideCursor() }
    const onMouseEnter = () => { isVisible.current = true; showCursor(); resetIdleTimer() }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown, { passive: true })
    window.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches
    }

    const onPointerChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        setIsTouch(true)
        hideCursor()
      }
    }

    motionQuery.addEventListener('change', onMotionChange)
    pointerQuery.addEventListener('change', onPointerChange)

    // ── RAF Loop: sole owner of style.transform on dot, ring, aura ──
    let prevMX = -300, prevMY = -300

    const render = () => {
      const mx = mousePos.current.x
      const my = mousePos.current.y

      // Dot: snappy lerp
      dotPos.current.x += (mx - dotPos.current.x) * 0.88
      dotPos.current.y += (my - dotPos.current.y) * 0.88

      // Ring destination (with magnetic pull)
      let destX = mx, destY = my
      if (magneticTarget.current && magneticEl.current) {
        const { x: mX, y: mY } = magneticTarget.current
        destX = mX + (mx - mX) * 0.25
        destY = mY + (my - mY) * 0.25
        const pullX = (mx - mX) * 0.2
        const pullY = (my - mY) * 0.2
        gsap.to(magneticEl.current, { x: pullX, y: pullY, duration: 0.28, ease: 'power2.out', overwrite: 'auto' })
      }

      const lerpSpeed = magneticTarget.current ? 0.2 : 0.14
      ringPos.current.x += (destX - ringPos.current.x) * lerpSpeed
      ringPos.current.y += (destY - ringPos.current.y) * lerpSpeed

      // Velocity for stretch
      const vx = mx - prevMX
      const vy = my - prevMY
      prevMX = mx; prevMY = my

      const speed = Math.sqrt(vx * vx + vy * vy)
      const targetStretch = reducedMotionRef.current ? 0 : Math.min(speed * 0.004, 0.5)
      currentStretch.current += (targetStretch - currentStretch.current) * 0.16

      if (speed > 1.0 && !magneticTarget.current) {
        const angle = (Math.atan2(vy, vx) * 180) / Math.PI
        let diff = angle - currentAngle.current
        while (diff < -180) diff += 360
        while (diff > 180) diff -= 360
        currentAngle.current += diff * 0.2
      } else {
        currentAngle.current += (0 - currentAngle.current) * 0.12
      }

      // ── Write transforms — NO GSAP involved here ──
      const dx = dotPos.current.x
      const dy = dotPos.current.y
      const rx = ringPos.current.x
      const ry = ringPos.current.y
      const ds = dotScaleRef.current
      const sX = 1 + currentStretch.current * 0.9
      const sY = 1 - currentStretch.current * 0.38

      // Use CSS individual transform properties (translate, scale, rotate)
      // so GSAP can still animate OTHER transform-adjacent props (width/height/etc)
      // without conflict. We write directly to style.transform using the full matrix.
      dot.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%) scale(${ds})`
      ring.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%) rotate(${currentAngle.current}deg) scaleX(${sX}) scaleY(${sY})`
      aura.style.transform = `translate3d(${rx}px,${ry}px,0) translate(-50%,-50%)`

      rafId.current = requestAnimationFrame(render)
    }

    rafId.current = requestAnimationFrame(render)

    return () => {
      document.body.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      motionQuery.removeEventListener('change', onMotionChange)
      pointerQuery.removeEventListener('change', onPointerChange)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [setCursorState, setCursorText, showCursor, hideCursor, resetIdleTimer])

  // ── State effect: GSAP only touches non-transform CSS on the ring ──
  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    let width = 42, height = 42
    let borderRadius = '50%'
    let borderColor = 'rgba(244, 240, 232, 0.45)'
    let backgroundColor = 'rgba(7, 8, 10, 0.2)'
    let newDotScale = 1

    if (state === 'view') {
      width = 88; height = 88
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(7, 8, 10, 0.82)'
      newDotScale = 0
    } else if (state === 'drag') {
      width = 96; height = 44; borderRadius = '24px'
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(7, 8, 10, 0.85)'
      newDotScale = 0
    } else if (state === 'copy' || state === 'copied') {
      width = 78; height = 36; borderRadius = '18px'
      borderColor = state === 'copied' ? '#35e0e0' : 'rgba(244, 240, 232, 0.6)'
      backgroundColor = state === 'copied' ? 'rgba(53,224,224,0.25)' : 'rgba(7,8,10,0.85)'
      newDotScale = 0
    } else if (state === 'close') {
      width = 72; height = 36; borderRadius = '18px'
      borderColor = 'rgba(255,99,99,0.85)'
      backgroundColor = 'rgba(18,8,10,0.88)'
      newDotScale = 0
    } else if (state === 'sound') {
      width = 74; height = 36; borderRadius = '18px'
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(7,8,10,0.85)'
      newDotScale = 0
    } else if (state === 'open') {
      width = 54; height = 54
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(53,224,224,0.12)'
      newDotScale = 1.15
    } else if (state === 'text') {
      width = 4; height = 24; borderRadius = '2px'
      borderColor = 'var(--accent)'
      backgroundColor = 'var(--accent)'
      newDotScale = 0
    } else if (state === 'hidden') {
      newDotScale = 0
    }

    if (customText) {
      width = Math.max(width, customText.length * 9 + 32)
      height = 36; borderRadius = '18px'
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(7,8,10,0.88)'
      newDotScale = 0
    }

    // Smoothly animate dot scale using the ref (RAF reads it each frame)
    const startScale = dotScaleRef.current
    const endScale = newDotScale
    const dur = 220
    const start = performance.now()
    const animDot = (now: number) => {
      const t = Math.min((now - start) / dur, 1)
      const ease = 1 - Math.pow(1 - t, 3) // cubic ease-out
      dotScaleRef.current = startScale + (endScale - startScale) * ease
      if (t < 1) requestAnimationFrame(animDot)
    }
    requestAnimationFrame(animDot)

    // GSAP only touches non-transform props on the ring — safe, no conflict
    gsap.to(ring, {
      width,
      height,
      borderRadius,
      borderColor,
      backgroundColor,
      duration: 0.32,
      ease: 'power3.out',
    })
  }, [state, customText])

  const handleRippleEnd = (id: number) =>
    setRipples((prev) => prev.filter((r) => r.id !== id))

  if (isTouch) return null

  const displayText = customText || DEFAULT_LABELS[state] || ''

  return (
    <>
      {/* Ambient Aura */}
      <div ref={auraRef} className="cursor-aura pointer-events-none" aria-hidden="true" />

      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className={`cursor-ring pointer-events-none ${state !== 'default' ? `cursor-ring--${state}` : ''}`}
        aria-hidden="true"
      >
        {displayText && (
          <span className="cursor-label select-none flex items-center gap-0.5">
            {displayText}
            {state === 'view' && !customText && <span className="text-[0.65rem]">↗</span>}
          </span>
        )}
      </div>

      {/* Lead Dot */}
      <div ref={dotRef} className="cursor-dot pointer-events-none" aria-hidden="true" />

      {/* Shockwave Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="cursor-ripple pointer-events-none"
          style={{ left: r.x, top: r.y }}
          onAnimationEnd={() => handleRippleEnd(r.id)}
          aria-hidden="true"
        />
      ))}
    </>
  )
}
