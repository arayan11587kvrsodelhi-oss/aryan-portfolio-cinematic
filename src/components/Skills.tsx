import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Code, Server, Database, Wrench, Shield, Terminal } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  {
    title: 'Frontend Development',
    icon: Code,
    items: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    title: 'Backend & APIs',
    icon: Server,
    items: ['Node.js', 'Express', 'PHP', 'REST APIs'],
  },
  {
    title: 'Database & Data',
    icon: Database,
    items: ['MySQL', 'SQL Architecture', 'Data Modeling'],
  },
  {
    title: 'Tools & Workflow',
    icon: Wrench,
    items: ['Git & GitHub', 'VS Code', 'Vite', 'Postman'],
  },
  {
    title: 'Cybersecurity',
    icon: Shield,
    items: ['Web Security', 'Authentication Flows', 'Network Security', 'Input Sanitization'],
  },
]

export default function Skills() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skill-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: i * 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section id="skills" ref={rootRef} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-eyebrow text-accent">TECHNICAL TOOLKIT / 04</span>
            <h2 className="font-display text-display mt-3">Skills &amp; Technologies.</h2>
          </div>
          <p className="text-muted text-sm max-w-sm">
            Core stack and foundational engineering tools applied across web apps, UI systems, and security experiments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="skill-card bg-surface/70 border border-border/80 p-6 rounded-sm hover:border-accent/40 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="p-2.5 rounded bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-background transition-all">
                  <c.icon size={18} />
                </span>
                <h3 className="font-display text-lg text-foreground font-medium">{c.title}</h3>
              </div>

              <ul className="flex flex-wrap gap-2">
                {c.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-muted border border-border/70 bg-background/50 px-3 py-1.5 rounded-sm hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
