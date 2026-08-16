import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  [
    '01',
    'Web & Web Application Development',
    'High-performance, structured, responsive web applications built with clean code standards, optimized page loads, and intuitive UX.',
    ['React.js', 'TypeScript', 'Tailwind CSS', 'HTML5/CSS3'],
  ],
  [
    '02',
    'Creative Frontend & Motion Design',
    'Engaging interactive interfaces featuring smooth GSAP animations, scroll choreography, and micro-interactions designed with intent.',
    ['GSAP', 'ScrollTrigger', 'Framer Motion', 'Canvas/SVG'],
  ],
  [
    '03',
    'UI / UX Architecture & Implementation',
    'Converting Figma design specifications and visual ideas into accessible, production-ready frontend components and responsive systems.',
    ['Figma → Code', 'Design Systems', 'Responsive UI', 'Accessibility'],
  ],
  [
    '04',
    'Web Security & Auth Systems',
    'Integrating secure authentication flows, client-side input validation, password checkers, and security best practices into web apps.',
    ['Auth Flow', 'Security UI', 'Validation', 'Input Sanitization'],
  ],
]

export default function Services() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.service-row',
        { x: -35, opacity: 0 },
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
    <section id="services" ref={ref} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-eyebrow text-accent">CAPABILITIES / 03</span>
            <h2 className="font-display text-display mt-3">What I deliver.</h2>
          </div>
          <a href="#contact" className="text-eyebrow text-accent flex items-center gap-1 hover:underline">
            <span>DISCUSS A PROJECT</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="divide-y divide-border border-t border-b border-border">
          {SERVICES.map(([n, title, desc, tech]) => (
            <div
              key={String(n)}
              className="service-row group grid md:grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 px-2 -mx-2 hover:bg-surface/80 transition-all rounded-sm"
            >
              <span className="md:col-span-1 font-mono text-muted text-sm group-hover:text-accent font-medium">
                {n}
              </span>
              <h3 className="md:col-span-4 font-display text-2xl md:text-3xl text-foreground group-hover:translate-x-2 transition-transform">
                {title}
              </h3>
              <p className="md:col-span-4 text-muted text-sm leading-relaxed">{desc}</p>
              <div className="md:col-span-3 flex flex-wrap gap-2 md:justify-end">
                {(tech as string[]).map((t) => (
                  <span
                    key={t}
                    className="text-eyebrow border border-border px-2.5 py-1 text-[0.65rem] group-hover:border-accent/40 group-hover:text-accent transition-colors"
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
