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
  Layers,
  Sparkles,
  LayoutGrid,
  Film,
  Code2
} from 'lucide-react'
import { projects, Project } from '../data/projects'
import { useSFX } from '../hooks/useSFX'
import { lenisState } from '../lib/useLenis'

gsap.registerPlugin(ScrollTrigger)

const AUTOPLAY_MS = 8000
const EASE = [0.16, 1, 0.3, 1] as const

type ViewMode = 'cinematic' | 'grid'
type FilterCategory = 'ALL' | 'FLAGSHIP' | 'FINTECH' | 'CREATIVE' | 'SECURITY' | 'TOOLS'

const TOTAL = projects.length
const TOTAL_STR = String(TOTAL).padStart(2, '0')

function applyFilter(p: Project, filter: FilterCategory) {
  if (filter === 'FLAGSHIP') return p.featured && (p.title === 'VELORA' || p.title === 'AMBER HOUR')
  if (filter === 'FINTECH') return p.category.toLowerCase().includes('fintech')
  if (filter === 'CREATIVE')
    return (
      p.category.toLowerCase().includes('creative') ||
      p.category.toLowerCase().includes('automotive') ||
      p.category.toLowerCase().includes('3d /')
    )
  if (filter === 'SECURITY')
    return p.category.toLowerCase().includes('security') || p.category.toLowerCase().includes('cybersecurity')
  if (filter === 'TOOLS')
    return (
      p.category.toLowerCase().includes('tool') ||
      p.category.toLowerCase().includes('landing') ||
      p.category.toLowerCase().includes('intelligence')
    )
  return true
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}
/* Desktop scroll-track slide */
interface SlideProps {
  project: Project
  index: number
  featured: boolean
  onCaseStudy: (p: Project) => void
}

