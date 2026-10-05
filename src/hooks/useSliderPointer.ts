import { useCallback, useEffect, useRef } from 'react'

/**
 * Pointer-reactive depth + spotlight for the project slider.
 *
 * The same no-rerender discipline as the rest of this portfolio's pointer work:
 *
 * - Everything is published as CSS custom properties from ONE
 *   requestAnimationFrame loop, so pointer movement never triggers a React
 *   render. A fast mouse can only ever queue one pending frame.
 * - Deliberately tiny numbers. The card should read as a physical print being
 *   tilted under a desk lamp, not as a panel being steered around.
 * - Disabled for coarse pointers (touch/pen) and for prefers-reduced-motion, so
 *   those visitors get a completely static card with navigation still working.
 * - On leave the values are reset to neutral and the CSS transitions ease the
 *   card back to rest.
 *
 * WHY A CALLBACK REF AND NOT `useRef` + `useEffect`:
 * this section renders a loading branch first, so on the first commit the
 * stage node does not exist yet. An effect with `[]` deps would run once, find
 * `ref.current === null` and never re-run (an object ref does not trigger a
 * render), so the listeners would silently never attach.
 */

/** Peak tilt in degrees on each axis (total corner-to-corner ~2.6deg). */
const MAX_ROT = 1.3
/** Peak card translation in px. */
const MAX_SHIFT = 3
/** Peak screenshot parallax in px (kept inside the 3-8px brief). */
const MAX_PARALLAX = 6

const IDLE = { rx: 0, ry: 0, tx: 0, ty: 0, px: 50, py: 50, parX: 0, parY: 0 }

function writeVars(el: HTMLElement, v: typeof IDLE) {
  el.style.setProperty('--psl-rx', v.rx.toFixed(3) + 'deg')
  el.style.setProperty('--psl-ry', v.ry.toFixed(3) + 'deg')
  el.style.setProperty('--psl-tx', v.tx.toFixed(2) + 'px')
  el.style.setProperty('--psl-ty', v.ty.toFixed(2) + 'px')
  el.style.setProperty('--psl-spot-x', v.px.toFixed(2) + '%')
  el.style.setProperty('--psl-spot-y', v.py.toFixed(2) + '%')
  el.style.setProperty('--psl-par-x', v.parX.toFixed(2) + 'px')
  el.style.setProperty('--psl-par-y', v.parY.toFixed(2) + 'px')
}

export function useSliderPointer<T extends HTMLElement>() {
  const nodeRef = useRef<T | null>(null)
  const frame = useRef<number | null>(null)
  const pending = useRef<typeof IDLE | null>(null)
  /** Pointer availability, re-synced from media queries; read by the handler. */
  const enabled = useRef(false)

  const reset = useCallback(() => {
    const el = nodeRef.current
    if (!el) return
    if (frame.current !== null) cancelAnimationFrame(frame.current)
    frame.current = null
    pending.current = null
    el.classList.remove('is-pointer')
    // Neutral values; the CSS transitions ease the card back to rest.
    writeVars(el, IDLE)
  }, [])

  const attach = useCallback(() => {
    const el = nodeRef.current
    if (!el) return

    const flush = () => {
      frame.current = null
      const v = pending.current
      if (!v) return
      pending.current = null
      writeVars(el, v)
    }

    const schedule = (v: typeof IDLE) => {
      pending.current = v
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
        px: (cx + 0.5) * 100,
        py: (cy + 0.5) * 100,
        // Screenshot drifts opposite the tilt, which reads as depth rather than
        // as the image being pushed around.
        parX: cx * MAX_PARALLAX * -2,
        parY: cy * MAX_PARALLAX * -2,
      })
      el.classList.add('is-pointer')
    }

    const onPointerLeave = () => reset()

    el.addEventListener('pointermove', onPointerMove, { passive: true })
    el.addEventListener('pointerleave', onPointerLeave, { passive: true })
  }, [reset])

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
      if (!enabled.current) reset()
    }

    fine.addEventListener('change', sync)
    reduced.addEventListener('change', sync)
    sync()

    return () => {
      fine.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      detach()
    }
  }, [reset, detach])

  return ref
}
