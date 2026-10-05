import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, FolderGit2, Award } from 'lucide-react'
import { skillGroups, totalSkillCount } from '../data/skills'
import SkillHoverPreview, { type SkillPreviewState } from './SkillHoverPreview'

gsap.registerPlugin(ScrollTrigger)

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

export default function Skills() {
  const rootRef = useRef<HTMLElement>(null)
  const [reduced, setReduced] = useState(false)
  const [preview, setPreview] = useState<SkillPreviewState | null>(null)

  /* Clear the preview when scrolling away (Lenis drives window scroll) */
  useEffect(() => {
    if (!preview) return
    const clear = () => setPreview(null)
    window.addEventListener('scroll', clear, { passive: true })
    return () => window.removeEventListener('scroll', clear)
  }, [preview])

  /* Snapshot the chip rect (viewport coords) so the panel stays stable */
  const chipRect = (el: HTMLElement): SkillPreviewState['anchor'] => {
    const r = el.getBoundingClientRect()
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom }
  }

  const showPreview = (skill: string, el: HTMLElement, follow: boolean) => {
    setPreview({ skill, follow, anchor: chipRect(el) })
  }

  const hidePreview = () => setPreview(null)

  /* Touch: tap toggles an anchored preview (no hover on coarse pointers) */
  const togglePreview = (skill: string, el: HTMLElement) => {
    if (!window.matchMedia('(pointer: coarse)').matches) return
    setPreview((cur) =>
      cur?.skill === skill ? null : { skill, follow: false, anchor: chipRect(el) }
    )
  }

  /* Reduced-motion preference */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  /* Reveal animations */
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
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id="skills" ref={rootRef} className="relative border-t border-border py-[var(--spacing-section)]">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10">
        {/* Sticky editorial header */}
        <div className="sk-head lg:sticky lg:top-0 lg:z-10 lg:bg-background lg:py-9 mb-10 lg:mb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <span className="text-eyebrow text-accent flex items-center gap-2">
                <span className="inline-block w-2 h-2 border border-accent rotate-45" aria-hidden="true" />
                <span>CAPABILITIES &amp; ARCHITECTURE — 05</span>
              </span>
              <h2 className="font-display text-display mt-2">Technical Capabilities.</h2>
            </div>
            <p className="text-muted text-sm max-w-md md:text-right font-mono">
              Direct connection between technical skills, verified GitHub codebases, and recognized credentials.
            </p>
          </div>
          <div className="sk-rule h-px bg-border mt-8" aria-hidden="true" />
        </div>

        {/* Numbered capability rows */}
        <div>
          {skillGroups.map((group, i) => (
            <article
              key={group.category}
              className="sk-row group grid lg:grid-cols-12 gap-x-8 gap-y-6 py-9 lg:py-12 border-b border-border"
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
                <p className="sk-sub font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent mt-1.5">
                  {group.subtitle}
                </p>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-4">
                {/* Skills list — focusable chips with hover/focus preview */}
                <ul className="flex flex-wrap gap-x-4 gap-y-2 content-start">
                  {group.skills.map((skill) => (
                    <li key={skill} className="sk-chip flex items-center gap-2">
                      <button
                        type="button"
                        className="sk-chip-btn flex items-center gap-2"
                        onMouseEnter={(e) => showPreview(skill, e.currentTarget, true)}
                        onMouseLeave={hidePreview}
                        onFocus={(e) => showPreview(skill, e.currentTarget, false)}
                        onBlur={hidePreview}
                        onClick={(e) => togglePreview(skill, e.currentTarget)}
                      >
                        <span className="sk-dot" aria-hidden="true" />
                        <span className="text-sm font-mono text-foreground/90 transition-colors duration-300">
                          {skill}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Relational Cross-Links: Projects + Certifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs font-mono">
                  {group.relatedProjects.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <FolderGit2 size={11} className="text-emerald-400" /> Grounded in Repositories:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.relatedProjects.map((p) => (
                          <span
                            key={p}
                            className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {group.relatedCertificates.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Award size={11} className="text-accent" /> Verified by Credentials:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {group.relatedCertificates.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent text-[10px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-muted mt-8">
          {pad2(skillGroups.length)} disciplines · {pad2(totalSkillCount)} technologies · Verified against GitHub &amp; Credentials
        </p>

        {/* Editorial hover / focus / tap skill preview (supplementary) */}
        <SkillHoverPreview preview={preview} />
      </div>
    </section>
  )
}
