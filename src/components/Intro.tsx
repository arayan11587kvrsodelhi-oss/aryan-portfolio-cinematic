import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATEMENT = 'I build digital experiences where design, technology and interaction meet.'

export default function Intro() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.intro-word',
        { opacity: 0.15, y: 16 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.025,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 80%',
            end: 'bottom 45%',
            scrub: true,
          },
        }
      )
      gsap.to('.intro-orbit', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative px-4 sm:px-6 md:px-10 py-[var(--spacing-section)] overflow-hidden border-t border-border/40"
    >
      <div className="intro-orbit pointer-events-none" />
      <div className="max-w-container mx-auto grid md:grid-cols-12 gap-8 relative z-10 items-end">
        <div className="md:col-span-8 lg:col-span-9">
          <span className="text-eyebrow text-accent block mb-4">STATEMENT / PHILOSOPHY</span>
          <p className="font-display text-statement leading-[1.12] text-foreground">
            {STATEMENT.split(' ').map((w, i) => (
              <span key={i} className="intro-word inline-block mr-[0.26em]">
                {w}
              </span>
            ))}
          </p>
        </div>

        <div className="md:col-span-4 lg:col-span-3 border-l border-border/80 pl-6 space-y-3">
          <p className="text-muted text-sm leading-relaxed">
            A BCA student at Trinity Institute of Professional Studies (GGSIPU Delhi) focusing on modern frontend systems, responsive design kinematics, and web security architecture.
          </p>
          <div className="text-eyebrow text-accent text-[0.65rem] tracking-widest">
            CODE · MOTION · SECURITY
          </div>
        </div>
      </div>
    </section>
  )
}