function ProjectSlide({ project, index, featured, onCaseStudy }: SlideProps) {
  const open = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onCaseStudy(project)
  }
  return (
    <article
      className={`work-slide ${featured ? 'work-slide--featured' : 'work-slide--compact'}`}
      onClick={() => onCaseStudy(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onCaseStudy(project)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open case study for ${project.title}`}
      data-cursor="view"
      data-cursor-text="CASE"
    >
      <img
        src={project.image}
        alt={`${project.title} â€” ${project.category}`}
        className="work-slide-bg"
        loading={index < 3 ? 'eager' : 'lazy'}
        draggable={false}
      />
      <div className="work-slide-shade" aria-hidden="true" />
      <div className="work-slide-frame">
        <div className="work-slide-top">
          <span className="work-slide-number">{project.number}</span>
          {featured && project.badge ? (
            <span className="work-slide-badge">{project.badge}</span>
          ) : (
            <span className="work-slide-badge work-slide-badge--quiet">{project.category}</span>
          )}
        </div>

        <div className="work-slide-body">
          <div className="work-slide-copy">
            <p className="work-slide-kicker">
              {featured ? project.category : `PROJECT ${project.number} / ${TOTAL_STR}`}
            </p>
            <h3 className="work-slide-title">{project.title}</h3>
            <p className="work-slide-tagline">{project.tagline}</p>
            {featured && <p className="work-slide-desc">{project.description}</p>}
            <div className="work-slide-tech">
              {project.tech.slice(0, featured ? 7 : 5).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>

          <div className="work-slide-actions">
            <p className="work-slide-note">{project.accentNote}</p>
            <div className="work-slide-actions-row">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="work-slide-link"
                  data-cursor="open"
                >
                  <ArrowUpRight size={14} />
                  <span>Live Demo</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="work-slide-link work-slide-link--ghost"
                  data-cursor="open"
                >
                  <Github size={14} />
                  <span>GitHub</span>
                </a>
              )}
              <button
                type="button"
                onClick={open}
                className="work-slide-cta"
                data-cursor="view"
                data-cursor-text="CASE"
              >
                <span>Case Study</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
export default function Work() {
  const { playSFX } = useSFX()
  const sectionRef = useRef<HTMLElement>(null)
  const stageWrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const thumbsRef = useRef<HTMLDivElement>(null)
  const modalTriggerRef = useRef<HTMLButtonElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('cinematic')
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL')
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const active = projects[index] || projects[0]
  const filteredGridProjects = projects.filter((p) => applyFilter(p, activeFilter))

  /* Reduced-motion preference */
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setPrefersReducedMotion(motionQuery.matches)
      if (motionQuery.matches) setPaused(true)
    }
    update()
    motionQuery.addEventListener('change', update)
    return () => motionQuery.removeEventListener('change', update)
  }, [])

  /* Navigation helpers */
  const goTo = (i: number, direction: number) => {
    playSFX('nav')
    setDir(direction)
    setIndex(((i % TOTAL) + TOTAL) % TOTAL)
  }

  const scrollToSlide = (i: number) => {
    const st = stRef.current
    const clamped = Math.max(0, Math.min(TOTAL - 1, i))
    if (!st || prefersReducedMotion) {
      goTo(clamped, clamped >= index ? 1 : -1)
      return
    }
    const p = clamped / (TOTAL - 1)
    const target = st.start + p * (st.end - st.start)
    const lenis = lenisState.instance
    playSFX('nav')
    if (lenis) lenis.scrollTo(target, { duration: 1.15 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const nextSlide = () => {
    if (stRef.current && !prefersReducedMotion) scrollToSlide(index + 1)
    else goTo(index + 1, 1)
  }
  const prevSlide = () => {
    if (stRef.current && !prefersReducedMotion) scrollToSlide(index - 1)
    else goTo(index - 1, -1)
  }
/* Scroll-driven pinned horizontal slider (desktop >= 1024px) */
  useEffect(() => {
    if (prefersReducedMotion) return
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const ctx = gsap.context(() => {
        const track = trackRef.current
        const wrap = stageWrapRef.current
        if (!track || !wrap) return

        const getAmount = () => Math.max(0, track.scrollWidth - wrap.clientWidth)

        const tween = gsap.to(track, {
          x: () => -getAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: wrap,
            start: 'top top',
            end: () => `+=${getAmount()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress
              const idx = Math.min(TOTAL - 1, Math.max(0, Math.round(p * (TOTAL - 1))))
              setIndex((prev) => (prev === idx ? prev : idx))
              if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${p})`
              }
            },
          },
        })
        if (tween.scrollTrigger) stRef.current = tween.scrollTrigger
      }, stageWrapRef)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [prefersReducedMotion])

  /* Entrance reveal */
  useEffect(() => {
    if (prefersReducedMotion) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.work-heading',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [prefersReducedMotion])

  /* Autoplay â€” only for the touch fallback carousel (never fights scrubbed scroll) */
  useEffect(() => {
    if (prefersReducedMotion || paused) return
    if (stRef.current) return // scroll-driven slider owns progress on desktop
    const id = window.setInterval(() => goTo(index + 1, 1), AUTOPLAY_MS)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, prefersReducedMotion])

  /* Keyboard controls */
  useEffect(() => {
    let inView = false
    const io = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { threshold: 0.2 })
    if (sectionRef.current) io.observe(sectionRef.current)

    const onKey = (event: KeyboardEvent) => {
      if (activeModalProject || !inView) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        nextSlide()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prevSlide()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, activeModalProject, prefersReducedMotion])

  /* Touch swipe for the fallback carousel */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) < 48 || Math.abs(dy) > Math.abs(dx)) return
    if (dx < 0) nextSlide()
    else prevSlide()
  }
const FILTERS: FilterCategory[] = ['ALL', 'FLAGSHIP', 'FINTECH', 'CREATIVE', 'SECURITY', 'TOOLS']
  const desktopStageClass = prefersReducedMotion ? 'hidden' : 'hidden lg:block'
  const mobileStageClass = prefersReducedMotion ? 'block' : 'block lg:hidden'

  return (
    <section id="work" ref={sectionRef} className="relative border-t border-border">
      {/* Section heading */}
      <div className="work-heading max-w-container mx-auto px-4 sm:px-6 md:px-10 pt-[var(--spacing-section)]">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
          <div>
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <Sparkles size={13} />
              <span>FEATURED WORK / 02</span>
            </span>
            <h2 className="font-display text-display mt-2">Selected Work.</h2>
          </div>

          <div className="flex items-center gap-2" role="group" aria-label="Project view mode">
            <button
              type="button"
              onClick={() => {
                playSFX('click')
                setViewMode('cinematic')
              }}
              onMouseEnter={() => playSFX('hover')}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-eyebrow transition-colors min-h-[44px] ${
                viewMode === 'cinematic'
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border text-muted hover:text-foreground'
              }`}
              data-cursor="open"
            >
              <Film size={13} />
              Cinematic
            </button>
            <button
              type="button"
              onClick={() => {
                playSFX('click')
                setViewMode('grid')
              }}
              onMouseEnter={() => playSFX('hover')}
              className={`inline-flex items-center gap-2 border px-4 py-2 text-eyebrow transition-colors min-h-[44px] ${
                viewMode === 'grid'
                  ? 'border-accent text-accent bg-accent/5'
                  : 'border-border text-muted hover:text-foreground'
              }`}
              data-cursor="open"
            >
              <LayoutGrid size={13} />
              All Projects
              <span className="font-mono text-[0.6rem] text-muted">({TOTAL})</span>
            </button>
          </div>
        </div>

        {/* Grid filter chips (grid mode only) */}
        {viewMode === 'grid' && (
          <div className="flex flex-wrap items-center gap-2 mb-8" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => {
                  playSFX('click')
                  setActiveFilter(f)
                }}
                onMouseEnter={() => playSFX('hover')}
                className={`text-eyebrow border px-3 py-2 transition-colors min-h-[44px] ${
                  activeFilter === f
                    ? 'border-accent text-accent bg-accent/5'
                    : 'border-border text-muted hover:text-foreground'
                }`}
                data-cursor="open"
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>
{/* ---------------------------------------------------------
          DESKTOP â€” scroll-driven pinned horizontal track
          --------------------------------------------------------- */}
      <div ref={stageWrapRef} className={`${desktopStageClass} ${prefersReducedMotion ? 'is-reduced' : ''} work-scroll-stage mt-10 sm:mt-14`}>
        <div ref={trackRef} className="work-track">
          {projects.map((p, i) => (
            <ProjectSlide
              key={p.id}
              project={p}
              index={i}
              featured={i < 4}
              onCaseStudy={setActiveModalProject}
            />
          ))}
        </div>

        {/* Top chrome: counter + progress + arrows */}
        <div className="work-chrome" aria-hidden="true">
          <div className="work-chrome-status">
            <span className="work-chrome-eyebrow">SCROLL TO EXPLORE</span>
            <div className="work-chrome-count">
              <span className="text-accent font-mono">{pad2(index + 1)}</span>
              <span className="font-mono text-muted"> / {TOTAL_STR}</span>
            </div>
          </div>

          <div className="work-chrome-rail">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous project"
              className="work-arrow work-arrow--left"
              data-cursor="open"
              data-cursor-text="PREV"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next project"
              className="work-arrow work-arrow--right"
              data-cursor="open"
              data-cursor-text="NEXT"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="work-progress">
          <div ref={progressFillRef} className="work-progress-fill" />
        </div>
      </div>
{/* ---------------------------------------------------------
          MOBILE / reduced-motion â€” touch-friendly carousel
          (all projects remain browsable via swipe, arrows, tabs)
          --------------------------------------------------------- */}
      <div className={`${mobileStageClass} mt-10 sm:mt-14`}>
        <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10">
          {/* Top rail: count, tabs, pause */}
          <div className="flex items-center gap-4 mb-4">
            <span className="font-mono text-sm text-white/90 shrink-0">
              {pad2(index + 1)} <span className="text-muted">/ {TOTAL_STR}</span>
            </span>
            <div className="flex items-center gap-1.5 flex-1">
              {projects.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`Go to project ${p.number} ${p.title}`}
                  aria-current={index === i}
                  className="work-tab"
                  data-cursor="open"
                >
                  <span className="work-tab-label">{p.number}</span>
                  <span className="work-tab-track">
                    <span
                      className={`work-tab-fill ${index === i ? 'work-tab-fill--active' : ''}`}
                      style={index === i ? { width: '100%' } : { width: '0%' }}
                    />
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                playSFX('click')
                setPaused((v) => !v)
              }}
              className="work-pause"
              aria-label={paused ? 'Play autoplay' : 'Pause autoplay'}
              data-cursor="open"
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>
          </div>

          {/* Stage */}
          <div
            className="work-stage"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{ touchAction: 'pan-y' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.55, ease: EASE }}
                className="absolute inset-0"
              >
{/* Image layer */}
                <div
                  onClick={() => setActiveModalProject(active)}
                  data-cursor="view"
                  data-cursor-text="CASE"
                  className="absolute inset-0 overflow-hidden cursor-pointer"
                >
                  <img
                    src={active.image}
                    alt={active.title}
                    className="h-full w-full object-cover"
                    loading="eager"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20" />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-transparent md:via-background/20" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-10 pointer-events-none">
                  <div className="pointer-events-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-eyebrow text-accent border border-accent/40 bg-background/80 backdrop-blur px-3 py-1">
                        {active.category}
                      </span>
                      <span className="text-eyebrow font-mono text-white/50">CASE STUDY {active.number}</span>
                    </div>
                    <h3 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium leading-none text-white">
                      {active.title}
                    </h3>
                    <p className="text-accent text-sm sm:text-base font-display mt-3">{active.tagline}</p>
                    <p className="text-muted text-sm mt-2 max-w-2xl hidden md:block">{active.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {active.tech.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="text-eyebrow text-[0.65rem] border border-border/80 bg-background/60 text-muted px-2.5 py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 mt-5">
                      {active.demoUrl && (
                        <a
                          href={active.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-background transition-colors px-5 py-3 text-eyebrow"
                          data-cursor="open"
                          onMouseEnter={() => playSFX('hover')}
                        >
                          Live Demo
                          <ArrowUpRight size={14} />
                        </a>
                      )}
                      {active.githubUrl && (
                        <a
                          href={active.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-border text-muted hover:text-foreground hover:border-white/40 transition-colors px-5 py-3 text-eyebrow"
                          data-cursor="open"
                          onMouseEnter={() => playSFX('hover')}
                        >
                          <Github size={14} />
                          Source
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setActiveModalProject(active)}
                        className="inline-flex items-center gap-2 rounded-full bg-accent/20 border border-accent text-accent hover:bg-accent hover:text-background transition-all px-5 py-3 text-eyebrow"
                        data-cursor="view"
                        onMouseEnter={() => playSFX('hover')}
                      >
                        Case Study
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={prevSlide}
              className="work-arrow work-arrow--left"
              aria-label="Previous project"
              data-cursor="open"
              data-cursor-text="PREV"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="work-arrow work-arrow--right"
              aria-label="Next project"
              data-cursor="open"
              data-cursor-text="NEXT"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Thumbnails */}
          <div
            ref={thumbsRef}
            className="work-thumbs flex gap-2.5 mt-4 overflow-x-auto pb-2 pt-1"
            style={{ touchAction: 'pan-x' }}
          >
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className={`work-thumb ${index === i ? 'is-active' : ''}`}
                aria-label={`Project ${p.number} ${p.title}`}
                data-cursor="open"
              >
                <img src={p.image} alt="" loading="lazy" draggable={false} />
                <span className="work-thumb-label">{p.number}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
{/* ---------------------------------------------------------
          GRID VIEW â€” all 15 projects as an accessible index
          --------------------------------------------------------- */}
      {viewMode === 'grid' && (
        <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pb-[var(--spacing-section)]">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGridProjects.map((p) => (
              <article
                key={p.id}
                className="group border border-border bg-surface/60 hover:border-accent/40 transition-colors flex flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.image}
                    alt={`${p.title} â€” ${p.category}`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    draggable={false}
                  />
                  <span className="absolute left-3 top-3 bg-background/80 backdrop-blur border border-border/60 text-eyebrow text-white/70 font-mono px-2 py-1">
                    {p.number}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-eyebrow text-accent">{p.category}</p>
                  <h3 className="font-display text-xl text-white font-medium mt-1">{p.title}</h3>
                  <p className="text-muted text-sm mt-2 leading-relaxed line-clamp-2">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {p.tech.slice(0, 4).map((t) => (
                      <span key={t} className="text-eyebrow text-[0.62rem] border border-border/70 text-muted px-2 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/60">
                    <button
                      type="button"
                      onClick={() => setActiveModalProject(p)}
                      onMouseEnter={() => playSFX('hover')}
                      className="inline-flex items-center gap-1.5 text-eyebrow text-accent hover:brightness-125 transition"
                      data-cursor="view"
                    >
                      Case Study
                      <ArrowUpRight size={13} />
                    </button>
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSFX('click')}
                        onMouseEnter={() => playSFX('hover')}
                        className="inline-flex items-center gap-1.5 text-eyebrow text-muted hover:text-foreground transition"
                        data-cursor="open"
                      >
                        Live
                        <ExternalLinkIcon />
                      </a>
                    )}
                    {p.githubUrl && (
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => playSFX('click')}
                        onMouseEnter={() => playSFX('hover')}
                        className="inline-flex items-center gap-1.5 text-eyebrow text-muted hover:text-foreground transition"
                        data-cursor="open"
                      >
                        <Github size={13} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Case Study Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <CaseStudyModal project={activeModalProject} onClose={() => setActiveModalProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}

function ExternalLinkIcon() {
  return <ArrowUpRight size={13} />
}
/* ------------------------------------------------------------------ */
/* Case study modal                                                    */
/* ------------------------------------------------------------------ */

function CaseStudyModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', close)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[90] bg-background/90 backdrop-blur-xl p-4 sm:p-6 md:p-10 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="relative w-full max-w-5xl mx-auto border border-border bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="absolute right-3 top-3 z-10 p-3 text-muted hover:text-white min-h-[44px]"
          data-cursor="close"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="p-5 sm:p-8 md:p-10 border-b border-border">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-eyebrow text-accent border border-accent/40 bg-accent/5 px-3 py-1">
              CASE STUDY {project.number}
            </span>
            <span className="text-eyebrow text-muted">{project.category}</span>
            {project.badge && <span className="text-eyebrow text-white/60">{project.badge}</span>}
          </div>
          <h2 className="font-display text-3xl sm:text-5xl text-white font-medium leading-none">{project.title}</h2>
          <p className="text-accent font-display mt-3">{project.tagline}</p>
          <p className="text-muted text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">{project.description}</p>
        </div>
<div className="p-5 sm:p-8 md:p-10 space-y-8">
          {/* Problem */}
          <div>
            <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
              <AlertCircle size={16} className="text-accent" />
              <span>The Problem</span>
            </div>
            <p className="text-muted text-sm sm:text-base leading-relaxed">{project.problemSolved}</p>
          </div>

          {/* Key features */}
          <div>
            <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
              <CheckCircle2 size={16} className="text-accent" />
              <span>Key Features</span>
            </div>
            <ul className="grid sm:grid-cols-2 gap-3">
              {project.keyFeatures.map((feat, idx) => (
                <li
                  key={`${project.id}-feat-${idx}`}
                  className="flex items-start gap-2.5 text-sm text-muted bg-background/40 p-3.5 border border-border/60"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span className="leading-relaxed">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Architecture */}
          {project.architectureDetails && (
            <div>
              <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
                <Code2 size={17} className="text-accent" />
                <span>Architecture &amp; Implementation</span>
              </div>
              <ul className="space-y-2">
                {project.architectureDetails.map((arch, idx) => (
                  <li
                    key={`${project.id}-arch-${idx}`}
                    className="text-xs sm:text-sm text-muted bg-background/30 px-3.5 py-2.5 border border-border/40 flex items-center gap-2"
                  >
                    <span className="text-accent font-mono text-xs">▸</span>
                    <span>{arch}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contribution */}
          <div>
            <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
              <UserCheck size={16} className="text-accent" />
              <span>My Contribution</span>
            </div>
            <p className="text-muted text-sm sm:text-base leading-relaxed">{project.myContribution}</p>
          </div>

          {/* Tech */}
          <div>
            <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
              <Layers size={16} className="text-accent" />
              <span>Technology Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-eyebrow text-xs border border-accent/30 bg-accent/5 text-accent px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="sticky bottom-0 z-20 p-4 sm:p-6 border-t border-border bg-background/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-background font-display text-xs md:text-sm font-semibold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(53,224,224,0.35)] min-h-[44px]"
                data-cursor="open"
              >
                <span>Launch Live Demo</span>
                <ArrowUpRight size={14} />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:py-3 border border-border text-muted hover:text-foreground hover:border-white/40 font-display text-xs md:text-sm rounded-full transition-all min-h-[44px]"
                data-cursor="open"
              >
                <Github size={15} />
                <span>View Source</span>
              </a>
            )}
          </div>
          <p className="text-eyebrow text-muted hidden md:block">{project.accentNote}</p>
        </div>

      </motion.div>
    </motion.div>
  )
}
