import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Shared singleton so pinned sections (Projects / Certifications) can drive
// programmatic scroll-to-slide navigation through the same Lenis instance
// that is powering smooth scrolling site-wide. Falls back safely when null
// The same instance also supports programmatic in-page navigation.
export const lenisState: { instance: Lenis | null } = { instance: null }

export function useLenis() {
	useEffect(() => {
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual'
		}

		const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

		const reduced = motionQuery.matches

		const lenis = new Lenis({
			duration: reduced ? 0.72 : 1.05,
			easing: (t) => 1 - Math.pow(2, -10 * t),
			smoothWheel: true,
			lerp: reduced ? 0.12 : 0.085,
			wheelMultiplier: 0.9,
		})
		lenisState.instance = lenis

		const tick = (time: number) => lenis.raf(time * 1000)
		lenis.on('scroll', ScrollTrigger.update)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)

		// Ensure fresh page loads and reloads start at top unless an explicit hash target is requested.
		// Sections below the fold are code-split (see App.tsx), so an in-page target may not
		// exist yet on the very first tick. Retry briefly before giving up, otherwise deep
		// links such as /#workbench would silently drop back to the top of the page.
		const resolveTarget = (id: string): Promise<HTMLElement | null> =>
			new Promise((resolve) => {
				const attempt = (remaining: number) => {
					const el = id ? document.getElementById(id) : null
					if (el) {
						// The element can exist while the rest of the page is still
						// mounting. Scrolling to it before the document is tall enough
						// makes Lenis clamp the jump to the current (short) max scroll,
						// which lands at 0. Wait for the layout to actually allow it.
						const reachable =
							el.offsetTop + window.innerHeight <=
							document.documentElement.scrollHeight
						if (reachable || remaining <= 0) {
							resolve(el)
							return
						}
					}
					if (remaining <= 0) {
						resolve(null)
						return
					}
					window.setTimeout(() => attempt(remaining - 1), 60)
				}
				attempt(50)
			})

		// Apply a deep-link jump once the code-split sections have actually mounted.
		// Components that mount later (and ScrollTrigger.refresh() in particular) can
		// reset scroll to 0 after the initial jump, so we wait for the document height
		// to settle and then assert the position a second time.
		const settleThenScroll = (el: HTMLElement, immediate: boolean) => {
			let lastHeight = -1
			let stableFrames = 0
			const watch = () => {
				const height = document.documentElement.scrollHeight
				stableFrames = height === lastHeight ? stableFrames + 1 : 0
				lastHeight = height
				if (stableFrames < 6 && performance.now() < 6000) {
					requestAnimationFrame(watch)
					return
				}
				const top = el.offsetTop
				lenis.scrollTo(top, immediate ? { immediate: true } : { duration: 1.05 })
				// Belt and braces: also set the native scroll position, then let
				// Lenis pick it up on its next frame.
				if (immediate) {
					window.scrollTo(0, top)
					lenis.scrollTo(top, { immediate: true, force: true })
				}
			}
			requestAnimationFrame(watch)
		}

		if (!window.location.hash) {
			window.scrollTo(0, 0)
			lenis.scrollTo(0, { immediate: true })
		} else {
			const id = window.location.hash.slice(1)
			void resolveTarget(id).then((target) => {
				if (target) {
					settleThenScroll(target, true)
				} else {
					window.scrollTo(0, 0)
					lenis.scrollTo(0, { immediate: true })
				}
			})
		}

		// Route in-page anchor clicks through Lenis so navigation stays smooth
		// and never fights ScrollTrigger with an instant native jump.
		const onAnchorClick = (event: MouseEvent) => {
			const anchor = (event.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null
			if (!anchor) return
			const id = anchor.getAttribute('href')!.slice(1)
			const target = id ? document.getElementById(id) : document.body
			// Suppress the native jump immediately so the page never does a hard
			// instant scroll, even if the code-split target has not mounted yet.
			event.preventDefault()
			if (target) {
				lenis.scrollTo(target, { offset: 0 })
				return
			}
			void resolveTarget(id).then((el) => {
				if (el) lenis.scrollTo(el, { offset: 0 })
			})
		}
		document.addEventListener('click', onAnchorClick)

		return () => {
			document.removeEventListener('click', onAnchorClick)
			gsap.ticker.remove(tick)
			lenis.destroy()
			if (lenisState.instance === lenis) {
				lenisState.instance = null
			}
		}
	}, [])
}