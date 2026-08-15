import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import portrait from '../assets/photos/portrait.jpg'

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-char', { yPercent: 130, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.15, stagger: 0.025, ease: 'power4.out', delay: .1 })
      gsap.fromTo('.hero-fade', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .9, delay: .75, stagger: .08, ease: 'power3.out' })
      gsap.to('.hero-grid', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.hero-title', { yPercent: -16, rotateX: 8, transformPerspective: 900, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true } })
      const portraitEl = rootRef.current?.querySelector('.hero-portrait-inner') as HTMLElement | null
      const onMove = (e: MouseEvent) => {
        if (!portraitEl || window.matchMedia('(pointer: coarse)').matches) return
        const x = (e.clientX / innerWidth - .5) * 18
        const y = (e.clientY / innerHeight - .5) * 18
        gsap.to(portraitEl, { x, y, duration: .8, ease: 'power3.out', overwrite: true })
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const renderChars = (word: string) => word.split('').map((c, i) => <span key={i} className="hero-char inline-block">{c}</span>)

  return (
    <section id="top" ref={rootRef} className="hero relative min-h-[100svh] flex flex-col justify-between px-6 md:px-10 pt-28 pb-10 overflow-hidden">
      <div className="hero-grid absolute inset-0 opacity-30 pointer-events-none" />
      <div className="hero-fade flex items-center justify-between text-eyebrow relative z-10">
        <span>BASED IN DELHI, INDIA</span><span className="hidden sm:inline">AVAILABLE FOR SELECTED PROJECTS</span>
      </div>
      <div className="relative flex-1 flex items-center z-10">
        <div className="hero-title w-full">
          <p className="text-eyebrow mb-5 text-accent">DIGITAL EXPERIENCE / DEVELOPMENT</p>
          <h1 ref={nameRef} className="font-display font-medium text-hero leading-[.82] -ml-1 tracking-[-.055em]">
            <span className="block overflow-hidden">{renderChars('ARYAN')}</span>
            <span className="block text-accent overflow-hidden">{renderChars('SHARMA')}</span>
          </h1>
        </div>
        <div id="hero-portrait" className="hidden md:block absolute right-[4%] top-1/2 -translate-y-1/2 w-[220px] h-[280px] lg:w-[270px] lg:h-[350px] rounded-[3px] overflow-hidden border border-border bg-surface shadow-2xl shadow-cyan-950/20">
          <img src={portrait} alt="Aryan Sharma portrait" className="hero-portrait-inner w-full h-full object-cover" />
          <span className="absolute left-3 bottom-3 text-eyebrow text-accent bg-background/70 px-2 py-1">PORTRAIT / 01</span>
        </div>
      </div>
      <div className="hero-fade flex flex-wrap items-end justify-between gap-4 text-eyebrow relative z-10">
        <div className="flex flex-col gap-1"><span>WEB DEVELOPER</span><span>CREATIVE DEVELOPER</span><span>CYBERSECURITY ENTHUSIAST</span></div>
        <div className="flex items-center gap-3"><span>SCROLL TO EXPLORE</span><span className="scroll-line" /></div>
      </div>
    </section>
  )
}
