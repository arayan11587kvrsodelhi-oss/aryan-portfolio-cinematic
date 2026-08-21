import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Sparkles, GraduationCap, Code2, ShieldCheck } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface TimelineEntry {
  period: string
  title: string
  organization: string
  description: string
  icon: typeof GraduationCap
  tags: string[]
}

const ENTRIES: TimelineEntry[] = [
  {
    period: '2025 — Present',
    title: 'Bachelor of Computer Applications (BCA)',
    organization: 'Trinity Institute of Professional Studies (GGSIPU, Delhi)',
    description: 'Undergraduate computer science program covering core data structures, algorithms, web engineering, database architecture, network systems, and object-oriented programming.',
    icon: GraduationCap,
    tags: ['Data Structures', 'DBMS', 'Web Engineering', 'Computer Networks'],
  },
  {
    period: 'Ongoing',
    title: 'Frontend & Web Engineering Systems',
    organization: 'Independent Development & Open Source',
    description: 'Architecting and deploying production-grade web applications — including VELORA (fintech banking prototype), Amber Hour (cinematic coffee storytelling), and interactive UI systems.',
    icon: Code2,
    tags: ['React', 'TypeScript', 'Framer Motion', 'Lenis', 'Vite'],
  },
  {
    period: 'Ongoing',
    title: 'Web Application Security & Vulnerability Research',
    organization: 'Self-Directed Security Studies',
    description: 'Analyzing web application vulnerabilities, authentication mechanics, client-side input sanitization, and security best practices aligned with OWASP top security guidelines.',
    icon: ShieldCheck,
    tags: ['Auth Flows', 'Input Sanitization', 'OWASP Standards'],
  },
]

export default function Experience() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.timeline-row',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.14,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={ref} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <Sparkles size={13} />
              <span>TIMELINE &amp; MILESTONES / 06</span>
            </span>
            <h2 className="font-display text-display mt-2">Education &amp; Growth.</h2>
          </div>
          <span className="text-eyebrow text-muted hidden md:inline font-mono">
            ACADEMIC &amp; SELF-DIRECTED
          </span>
        </div>

        <div className="mt-8 border-t border-border">
          {ENTRIES.map((entry) => (
            <div
              key={entry.title}
              className="timeline-row grid md:grid-cols-12 gap-6 py-8 md:py-10 border-b border-border items-start hover:bg-surface/60 transition-colors px-4 -mx-4 rounded-md group"
            >
              <div className="md:col-span-3">
                <span className="text-eyebrow text-accent font-medium block">
                  {entry.period}
                </span>
                <span className="text-xs text-muted font-mono mt-1 block">
                  {entry.organization}
                </span>
              </div>

              <div className="md:col-span-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <entry.icon size={16} className="text-accent group-hover:scale-110 transition-transform" />
                  <h3 className="font-display text-xl md:text-2xl text-white font-medium">
                    {entry.title}
                  </h3>
                </div>
                <p className="text-muted text-sm leading-relaxed mt-2">
                  {entry.description}
                </p>
              </div>

              <div className="md:col-span-4 flex flex-wrap gap-1.5 md:justify-end mt-2 md:mt-0">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-eyebrow text-[0.65rem] border border-border/80 bg-background/50 text-muted px-2.5 py-1 rounded group-hover:border-accent/40 group-hover:text-accent transition-colors"
                  >
                    {tag}
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
