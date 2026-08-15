import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ArrowLeft, ArrowRight, Github, Pause, Play } from 'lucide-react'
import { projects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const AUTOPLAY_MS = 6500
const EASE = [0.16, 1, 0.3, 1] as const

export default function Work() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const inViewRef = useRef(false)
  const touchX = useRef<number | null>(null)

  const total = projects.length
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const active = projects[index]

  const goTo = (i: number, direction: number) => {
    setDir(direction)
    setIndex(((i % total) + total) % total)
  }
  const next = () => goTo(index + 1, 1)
  const prev = () => goTo(index - 1, -1)

  // Section header + stage entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.work-heading', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 80%' } })
      gsap.fromTo('.work-stage-wrap', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } })
      gsap.fromTo('.work-thumb', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.work-thumbs', start: 'top 92%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Respect reduced-motion: never autoplay, let the person navigate manually
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true)
  }, [])

  // In-view + keyboard navigation
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { inViewRef.current = e.isIntersecting }, { threshold: 0.4 })
    io.observe(el)
    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => { io.disconnect(); window.removeEventListener('keydown', onKey) }
  }, [index])

  return (
    <section id="work" ref={rootRef} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="work-heading flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 md:mb-16">
          <div>
            <span className="text-eyebrow text-accent">SELECTED WORK / 02</span>
            <h2 className="font-display text-display mt-4">Things I built.</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-eyebrow hidden sm:inline">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} PROJECTS</span>
            <span className="text-eyebrow text-muted hidden md:inline">DRAG · CLICK · ← →</span>
          </div>
        </div>

        <div className="work-stage-wrap">
          <div
            ref={stageRef}
            className="work-stage relative w-full overflow-hidden border border-border bg-surface"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
            onTouchEnd={(e) => {
              if (touchX.current == null) return
              const dx = e.changedTouches[0].clientX - touchX.current
              if (Math.abs(dx) > 48) (dx < 0 ? next() : prev())
              touchX.current = null
            }}
          >
            {/* progress / episode tabs */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-2 p-4 md:p-6">
              {projects.map((p, i) => (
                <button key={p.number} onClick={() => goTo(i, i > index ? 1 : -1)} className="work-tab" aria-label={`Go to ${p.title}`} data-cursor="open">
                  <span className="work-tab-track">
                    {i === index && (
                      <span
                        key={`fill-${index}`}
                        className="work-tab-fill"
                        style={{ animationDuration: `${AUTOPLAY_MS}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                        onAnimationEnd={() => !paused && next()}
                      />
                    )}
                    {i < index && <span className="work-tab-fill work-tab-fill--done" />}
                  </span>
                  <span className={`work-tab-label ${i === index ? 'text-accent' : ''}`}>{p.number}</span>
                </button>
              ))}
              <button onClick={() => setPaused((v) => !v)} className="work-pause" aria-label={paused ? 'Play autoplay' : 'Pause autoplay'} data-cursor="open">
                {paused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>

            {/* image layer */}
            <div id="work-morph-target" className="absolute inset-0">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active.number}
                  className="absolute inset-0"
                  custom={dir}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <img src={active.image} alt={`${active.title} project preview`} className="w-full h-full object-cover" data-cursor="view" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-background/5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/10 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* content overlay */}
            <div className="relative z-20 flex flex-col justify-end h-full p-6 md:p-12 pointer-events-none">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active.number}
                  custom={dir}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
                  className="grid md:grid-cols-12 gap-6 md:gap-8 items-end pointer-events-auto"
                >
                  <div className="md:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-eyebrow text-accent border border-accent/40 bg-background/60 backdrop-blur px-3 py-1.5">{active.category}</span>
                      <span className="text-eyebrow bg-background/50 backdrop-blur border border-white/10 px-3 py-1.5">{active.accentNote}</span>
                    </div>
                    <p className="text-eyebrow text-white/50 mb-1">PROJECT {active.number}</p>
                    <h3 className="font-display text-3xl md:text-6xl leading-[0.98] tracking-tight">{active.title}</h3>
                    <p className="text-muted leading-relaxed text-sm md:text-base mt-4 max-w-lg">{active.description}</p>
                    <div className="flex flex-wrap gap-2 mt-5">
                      {active.tech.map((t) => <span key={t} className="text-eyebrow border border-border bg-background/40 backdrop-blur px-2.5 py-1.5">{t}</span>)}
                    </div>
                  </div>
                  <div className="md:col-span-5 flex md:flex-col items-start md:items-end gap-5 md:justify-self-end">
                    <div className="flex gap-5 text-sm">
                      {active.demoUrl && <a href={active.demoUrl} data-cursor="open" className="inline-flex items-center gap-1 hover:text-accent transition-colors">Live <ArrowUpRight size={14} /></a>}
                      {active.githubUrl && <a href={active.githubUrl} data-cursor="open" className="inline-flex items-center gap-1 hover:text-accent transition-colors"><Github size={14} /> Code</a>}
                    </div>
                    <span className="font-display text-5xl md:text-7xl text-white/10 leading-none select-none">{active.number}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* arrows */}
            <button onClick={prev} className="work-arrow work-arrow--left" aria-label="Previous project" data-cursor="drag"><ArrowLeft size={18} /></button>
            <button onClick={next} className="work-arrow work-arrow--right" aria-label="Next project" data-cursor="drag"><ArrowRight size={18} /></button>
          </div>

          {/* thumbnail rail */}
          <div className="work-thumbs mt-5 md:mt-6 flex gap-3 overflow-x-auto pb-2">
            {projects.map((p, i) => (
              <button key={p.number} onClick={() => goTo(i, i > index ? 1 : -1)} className={`work-thumb ${i === index ? 'is-active' : ''}`} data-cursor="view">
                <img src={p.image} alt={p.title} />
                <span className="work-thumb-label">{p.number} — {p.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
