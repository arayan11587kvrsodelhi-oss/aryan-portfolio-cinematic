import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { skillGroups, totalSkillCount } from '../data/skills'

gsap.registerPlugin(ScrollTrigger)

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export default function Skills() {
  const rootRef = useRef<HTMLElement>(null)
  const [reduced, setReduced] = useState(false)

  /* Reduced-motion preference */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  /* Restrained reveal: header first, then rows, then skill labels */
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.sk-head',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 78%' },
        }
      )

      gsap.fromTo(
        '.sk-rule',
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: 'left center',
          duration: 1.1,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: rootRef.current, start: 'top 74%' },
        }
      )

      gsap.utils.toArray<HTMLElement>('.sk-row').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%' },
          }
        )
        gsap.fromTo(
          row.querySelectorAll('.sk-chip'),
          { y: 12, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: 'power2.out',
            stagger: 0.035,
            scrollTrigger: { trigger: row, start: 'top 86%' },
          }
        )
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="skills" ref={rootRef} className="relative border-t border-border py-[var(--spacing-section)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10">
        {/* Sticky editorial header — engineering document masthead */}
        <div className="sk-head lg:sticky lg:top-0 lg:z-10 lg:bg-background lg:py-9 mb-10 lg:mb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <span className="text-eyebrow text-accent flex items-center gap-2">
                <span className="inline-block w-2 h-2 border border-accent rotate-45" aria-hidden="true" />
                <span>SKILLS / TECHNOLOGIES — 05</span>
              </span>
              <h2 className="font-display text-display mt-2">Skills &amp; Technologies.</h2>
            </div>
            <p className="text-muted text-sm max-w-sm md:text-right">
              The stack behind every build — interfaces, motion systems, services, data, tooling, and web security practice.
            </p>
          </div>
          <div className="sk-rule h-px bg-border mt-8" aria-hidden="true" />
        </div>

        {/* Numbered capability rows — thin dividers, monochrome, restrained accents */}
        <div>
          {skillGroups.map((group, i) => (
            <article
              key={group.category}
              className="sk-row group grid lg:grid-cols-12 gap-x-8 gap-y-4 py-9 lg:py-12 border-b border-border"
            >
              <div className="lg:col-span-1">
                <span className="sk-idx font-mono text-xs tracking-[0.2em] text-muted transition-colors duration-300">
                  {pad2(i + 1)}
                </span>
              </div>

              <div className="lg:col-span-4">
                <h3 className="sk-title font-display text-xl md:text-2xl font-medium text-white tracking-wide">
                  {group.category}
                </h3>
                <p className="sk-sub font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted mt-1.5">
                  {group.subtitle}
                </p>
              </div>

              <ul className="lg:col-span-6 flex flex-wrap gap-x-4 gap-y-2.5 content-start">
                {group.skills.map((skill) => (
                  <li key={skill} className="sk-chip flex items-center gap-2">
                    <span className="sk-dot" aria-hidden="true" />
                    <span className="text-sm text-foreground/80 transition-colors duration-300">{skill}</span>
                  </li>
                ))}
              </ul>

              <div className="hidden lg:flex lg:col-span-1 justify-end">
                <ArrowUpRight
                  size={18}
                  className="sk-arrow text-muted/50 transition-all duration-300"
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>

        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-muted mt-8">
          {pad2(skillGroups.length)} disciplines · {pad2(totalSkillCount)} technologies
        </p>
      </div>
    </section>
  )
}
