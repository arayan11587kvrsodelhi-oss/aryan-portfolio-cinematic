import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useSFX } from '../hooks/useSFX'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  [
    '01',
    'Web & Web Application Engineering',
    'High-performance, structured, responsive web applications built with modern React, TypeScript, scalable component hierarchies, and optimized runtime performance.',
    ['React.js', 'TypeScript', 'Tailwind CSS', 'Next/Vite Standards'],
  ],
  [
    '02',
    'Creative Frontend & Motion Design',
    'Immersive digital experiences featuring physics-based Framer Motion springs, GSAP ScrollTrigger choreography, and micro-interactions designed with intent.',
    ['Framer Motion', 'GSAP', 'ScrollTrigger', 'Canvas/SVG'],
  ],
  [
    '03',
    'UI / UX Architecture & Design Systems',
    'Translating complex Figma design specifications into modular, accessible, production-ready frontend components with cohesive design tokens.',
    ['Figma → Code', 'Design Systems', 'Responsive UI', 'Accessibility'],
  ],
  [
    '04',
    'Web Application Security & Auth Flows',
    'Integrating secure authentication architectures, client-side input sanitization, password strength validation, and security best practices into web apps.',
    ['Auth Flows', 'Input Validation', 'Security UI', 'OWASP Concepts'],
  ],
]

export default function Services() {
  const { playSFX } = useSFX()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-row',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          stagger: 0.12,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="services" ref={ref} className="px-4 sm:px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <Sparkles size={13} />
              <span>CAPABILITIES / 04</span>
            </span>
            <h2 className="font-display text-display mt-2">What I Deliver.</h2>
          </div>
          <a
            href="#contact"
            onClick={() => playSFX('click')}
            onMouseEnter={() => playSFX('hover')}
            className="text-eyebrow text-accent flex items-center gap-1.5 hover:underline min-h-[44px]"
            data-cursor="open"
          >
            <span>DISCUSS A PROJECT</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="divide-y divide-border border-t border-b border-border">
          {SERVICES.map(([n, title, desc, tech]) => (
            <div
              key={String(n)}
              onMouseEnter={() => playSFX('hover')}
              className="service-row group grid md:grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 px-4 -mx-4 hover:bg-surface/90 transition-all duration-300 rounded-md"
            >
              <span className="md:col-span-1 font-mono text-muted text-sm group-hover:text-accent font-medium">
                {n}
              </span>
              <h3 className="md:col-span-4 font-display text-2xl md:text-3xl text-white font-medium group-hover:translate-x-1.5 transition-transform duration-300">
                {title}
              </h3>
              <p className="md:col-span-4 text-muted text-sm leading-relaxed">{desc}</p>
              <div className="md:col-span-3 flex flex-wrap gap-1.5 md:justify-end">
                {(tech as string[]).map((t) => (
                  <span
                    key={t}
                    className="text-eyebrow border border-border/80 bg-background/50 px-2.5 py-1 text-[0.65rem] rounded group-hover:border-accent/40 group-hover:text-accent transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
