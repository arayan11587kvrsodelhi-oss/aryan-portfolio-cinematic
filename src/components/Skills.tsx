import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Code,
  Server,
  Database,
  Wrench,
  Shield,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface SkillGroup {
  title: string
  subtitle: string
  icon: typeof Code
  items: { name: string; tag?: string }[]
}

const CATEGORIES: SkillGroup[] = [
  {
    title: 'Frontend & UI Engineering',
    subtitle: 'High-performance interactive interfaces',
    icon: Code,
    items: [
      { name: 'React.js', tag: 'Core' },
      { name: 'TypeScript', tag: 'Type-Safe' },
      { name: 'JavaScript (ES6+)', tag: 'Modern' },
      { name: 'HTML5', tag: 'Semantic' },
      { name: 'CSS3 / Vanilla CSS', tag: 'Design' },
      { name: 'Tailwind CSS', tag: 'Utility' },
    ],
  },
  {
    title: 'Motion & Interaction',
    subtitle: 'Kinematic animations & gesture physics',
    icon: Zap,
    items: [
      { name: 'Framer Motion', tag: 'Spring Physics' },
      { name: 'GSAP / ScrollTrigger', tag: 'Choreography' },
      { name: 'Lenis Smooth Scroll', tag: 'Momentum' },
      { name: 'Canvas / SVG Animations', tag: 'Vector' },
    ],
  },
  {
    title: 'Backend & APIs',
    subtitle: 'Server runtimes & network communication',
    icon: Server,
    items: [
      { name: 'Node.js', tag: 'Runtime' },
      { name: 'Express.js', tag: 'REST' },
      { name: 'RESTful API Architecture', tag: 'Endpoints' },
      { name: 'HTTP / Client State', tag: 'Async' },
    ],
  },
  {
    title: 'Database & Data Systems',
    subtitle: 'Relational data models & queries',
    icon: Database,
    items: [
      { name: 'MySQL', tag: 'Relational' },
      { name: 'SQL Schema Architecture', tag: 'Structure' },
      { name: 'Data Modeling', tag: 'Entities' },
    ],
  },
  {
    title: 'Tools, Workflow & Design',
    subtitle: 'Developer tooling & prototyping',
    icon: Wrench,
    items: [
      { name: 'Git & GitHub', tag: 'VCS' },
      { name: 'Vite', tag: 'Bundler' },
      { name: 'VS Code', tag: 'IDE' },
      { name: 'Postman', tag: 'Testing' },
      { name: 'Figma', tag: 'UI/UX' },
    ],
  },
  {
    title: 'Web Application Security',
    subtitle: 'Client security & safe workflows',
    icon: Shield,
    items: [
      { name: 'Authentication Architecture', tag: 'Tokens' },
      { name: 'Client Input Sanitization', tag: 'Security' },
      { name: 'Password Security UI', tag: 'Auth' },
      { name: 'OWASP Best Practices', tag: 'Standards' },
    ],
  },
]

export default function Skills() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skill-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            delay: (i % 3) * 0.08,
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
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <Sparkles size={13} />
              <span>TECHNICAL TOOLKIT / 05</span>
            </span>
            <h2 className="font-display text-display mt-2">Skills &amp; Technologies.</h2>
          </div>
          <p className="text-muted text-sm max-w-sm">
            Core engineering stack, motion frameworks, backend services, and web security methodologies applied across production builds.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <div
              key={c.title}
              className="skill-card bg-surface/80 border border-border p-6 rounded-md hover:border-accent/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-2">
                  <span className="p-2.5 rounded bg-accent/10 border border-accent/20 text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300 shadow-[0_0_12px_rgba(53,224,224,0.15)]">
                    <c.icon size={18} />
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-white font-medium">{c.title}</h3>
                    <p className="text-xs text-muted">{c.subtitle}</p>
                  </div>
                </div>

                <div className="h-px bg-border/60 my-4" />

                <ul className="flex flex-wrap gap-2">
                  {c.items.map((item) => (
                    <li
                      key={item.name}
                      className="text-xs text-foreground/80 border border-border/80 bg-background/60 px-3 py-1.5 rounded hover:border-accent/50 hover:text-accent transition-colors flex items-center gap-1.5"
                    >
                      <span>{item.name}</span>
                      {item.tag && (
                        <span className="text-[0.6rem] font-mono text-muted bg-surface/80 px-1 py-0.2 rounded border border-border/40">
                          {item.tag}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
