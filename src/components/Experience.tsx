import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ENTRIES = [
  [
    '2025 — Present',
    'Bachelor of Computer Applications (BCA)',
    'Trinity Institute of Professional Studies (GGSIPU, Delhi)',
    'Program focused on computer science fundamentals, data structures, web application development, database management systems, and network security.',
  ],
  [
    'Ongoing',
    'Frontend & Web Engineering Projects',
    'Independent Development',
    'Conceptualizing, designing, and building production-grade web interfaces — including e-commerce platforms, auth clients, and interactive scroll experiences.',
  ],
  [
    'Ongoing',
    'Cybersecurity & Web Security Research',
    'Self-Directed Study',
    'Exploring web application vulnerabilities, authentication mechanics, client-side input sanitization, and network security concepts.',
  ],
]

export default function Experience() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(
      () =>
        gsap.fromTo(
          '.timeline-row',
          { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
          {
            clipPath: 'inset(0 0% 0 0)',
            opacity: 1,
            stagger: 0.15,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: { trigger: ref.current, start: 'top 75%' },
          }
        ),
      ref
    )
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-eyebrow text-accent">TIMELINE &amp; MILESTONES / 05</span>
            <h2 className="font-display text-display mt-3">Education &amp; Growth.</h2>
          </div>
          <span className="text-eyebrow text-muted hidden md:inline">ACADEMIC &amp; SELF-DIRECTED</span>
        </div>

        <div className="mt-8 border-t border-border">
          {ENTRIES.map(([period, title, place, desc]) => (
            <div
              key={title}
              className="timeline-row grid md:grid-cols-12 gap-4 py-8 border-b border-border items-start hover:bg-surface/50 transition-colors px-2 rounded-sm"
            >
              <span className="md:col-span-3 text-eyebrow text-accent font-medium">{period}</span>
              <div className="md:col-span-5">
                <h3 className="font-display text-xl md:text-2xl text-foreground">{title}</h3>
                <span className="text-muted text-xs block mt-1">{place}</span>
              </div>
              <p className="md:col-span-4 text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
