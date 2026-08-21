import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export type CursorState = 'default' | 'view' | 'open' | 'drag'

const LABELS: Record<CursorState, string> = {
  default: '',
  view: 'VIEW',
  open: 'OPEN',
  drag: 'DRAG',
}

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>('default')
  const [isTouch, setIsTouch] = useState(true)

  useEffect(() => {
    // Check if device is desktop with fine pointer & hover capability
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches
    if (!isFinePointer) {
      setIsTouch(true)
      return
    }
    setIsTouch(false)

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null
      if (cursorEl) {
        setState((cursorEl.dataset.cursor as CursorState) || 'open')
      } else if (target.closest('a, button, input, textarea, select, [role="button"]')) {
        setState('open')
      } else {
        setState('default')
      }
    }

    const onMouseLeaveDoc = () => {
      if (dot) dot.style.opacity = '0'
      if (ring) ring.style.opacity = '0'
    }

    const onMouseEnterDoc = () => {
      if (dot) dot.style.opacity = '1'
      if (ring) ring.style.opacity = '1'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseleave', onMouseLeaveDoc)
    document.addEventListener('mouseenter', onMouseEnterDoc)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseleave', onMouseLeaveDoc)
      document.removeEventListener('mouseenter', onMouseEnterDoc)
    }
  }, [])

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    let scale = 1
    let borderColor = 'rgba(244, 240, 232, 0.45)'
    let backgroundColor = 'rgba(7, 8, 10, 0.12)'

    if (state === 'view') {
      scale = 2.4
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(7, 8, 10, 0.7)'
    } else if (state === 'open') {
      scale = 1.85
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(53, 224, 224, 0.12)'
    } else if (state === 'drag') {
      scale = 2.2
      borderColor = 'var(--accent)'
      backgroundColor = 'rgba(7, 8, 10, 0.7)'
    }

    gsap.to(ring, {
      scale,
      borderColor,
      backgroundColor,
      duration: 0.28,
      ease: 'power3.out',
    })
  }, [state])

  if (isTouch) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot pointer-events-none" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring pointer-events-none" aria-hidden="true">
        {LABELS[state]}
      </div>
    </>
  )
}
