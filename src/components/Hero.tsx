import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowUpRight, Sparkles, Code2, ShieldCheck, ExternalLink } from 'lucide-react'
import portrait from '../assets/photos/portrait.jpg'

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const primaryCtaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Name animation character reveal
      gsap.fromTo(
        '.hero-char',
        { yPercent: 120, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.02, ease: 'power4.out', delay: 0.1 }
      )

      // Sequential fade-ins for top badges, role tag, bio text, and CTAs
      gsap.fromTo(
        '.hero-fade',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.85, delay: 0.6, stagger: 0.08, ease: 'power3.out' }
      )

      // Parallax effects on scroll
      gsap.to('.hero-grid', {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-title', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Mousemove depth parallax for portrait on non-touch screens
      const portraitEl = rootRef.current?.querySelector('.hero-portrait-inner') as HTMLElement | null
      const onMove = (e: MouseEvent) => {
        if (!portraitEl || window.matchMedia('(pointer: coarse)').matches) return
        const x = (e.clientX / window.innerWidth - 0.5) * 16
        const y = (e.clientY / window.innerHeight - 0.5) * 16
        gsap.to(portraitEl, { x, y, duration: 0.7, ease: 'power2.out', overwrite: true })
      }
      window.addEventListener('mousemove', onMove)
      return () => window.removeEventListener('mousemove', onMove)
    }, rootRef)

    return () => ctx.revert()
  }, [])

  const handleMagnetic = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25
    gsap.to(btn, { x, y, duration: 0.35, ease: 'power3.out' })
  }

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
  }

  const renderChars = (word: string) =>
    word.split('').map((c, i) => (
      <span key={i} className="hero-char inline-block">
        {c}
      </span>
    ))

  return (
    <section
      id="top"
      ref={rootRef}
      className="hero relative min-h-[100svh] flex flex-col justify-between px-6 md:px-10 pt-28 pb-10 overflow-hidden"
    >
      <div className="hero-grid absolute inset-0 opacity-25 pointer-events-none" />

      {/* Top Bar Status */}
      <div className="hero-fade flex flex-wrap items-center justify-between text-eyebrow relative z-10 gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent)]" />
          <span>BASED IN DELHI, INDIA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline border border-accent/30 text-accent bg-accent/5 px-2.5 py-1 text-[0.65rem] tracking-widest">
            AVAILABLE FOR OPPORTUNITIES
          </span>
          <span className="text-muted hidden md:inline">BCA · TIPS DELHI</span>
        </div>
      </div>

      {/* Main Title & Hero Content */}
      <div className="relative flex-1 flex flex-col justify-center my-6 z-10">
        <div className="hero-title w-full max-w-5xl">
          <div className="hero-fade inline-flex items-center gap-2 mb-4 text-eyebrow text-accent border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-full">
            <Sparkles size={13} className="text-accent" />
            <span>WEB DEVELOPER &amp; CREATIVE FRONTEND</span>
          </div>

          <h1 ref={nameRef} className="font-display font-medium text-hero leading-[0.82] -ml-1 tracking-[-0.055em] my-2 select-none">
            <span className="block overflow-hidden">{renderChars('ARYAN')}</span>
            <span className="block text-accent overflow-hidden">{renderChars('SHARMA')}</span>
          </h1>

          {/* Short Introduction Paragraph */}
          <div className="hero-fade max-w-2xl mt-6">
            <p className="text-muted text-base md:text-xl font-normal leading-relaxed">
              Crafting high-performance digital experiences, interactive web applications, and security-focused solutions with precision and cinematic intent.
            </p>
          </div>

          {/* Call to Actions */}
          <div className="hero-fade flex flex-wrap items-center gap-4 mt-8">
            <a
              ref={primaryCtaRef}
              href="#work"
              onMouseMove={handleMagnetic}
              onMouseLeave={handleMagneticLeave}
              data-cursor="open"
              className="inline-flex items-center gap-3 px-7 py-4 bg-accent text-background font-display font-medium text-sm md:text-base rounded-full hover:bg-white transition-all shadow-[0_0_30px_rgba(53,224,224,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              <span>Explore Selected Work</span>
              <ArrowDown size={16} />
            </a>

            <a
              href="#contact"
              onMouseMove={handleMagnetic}
              onMouseLeave={handleMagneticLeave}
              data-cursor="open"
              className="inline-flex items-center gap-2 px-7 py-4 border border-border bg-surface/50 text-foreground font-display text-sm md:text-base rounded-full hover:border-accent hover:text-accent transition-all backdrop-blur-sm"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Hero Floating Portrait Specimen */}
        <div
          id="hero-portrait"
          className="hidden lg:block absolute right-[2%] top-1/2 -translate-y-1/2 w-[240px] h-[310px] xl:w-[280px] xl:h-[360px] rounded-[4px] overflow-hidden border border-border bg-surface shadow-2xl shadow-cyan-950/30 group"
        >
          <img
            src={portrait}
            alt="Aryan Sharma portrait"
            loading="eager"
            decoding="async"
            className="hero-portrait-inner w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
          <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between text-eyebrow text-accent bg-background/80 backdrop-blur px-2.5 py-1.5 border border-accent/20">
            <span>ARYAN S.</span>
            <span className="text-[0.6rem] text-muted">DEV / 01</span>
          </div>
        </div>
      </div>

      {/* Bottom Roles & Scroll Directive */}
      <div className="hero-fade flex flex-wrap items-end justify-between gap-4 text-eyebrow relative z-10 pt-4 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted">
          <span className="flex items-center gap-2"><Code2 size={13} className="text-accent" /> FRONTEND</span>
          <span className="flex items-center gap-2"><ShieldCheck size={13} className="text-accent" /> CYBERSECURITY</span>
          <span>FULLSTACK BASICS</span>
        </div>
        <a href="#work" className="flex items-center gap-3 text-muted hover:text-accent transition-colors" data-cursor="open">
          <span className="tracking-widest">SCROLL TO EXPLORE</span>
          <span className="scroll-line" />
        </a>
      </div>
    </section>
  )
}
