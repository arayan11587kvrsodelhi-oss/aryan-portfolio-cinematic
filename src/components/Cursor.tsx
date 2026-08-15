import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export type CursorState = 'default' | 'view' | 'open' | 'drag'

const LABELS: Record<CursorState, string> = {
  default: '',
  view: 'View Project',
  open: 'Open',
  drag: 'Drag',
}

/**
 * Signature cursor: a small dot plus a lagging ring that expands and
 * labels itself depending on what's underneath it. Desktop only —
 * hidden via CSS on touch/mobile.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<CursorState>('default')
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches)

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const el = target.closest('[data-cursor]') as HTMLElement | null
      setState((el?.dataset.cursor as CursorState) || 'default')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return
    const scale = state === 'default' ? 1 : 2.6
    gsap.to(ring, { scale, duration: 0.35, ease: 'power3.out' })
  }, [state])

  if (isTouch) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring">
        {LABELS[state]}
      </div>
    </>
  )
}
