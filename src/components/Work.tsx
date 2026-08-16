import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Github,
  Pause,
  Play,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  X,
  Maximize2,
  ExternalLink,
  Layers
} from 'lucide-react'
import { projects, Project } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const AUTOPLAY_MS = 7500
const EASE = [0.16, 1, 0.3, 1] as const

export default function Work() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const inViewRef = useRef(false)
  const touchX = useRef<number | null>(null)

  const total = projects.length
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null)

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
      gsap.fromTo(
        '.work-heading',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 80%' } }
      )
      gsap.fromTo(
        '.work-stage-wrap',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.1, ease: 'power3.out', scrollTrigger: { trigger: rootRef.current, start: 'top 72%' } }
      )
      gsap.fromTo(
        '.work-thumb',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: '.work-thumbs', start: 'top 92%' } }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Respect reduced-motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true)
  }, [])

  // In-view + keyboard navigation
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { inViewRef.current = e.isIntersecting }, { threshold: 0.3 })
    io.observe(el)

    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current || activeModalProject) return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'Escape' && activeModalProject) setActiveModalProject(null)
    }
    window.addEventListener('keydown', onKey)
    return () => { io.disconnect(); window.removeEventListener('keydown', onKey) }
  }, [index, activeModalProject])

  // Mouse move 3D tilt effect on active image container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const el = imageContainerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -4
    const rotateY = ((x - centerX) / centerX) * 4

    gsap.to(el, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
      overwrite: 'auto'
    })
  }

  const handleMouseLeave = () => {
    const el = imageContainerRef.current
    if (!el) return
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto'
    })
  }

  return (
    <section id="work" ref={rootRef} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        {/* Section Heading */}
        <div className="work-heading flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="text-eyebrow text-accent">CASE STUDIES / 02</span>
            <h2 className="font-display text-display mt-3">Selected Projects.</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-eyebrow hidden sm:inline text-muted">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} PROJECTS
            </span>
            <span className="text-eyebrow text-muted hidden md:inline">DRAG · CLICK · ← →</span>
          </div>
        </div>

        {/* Stage Wrapper */}
        <div className="work-stage-wrap">
          <div
            ref={stageRef}
            className="work-stage relative w-full overflow-hidden border border-border bg-surface rounded-sm"
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
            {/* Top Progress Tabs */}
            <div className="absolute top-0 left-0 right-0 z-30 flex gap-1.5 md:gap-2 p-3 md:p-6 bg-gradient-to-b from-background/90 via-background/40 to-transparent backdrop-blur-[2px]">
              {projects.map((p, i) => (
                <button
                  key={p.number}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className="work-tab"
                  aria-label={`Go to ${p.title}`}
                  data-cursor="open"
                >
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
                  <span className={`work-tab-label ${i === index ? 'text-accent font-medium' : ''}`}>{p.number}</span>
                </button>
              ))}
              <button
                onClick={() => setPaused((v) => !v)}
                className="work-pause"
                aria-label={paused ? 'Play autoplay' : 'Pause autoplay'}
                data-cursor="open"
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>

            {/* Stage Background Showcase Image with Tilt */}
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              id="work-morph-target"
              className="absolute inset-0 transition-transform duration-300 ease-out"
            >
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active.number}
                  className="absolute inset-0"
                  custom={dir}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.85, ease: EASE }}
                >
                  <img
                    src={active.image}
                    alt={`${active.title} project preview`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                    data-cursor="view"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/20 to-transparent" />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Case Study Content Overlay */}
            <div className="relative z-20 flex flex-col justify-end h-full p-6 md:p-10 lg:p-12 pointer-events-none">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={active.number}
                  custom={dir}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -16, opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
                  className="grid md:grid-cols-12 gap-6 items-end pointer-events-auto"
                >
                  <div className="md:col-span-8 lg:col-span-8">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-eyebrow text-accent border border-accent/40 bg-background/80 backdrop-blur px-3 py-1">
                        {active.category}
                      </span>
                      <span className="text-eyebrow text-white/80 bg-surface/80 backdrop-blur border border-border px-3 py-1">
                        {active.accentNote}
                      </span>
                    </div>

                    <p className="text-eyebrow text-white/50 mb-1">CASE STUDY / {active.number}</p>
                    <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-white">
                      {active.title}
                    </h3>

                    {/* Problem Solved Summary */}
                    <div className="mt-3 text-muted text-sm md:text-base leading-relaxed max-w-xl line-clamp-2 md:line-clamp-3">
                      <span className="text-white/90 font-medium">Problem Solved: </span>
                      {active.problemSolved}
                    </div>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {active.tech.map((t) => (
                        <span key={t} className="text-eyebrow border border-border/80 bg-background/60 backdrop-blur text-white/80 px-2.5 py-1">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Deep Dive CTA */}
                  <div className="md:col-span-4 lg:col-span-4 flex flex-wrap md:flex-col items-start md:items-end justify-between md:justify-end gap-4">
                    <button
                      onClick={() => setActiveModalProject(active)}
                      data-cursor="open"
                      className="inline-flex items-center gap-2 bg-accent/15 border border-accent text-accent hover:bg-accent hover:text-background transition-all px-5 py-3 rounded-full text-xs md:text-sm font-display font-medium shadow-[0_0_20px_rgba(53,224,224,0.2)]"
                    >
                      <Maximize2 size={15} />
                      <span>View Full Case Study</span>
                    </button>

                    <div className="flex items-center gap-4 text-sm pt-1">
                      {active.demoUrl && (
                        <a
                          href={active.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="open"
                          className="inline-flex items-center gap-1.5 text-accent hover:underline transition-colors font-medium"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight size={15} />
                        </a>
                      )}
                      {active.githubUrl && (
                        <a
                          href={active.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-cursor="open"
                          className="inline-flex items-center gap-1.5 text-white/80 hover:text-accent transition-colors font-medium"
                        >
                          <Github size={15} />
                          <span>Source Code</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav Arrows */}
            <button onClick={prev} className="work-arrow work-arrow--left" aria-label="Previous project" data-cursor="drag">
              <ArrowLeft size={18} />
            </button>
            <button onClick={next} className="work-arrow work-arrow--right" aria-label="Next project" data-cursor="drag">
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Thumbnail Rail */}
          <div className="work-thumbs mt-5 md:mt-6 flex gap-3 overflow-x-auto pb-2">
            {projects.map((p, i) => (
              <button
                key={p.number}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`work-thumb ${i === index ? 'is-active' : ''}`}
                data-cursor="view"
              >
                <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                <span className="work-thumb-label">
                  {p.number} — {p.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Case Study Deep-Dive Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/90 backdrop-blur-md overflow-y-auto"
            onClick={() => setActiveModalProject(null)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl overflow-hidden rounded-md my-auto max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 md:p-6 border-b border-border bg-background/60">
                <div className="flex items-center gap-3">
                  <span className="text-eyebrow text-accent border border-accent/30 px-2.5 py-1">
                    PROJECT {activeModalProject.number}
                  </span>
                  <span className="text-eyebrow text-muted hidden sm:inline">{activeModalProject.category}</span>
                </div>
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="p-2 text-muted hover:text-foreground hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 text-foreground">
                {/* Hero Title & Image */}
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <h2 className="font-display text-3xl md:text-5xl leading-tight">{activeModalProject.title}</h2>
                    <p className="text-muted mt-3 leading-relaxed">{activeModalProject.description}</p>
                  </div>
                  <div className="md:col-span-5 h-48 md:h-56 rounded border border-border overflow-hidden relative">
                    <img src={activeModalProject.image} alt={activeModalProject.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                  </div>
                </div>

                {/* Case Study Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 border-t border-border/60 pt-6">
                  {/* Problem Solved */}
                  <div className="bg-background/40 border border-border p-5 rounded">
                    <div className="flex items-center gap-2 text-accent font-display text-base mb-3">
                      <AlertCircle size={18} />
                      <span>The Challenge &amp; Problem</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{activeModalProject.problemSolved}</p>
                  </div>

                  {/* Contribution */}
                  <div className="bg-background/40 border border-border p-5 rounded">
                    <div className="flex items-center gap-2 text-accent font-display text-base mb-3">
                      <UserCheck size={18} />
                      <span>My Contribution</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{activeModalProject.myContribution}</p>
                  </div>
                </div>

                {/* Key Features List */}
                <div className="border-t border-border/60 pt-6">
                  <div className="flex items-center gap-2 font-display text-lg mb-4 text-accent">
                    <CheckCircle2 size={18} />
                    <span>Key Features &amp; Capabilities</span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {activeModalProject.keyFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-muted bg-background/30 p-3 border border-border/40 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="border-t border-border/60 pt-6">
                  <div className="flex items-center gap-2 font-display text-base mb-3">
                    <Layers size={16} className="text-accent" />
                    <span>Technologies &amp; Architecture</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.tech.map((t) => (
                      <span key={t} className="text-eyebrow border border-accent/30 bg-accent/5 text-accent px-3 py-1.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer Links */}
              <div className="p-5 md:p-6 border-t border-border bg-background/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {activeModalProject.demoUrl && (
                    <a
                      href={activeModalProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-display text-xs md:text-sm font-medium rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(53,224,224,0.3)]"
                    >
                      <span>Launch Live Demo</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {activeModalProject.githubUrl && (
                    <a
                      href={activeModalProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-surface text-foreground hover:border-accent hover:text-accent font-display text-xs md:text-sm rounded-full transition-all"
                    >
                      <Github size={15} />
                      <span>View Repository</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setActiveModalProject(null)}
                  className="text-eyebrow text-muted hover:text-white transition-colors"
                >
                  PRESS ESC OR CLICK TO CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
