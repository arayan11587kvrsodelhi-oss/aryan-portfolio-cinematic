import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CATEGORIES = [
  { title: 'Frontend', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { title: 'Backend', items: ['Node.js', 'Express', 'PHP'] },
  { title: 'Database', items: ['MySQL', 'SQL'] },
  { title: 'Tools', items: ['Git', 'GitHub', 'VS Code'] },
  {
    title: 'Cybersecurity',
    items: ['Web Security', 'Authentication', 'Network Security', 'Cybersecurity Fundamentals'],
  },
]

export default function Skills() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skill-col').forEach((col, i) => {
        gsap.fromTo(
          col,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.06,
            ease: 'power3.out',
            scrollTrigger: { trigger: col, start: 'top 85%' },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <span className="text-eyebrow">Toolkit</span>
        <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-12">
          {CATEGORIES.map((c) => (
            <div key={c.title} className="skill-col">
              <h3 className="font-display text-lg mb-4 text-accent">{c.title}</h3>
              <ul className="flex flex-col gap-2">
                {c.items.map((item) => (
                  <li key={item} className="text-sm text-muted">
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
