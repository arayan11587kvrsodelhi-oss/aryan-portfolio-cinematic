import { useCallback, useEffect, useRef } from 'react'

/**
 * Pointer-reactive depth for the Projects Book.
 *
 * Deliberately tiny numbers: the book should read as a physical object being
 * touched by the visitor's hand, not as a card being steered around.
 *
 * - Written as CSS custom properties from ONE requestAnimationFrame loop, so
 *   pointer movement never triggers a React render.
 * - Consumed by the `.pbk-stage` WRAPPER, never by the flipping leaf. PageFlip
 *   owns the leaf's inline `transform` (rotateY) and this must never fight it.
 * - Disabled for coarse pointers (touch / pen) and for prefers-reduced-motion,
 *   so those visitors get a static book with every control still working.
 * - On leave the values ease back to neutral via CSS transitions.
 *
 * WHY A CALLBACK REF AND NOT `useRef` + `useEffect`:
 * this section renders a loading branch first, so on the first commit the
 * `.pbk-stage` node does not exist yet. A `useEffect` with `[]` deps would run
 * once, find `ref.current === null` and never re-run (an object ref does not
 * trigger a re-render), so the listeners would silently never attach.
 */

/** Peak tilt in degrees on each axis (total corner-to-corner ~4.4deg). */
const MAX_ROT = 2.2
/** Peak translation in px. */
const MAX_SHIFT = 4

interface Pending {
  rx: number
  ry: number
  tx: number
  ty: number
  mx: number
  my: number
}

const IDLE: Pending = { rx: 0, ry: 0, tx: 0, ty: 0, mx: 50, my: 50 }

function writeVars(el: HTMLElement, p: Pending) {
  el.style.setProperty('--pbk-rx', p.rx.toFixed(3) + 'deg')
  el.style.setProperty('--pbk-ry', p.ry.toFixed(3) + 'deg')
  el.style.setProperty('--pbk-tx', p.tx.toFixed(2) + 'px')
  el.style.setProperty('--pbk-ty', p.ty.toFixed(2) + 'px')
  el.style.setProperty('--pbk-mx', p.mx.toFixed(2) + '%')
  el.style.setProperty('--pbk-my', p.my.toFixed(2) + '%')
}

export function useBookPointer<T extends HTMLElement>() {
  const nodeRef = useRef<T | null>(null)
  const frame = useRef<number | null>(null)
  const pending = useRef<Pending | null>(null)
  /** Pointer availability, re-synced from media queries; read by the handler. */
  const enabled = useRef(false)

  const settle = useCallback(() => {
    const el = nodeRef.current
    if (!el) return
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    el.classList.remove('is-pointer')
    // Neutral values; the CSS transition eases the book back to rest.
    writeVars(el, IDLE)
  }, [])

  const attach = useCallback(() => {
    const el = nodeRef.current
    if (!el) return

    const flush = () => {
      frame.current = null
      const p = pending.current
      if (!p) return
      pending.current = null
      writeVars(el, p)
    }

    const schedule = (p: Pending) => {
      // Coalesce to one write per frame: a fast mouse cannot queue a backlog.
      pending.current = p
      if (frame.current === null) frame.current = requestAnimationFrame(flush)
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!enabled.current) return
      // Ignore touch/pen even if a fine-pointer media query happened to match.
      if (e.pointerType && e.pointerType !== 'mouse') return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return

      const nx = (e.clientX - rect.left) / rect.width - 0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5
      // Clamp so a pointer grazing the edge still cannot exceed the caps.
      const cx = Math.max(-0.5, Math.min(0.5, nx))
      const cy = Math.max(-0.5, Math.min(0.5, ny))

      schedule({
        rx: -cy * MAX_ROT * 2,
        ry: cx * MAX_ROT * 2,
        tx: cx * MAX_SHIFT * 2,
        ty: cy * MAX_SHIFT * 2,
        mx: (cx + 0.5) * 100,
        my: (cy + 0.5) * 100,
      })
      el.classList.add('is-pointer')
    }

    const onPointerLeave = () => {
      el.classList.remove('is-pointer')
      pending.current = null
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      frame.current = null
      // Eases back to neutral via the transition on .pbk-stage.
      writeVars(el, IDLE)
    }

    el.addEventListener('pointermove', onPointerMove, { passive: true })
    el.addEventListener('pointerleave', onPointerLeave, { passive: true })
  }, [])

  const detach = useCallback(() => {
    const el = nodeRef.current
    if (!el) return
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    el.removeAttribute('style')
  }, [])

  /** Callback ref: attaches as soon as the node actually exists. */
  const ref = useCallback(
    (node: T | null) => {
      if (nodeRef.current && nodeRef.current !== node) detach()
      nodeRef.current = node
      if (node) {
        attach()
        if (!enabled.current) {
          node.classList.remove('is-pointer')
          writeVars(node, IDLE)
        }
      }
    },
    [attach, detach]
  )

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      enabled.current = fine.matches && !reduced.matches
      if (!enabled.current) settle()
    }

    fine.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    sync()

    return () => {
      fine.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      detach()
    }
  }, [settle, detach])

  return ref
}