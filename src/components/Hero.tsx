import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowUpRight, Sparkles, Code2, ShieldCheck, Terminal, FileText } from 'lucide-react'
import { useSFX } from '../hooks/useSFX'
import portrait from '../assets/photos/portrait.jpg'

interface HeroProps {
  onOpenResume?: () => void
}

export default function Hero({ onOpenResume }: HeroProps) {
  const { playSFX } = useSFX()
  const rootRef = useRef<HTMLElement>(null)
  const portraitCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic letter reveal
      gsap.fromTo(
        '.hero-char',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.025, ease: 'power4.out', delay: 0.15 }
      )

      // Sequential fade-ins for status bar, badges, description, CTAs
      gsap.fromTo(
        '.hero-fade',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.55, stagger: 0.08, ease: 'power3.out' }
      )

      // Parallax scroll effects
      gsap.to('.hero-grid', {
        yPercent: 16,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-content-wrap', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Mousemove 3D depth parallax for portrait card on non-touch screens
      const card = portraitCardRef.current
      const onMouseMove = (e: MouseEvent) => {
        if (!card || window.matchMedia('(pointer: coarse)').matches) return
        const x = (e.clientX / window.innerWidth - 0.5) * 18
        const y = (e.clientY / window.innerHeight - 0.5) * 18
        gsap.to(card, {
          x,
          y,
          rotateY: x * 0.4,
          rotateX: -y * 0.4,
          duration: 0.65,
          ease: 'power2.out',
          transformPerspective: 1000,
          overwrite: 'auto'
        })
      }

      window.addEventListener('mousemove', onMouseMove)
      return () => window.removeEventListener('mousemove', onMouseMove)
    }, rootRef)

    return () => ctx.revert()
  }, [])



  const renderChars = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="hero-char inline-block will-change-transform">
        {char}
      </span>
    ))

  return (
    <section
      id="top"
      ref={rootRef}
      className="hero relative min-h-[100svh] flex flex-col justify-between px-6 md:px-10 pt-28 pb-10 overflow-hidden"
    >
      <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />

      {/* Top Status Bar */}
      <div className="hero-fade flex flex-wrap items-center justify-between text-eyebrow relative z-10 gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_var(--accent)]" />
          <span className="text-foreground/90 tracking-widest text-xs">NEW DELHI, INDIA</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1.5 border border-accent/40 text-accent bg-accent/5 px-3 py-1 text-[0.65rem] tracking-widest rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>AVAILABLE FOR OPPORTUNITIES</span>
          </span>
          <span className="text-muted text-xs hidden md:inline font-mono">BCA · TIPS (GGSIPU)</span>
        </div>
      </div>

      {/* Main Hero Staging */}
      <div className="hero-content-wrap relative flex-1 flex flex-col justify-center my-6 z-10">
        <div className="w-full max-w-5xl">
          {/* Eyebrow Pill */}
          <div className="hero-fade inline-flex items-center gap-2 mb-4 text-eyebrow text-accent border border-accent/30 bg-accent/5 px-3.5 py-1.5 rounded-full backdrop-blur-sm">
            <Sparkles size={13} className="text-accent" />
            <span>CREATIVE FRONTEND DEVELOPER &amp; BCA STUDENT</span>
          </div>

          {/* Hero Name Header */}
          <h1 className="font-display font-medium text-hero leading-[0.84] -ml-1 tracking-[-0.055em] my-3 select-none">
            <span className="block overflow-hidden text-white">{renderChars('ARYAN')}</span>
            <span className="block text-accent overflow-hidden">{renderChars('SHARMA')}</span>
          </h1>

          {/* Value Proposition Subtitle */}
          <div className="hero-fade max-w-2xl mt-5">
            <p className="text-muted text-base md:text-xl font-normal leading-relaxed">
              Engineering high-performance web applications, interactive motion experiences, and secure digital architectures with intentional visual design.
            </p>
          </div>

          {/* CTA Button Group */}
          <div className="hero-fade flex flex-wrap items-center gap-4 mt-8">
            <a
              href="#work"
              onClick={() => playSFX('click')}
              onMouseEnter={() => playSFX('hover')}
              data-magnetic
              data-cursor="open"
              data-cursor-text="EXPLORE"
              className="inline-flex items-center gap-3 px-8 py-4 bg-accent text-background font-display font-semibold text-sm md:text-base rounded-full hover:bg-white transition-all shadow-[0_0_35px_rgba(53,224,224,0.35)] hover:shadow-[0_0_45px_rgba(255,255,255,0.45)] min-h-[48px]"
            >
              <span>Explore Work</span>
              <ArrowDown size={16} />
            </a>

            {onOpenResume ? (
              <button
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenResume()
                }}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                data-cursor-text="RESUME"
                className="inline-flex items-center gap-2.5 px-7 py-4 border border-border bg-surface/70 text-foreground font-display text-sm md:text-base rounded-full hover:border-accent hover:text-accent transition-all backdrop-blur-md min-h-[48px]"
              >
                <FileText size={16} className="text-accent" />
                <span>View Resume</span>
                <ArrowUpRight size={15} />
              </button>
            ) : (
              <a
                href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Resume%20Request%20-%20Aryan%20Sharma"
                onClick={() => playSFX('click')}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                data-cursor-text="RESUME"
                className="inline-flex items-center gap-2 px-7 py-4 border border-border bg-surface/70 text-foreground font-display text-sm md:text-base rounded-full hover:border-accent hover:text-accent transition-all backdrop-blur-md min-h-[48px]"
              >
                <span>View Resume</span>
                <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Hero Portrait Specimen Card with Zero Layout Shift */}
        <div
          ref={portraitCardRef}
          id="hero-portrait"
          onMouseEnter={() => playSFX('projectHover')}
          className="hidden lg:block absolute right-[2%] top-1/2 -translate-y-1/2 w-[250px] h-[330px] xl:w-[290px] xl:h-[380px] rounded-md overflow-hidden border border-border bg-surface shadow-2xl shadow-cyan-950/25 group transition-shadow duration-500 hover:border-accent/40"
          data-cursor="view"
        >
          <img
            src={portrait}
            alt="Aryan Sharma portrait"
            width={290}
            height={380}
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover grayscale contrast-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
          
          <div className="absolute left-3 bottom-3 right-3 flex items-center justify-between text-eyebrow text-accent bg-background/85 backdrop-blur-md px-3 py-2 border border-accent/30 rounded">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-white font-medium">ARYAN SHARMA</span>
            </div>
            <span className="text-[0.62rem] text-muted font-mono">DEV / 01</span>
          </div>
        </div>
      </div>

      {/* Bottom Roles & Scroll Directive */}
      <div className="hero-fade flex flex-wrap items-end justify-between gap-4 text-eyebrow relative z-10 pt-4 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted text-xs">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Code2 size={14} className="text-accent" /> FRONTEND &amp; UI
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <Terminal size={14} className="text-accent" /> REACT &amp; TS
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <ShieldCheck size={14} className="text-accent" /> WEB SECURITY
          </span>
        </div>

        <a
          href="#work"
          onClick={() => playSFX('click')}
          onMouseEnter={() => playSFX('hover')}
          className="flex items-center gap-3 text-muted hover:text-accent transition-colors py-2"
          data-magnetic
          data-cursor="open"
          data-cursor-text="SCROLL"
        >
          <span className="tracking-widest text-xs">SCROLL TO EXPLORE</span>
          <span className="scroll-line" />
        </a>
      </div>
    </section>
  )
}
