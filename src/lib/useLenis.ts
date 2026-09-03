import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Shared singleton so pinned sections (Projects / Certifications) can drive
// programmatic scroll-to-slide navigation through the same Lenis instance
// that is powering smooth scrolling site-wide. Falls back safely when null
// (reduced-motion users / Lenis not active).
export const lenisState: { instance: Lenis | null } = { instance: null }

export function useLenis() {
	useEffect(() => {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual'
		}

		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

		if (motionQuery.matches) {
			if (!window.location.hash) {
				window.scrollTo(0, 0)
			}
			return
		}

		const lenis = new Lenis({
			duration: 1.15,
			easing: (t) => 1 - Math.pow(2, -10 * t),
			smoothWheel: true,
		})
		lenisState.instance = lenis

		const tick = (time: number) => lenis.raf(time * 1000)
		lenis.on('scroll', ScrollTrigger.update)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)

		// Ensure fresh page loads and reloads start at top unless an explicit hash target is requested
		if (!window.location.hash) {
			window.scrollTo(0, 0)
			lenis.scrollTo(0, { immediate: true })
		} else {
			const id = window.location.hash.slice(1)
			const target = id ? document.getElementById(id) : null
			if (target) {
				lenis.scrollTo(target, { immediate: true })
			} else {
				window.scrollTo(0, 0)
				lenis.scrollTo(0, { immediate: true })
			}
		}

		// Route in-page anchor clicks through Lenis so navigation stays smooth
		// and never fights ScrollTrigger with an instant native jump.
		const onAnchorClick = (event: MouseEvent) => {
			const anchor = (event.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
			if (!anchor) return
			const id = anchor.getAttribute('href')!.slice(1)
			const target = id ? document.getElementById(id) : document.body
			if (!target) return
			event.preventDefault()
			lenis.scrollTo(target, { offset: 0 })
		}
		document.addEventListener('click', onAnchorClick)

		const onMotionChange = (event: MediaQueryListEvent) => {
			if (event.matches) {
				gsap.ticker.remove(tick)
				lenis.destroy()
				lenisState.instance = null
			}
		}

		motionQuery.addEventListener('change', onMotionChange)

		return () => {
			motionQuery.removeEventListener('change', onMotionChange)
			document.removeEventListener('click', onAnchorClick)
			gsap.ticker.remove(tick)
			lenis.destroy()
			if (lenisState.instance === lenis) {
				lenisState.instance = null
			}
		}
	}, [])
}