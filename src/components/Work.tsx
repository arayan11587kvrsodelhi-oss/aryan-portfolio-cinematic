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
  Layers,
  Sparkles,
  LayoutGrid,
  Film,
  Code2
} from 'lucide-react'
import { projects, Project } from '../data/projects'
import { useSFX } from '../hooks/useSFX'

gsap.registerPlugin(ScrollTrigger)

const AUTOPLAY_MS = 8000
const EASE = [0.16, 1, 0.3, 1] as const

type ViewMode = 'carousel' | 'grid'
type FilterCategory = 'ALL' | 'FLAGSHIP' | 'FINTECH' | 'CREATIVE' | 'SECURITY' | 'TOOLS'

export default function Work() {
  const { playSFX } = useSFX()
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const inViewRef = useRef(false)
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const modalCloseRef = useRef<HTMLButtonElement>(null)
  const modalTriggerRef = useRef<HTMLButtonElement>(null)

  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('carousel')
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL')
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null)

  // Filtered project lists
  const carouselProjects = projects.filter((p) => p.featured)
  const total = carouselProjects.length
  const active = carouselProjects[index] || carouselProjects[0]

  const filteredGridProjects = projects.filter((p) => {
    if (activeFilter === 'FLAGSHIP') return p.featured && (p.title === 'VELORA' || p.title === 'AMBER HOUR')
    if (activeFilter === 'FINTECH') return p.category.toLowerCase().includes('fintech')
    if (activeFilter === 'CREATIVE') return p.category.toLowerCase().includes('creative') || p.category.toLowerCase().includes('automotive')
    if (activeFilter === 'SECURITY') return p.category.toLowerCase().includes('security')
    if (activeFilter === 'TOOLS') return p.category.toLowerCase().includes('tool') || p.category.toLowerCase().includes('landing')
    return true
  })

  const goTo = (i: number, direction: number) => {
    playSFX('nav')
    setDir(direction)
    setIndex(((i % total) + total) % total)
  }
  const next = () => {
    playSFX('click')
    goTo(index + 1, 1)
  }
  const prev = () => {
    playSFX('click')
    goTo(index - 1, -1)
  }

  // Section entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.work-heading',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
        }
      )
      gsap.fromTo(
        '.work-stage-wrap',
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
        }
      )
      gsap.fromTo(
        '.work-thumb',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.work-thumbs', start: 'top 92%' },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  // Reduced motion preference
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPaused(true)
    }
  }, [])

  // Keyboard navigation & modal focus trapping
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting
    }, { threshold: 0.25 })
    io.observe(el)

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModalProject) {
        playSFX('modalClose')
        setActiveModalProject(null)
        modalTriggerRef.current?.focus()
        return
      }
      if (!inViewRef.current || activeModalProject || viewMode !== 'carousel') return
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [index, activeModalProject, viewMode, playSFX])

  // Body scroll lock on modal open
  useEffect(() => {
    if (!activeModalProject) return
    document.body.style.overflow = 'hidden'
    modalCloseRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModalProject])

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
    const rotateX = ((y - centerY) / centerY) * -3.5
    const rotateY = ((x - centerX) / centerX) * 3.5

    gsap.to(el, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000,
      overwrite: 'auto',
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
      overwrite: 'auto',
    })
  }

  return (
    <section id="work" ref={rootRef} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        {/* Section Heading & View Switcher */}
        <div className="work-heading flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-12">
          <div>
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <Sparkles size={13} />
              <span>FEATURED WORK / 02</span>
            </span>
            <h2 className="font-display text-display mt-2">Selected Projects.</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 rounded-full border border-border bg-surface/80 backdrop-blur">
              <button
                onClick={() => {
                  playSFX('click')
                  setViewMode('carousel')
                }}
                onMouseEnter={() => playSFX('hover')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display transition-all ${
                  viewMode === 'carousel'
                    ? 'bg-accent text-background font-semibold shadow-[0_0_12px_rgba(53,224,224,0.3)]'
                    : 'text-muted hover:text-foreground'
                }`}
                aria-label="Cinematic stage view"
              >
                <Film size={14} />
                <span>Cinematic Stage</span>
              </button>
              <button
                onClick={() => {
                  playSFX('click')
                  setViewMode('grid')
                }}
                onMouseEnter={() => playSFX('hover')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display transition-all ${
                  viewMode === 'grid'
                    ? 'bg-accent text-background font-semibold shadow-[0_0_12px_rgba(53,224,224,0.3)]'
                    : 'text-muted hover:text-foreground'
                }`}
                aria-label="Grid catalog view"
              >
                <LayoutGrid size={14} />
                <span>All Projects ({projects.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Mode 1: Cinematic Carousel Stage */}
        {viewMode === 'carousel' && (
          <div className="work-stage-wrap">
            <div
              ref={stageRef}
              className="work-stage relative w-full overflow-hidden border border-border bg-surface rounded-md"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={(e) => {
                touchStartPos.current = {
                  x: e.touches[0].clientX,
                  y: e.touches[0].clientY,
                }
              }}
              onTouchEnd={(e) => {
                if (!touchStartPos.current) return
                const dx = e.changedTouches[0].clientX - touchStartPos.current.x
                const dy = e.changedTouches[0].clientY - touchStartPos.current.y
                if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                  dx < 0 ? next() : prev()
                }
                touchStartPos.current = null
              }}
            >
              {/* Top Progress Tab Rail */}
              <div className="absolute top-0 left-0 right-0 z-30 flex gap-1.5 md:gap-2.5 p-3 sm:p-4 md:p-6 bg-gradient-to-b from-background/95 via-background/60 to-transparent backdrop-blur-[3px]">
                {carouselProjects.map((p, i) => (
                  <button
                    key={p.number}
                    onClick={() => goTo(i, i > index ? 1 : -1)}
                    onMouseEnter={() => playSFX('hover')}
                    className="work-tab group"
                    aria-label={`Go to project ${p.number}: ${p.title}`}
                    data-cursor="open"
                  >
                    <span className="work-tab-track">
                      {i === index && (
                        <span
                          key={`fill-${index}`}
                          className="work-tab-fill"
                          style={{
                            animationDuration: `${AUTOPLAY_MS}ms`,
                            animationPlayState: paused ? 'paused' : 'running',
                          }}
                          onAnimationEnd={() => !paused && next()}
                        />
                      )}
                      {i < index && <span className="work-tab-fill work-tab-fill--done" />}
                    </span>
                    <div className="flex items-center justify-between">
                      <span className={`work-tab-label ${i === index ? 'text-accent font-medium' : ''}`}>
                        {p.number} · {p.title}
                      </span>
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => {
                    playSFX('click')
                    setPaused((v) => !v)
                  }}
                  onMouseEnter={() => playSFX('hover')}
                  className="work-pause"
                  aria-label={paused ? 'Play autoplay' : 'Pause autoplay'}
                  data-cursor="open"
                >
                  {paused ? <Play size={13} /> : <Pause size={13} />}
                </button>
              </div>

              {/* Showcase Image with 3D Parallax Tilt */}
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => playSFX('projectHover')}
                className="absolute inset-0 transition-transform duration-300 ease-out"
              >
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={active.number}
                    className="absolute inset-0"
                    custom={dir}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    <img
                      src={active.image}
                      alt={`${active.title} project showcase`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                      data-cursor="view"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/25" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Content Overlay */}
              <div className="relative z-20 flex flex-col justify-end h-full p-6 sm:p-8 md:p-12 pointer-events-none">
                <AnimatePresence mode="wait" custom={dir}>
                  <motion.div
                    key={active.number}
                    custom={dir}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
                    className="grid md:grid-cols-12 gap-6 items-end pointer-events-auto"
                  >
                    <div className="md:col-span-8 lg:col-span-8">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-eyebrow text-accent border border-accent/40 bg-background/80 backdrop-blur px-3 py-1 rounded">
                          {active.category}
                        </span>
                        {active.badge && (
                          <span className="text-eyebrow text-white border border-border bg-surface/80 backdrop-blur px-3 py-1 rounded">
                            {active.badge}
                          </span>
                        )}
                        <span className="text-eyebrow text-muted-light bg-surface/60 backdrop-blur border border-border px-3 py-1 rounded hidden sm:inline">
                          {active.accentNote}
                        </span>
                      </div>

                      <p className="text-eyebrow text-white/50 mb-1 font-mono">CASE STUDY {active.number}</p>
                      <h3 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.0] tracking-tight text-white">
                        {active.title}
                      </h3>

                      <p className="text-accent text-sm md:text-base font-display mt-1">
                        {active.tagline}
                      </p>

                      {/* Problem Solved Summary */}
                      <p className="mt-3 text-muted text-sm md:text-base leading-relaxed max-w-2xl line-clamp-2 md:line-clamp-3">
                        {active.description}
                      </p>

                      {/* Tech Stack Chips */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        {active.tech.map((t) => (
                          <span
                            key={t}
                            className="text-eyebrow text-[0.65rem] border border-border/80 bg-background/70 backdrop-blur text-white/90 px-2.5 py-1 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions & Deep Dive */}
                    <div className="md:col-span-4 lg:col-span-4 flex flex-wrap md:flex-col items-start md:items-end justify-between md:justify-end gap-3.5">
                      <button
                        ref={modalTriggerRef}
                        onClick={() => {
                          playSFX('projectOpen')
                          setActiveModalProject(active)
                        }}
                        onMouseEnter={() => playSFX('hover')}
                        data-magnetic
                        data-cursor="view"
                        data-cursor-text="CASE STUDY"
                        className="inline-flex items-center gap-2 bg-accent/20 border border-accent text-accent hover:bg-accent hover:text-background transition-all px-5 py-3 rounded-full text-xs md:text-sm font-display font-medium shadow-[0_0_20px_rgba(53,224,224,0.25)] min-h-[44px]"
                      >
                        <Maximize2 size={15} />
                        <span>Explore Full Case Study</span>
                      </button>

                      <div className="flex items-center gap-4 text-xs sm:text-sm pt-1">
                        {active.demoUrl && (
                          <a
                            href={active.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSFX('click')}
                            onMouseEnter={() => playSFX('hover')}
                            data-magnetic
                            data-cursor="open"
                            data-cursor-text="LIVE"
                            className="inline-flex items-center gap-1.5 text-accent hover:text-white transition-colors font-medium min-h-[44px] px-1"
                          >
                            <span>Live Demo</span>
                            <ArrowUpRight size={14} />
                          </a>
                        )}
                        {active.githubUrl && (
                          <a
                            href={active.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => playSFX('click')}
                            onMouseEnter={() => playSFX('hover')}
                            data-magnetic
                            data-cursor="open"
                            data-cursor-text="GITHUB"
                            className="inline-flex items-center gap-1.5 text-muted hover:text-foreground transition-colors font-medium min-h-[44px] px-1"
                          >
                            <Github size={14} />
                            <span>Source Code</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Nav Arrows */}
              <button
                onClick={prev}
                onMouseEnter={() => playSFX('hover')}
                className="work-arrow work-arrow--left"
                aria-label="Previous project"
                data-magnetic
                data-cursor="open"
                data-cursor-text="PREV"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={next}
                onMouseEnter={() => playSFX('hover')}
                className="work-arrow work-arrow--right"
                aria-label="Next project"
                data-magnetic
                data-cursor="open"
                data-cursor-text="NEXT"
              >
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Thumbnail Rail */}
            <div className="work-thumbs mt-5 flex gap-3 overflow-x-auto pb-2">
              {carouselProjects.map((p, i) => (
                <button
                  key={p.number}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  onMouseEnter={() => playSFX('hover')}
                  className={`work-thumb ${i === index ? 'is-active' : ''}`}
                  data-cursor="view"
                  aria-label={`View ${p.title}`}
                >
                  <img src={p.image} alt={p.title} loading="lazy" decoding="async" />
                  <span className="work-thumb-label">
                    {p.number} — {p.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View Mode 2: Full Catalog Grid View */}
        {viewMode === 'grid' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {(['ALL', 'FLAGSHIP', 'FINTECH', 'CREATIVE', 'SECURITY', 'TOOLS'] as FilterCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    playSFX('click')
                    setActiveFilter(cat)
                  }}
                  onMouseEnter={() => playSFX('hover')}
                  className={`text-eyebrow text-xs px-4 py-2.5 rounded-full border transition-all min-h-[44px] ${
                    activeFilter === cat
                      ? 'border-accent bg-accent text-background font-semibold shadow-[0_0_12px_rgba(53,224,224,0.3)]'
                      : 'border-border bg-surface/70 text-muted hover:border-accent/40 hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Projects */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGridProjects.map((p) => (
                <div
                  key={p.number}
                  className="bg-surface border border-border hover:border-accent/50 rounded-md overflow-hidden flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/20"
                >
                  <div>
                    {/* Project Image */}
                    <div
                      className="relative h-48 sm:h-52 overflow-hidden cursor-pointer"
                      onClick={() => {
                        playSFX('projectOpen')
                        setActiveModalProject(p)
                      }}
                      onMouseEnter={() => playSFX('projectHover')}
                      data-cursor="view"
                    >
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-eyebrow text-accent border border-accent/30 bg-background/80 backdrop-blur px-2.5 py-1 rounded text-[0.62rem]">
                          {p.category}
                        </span>
                        <span className="text-eyebrow text-muted bg-background/80 backdrop-blur px-2 py-0.5 rounded text-[0.62rem] font-mono">
                          {p.number}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3
                        onClick={() => {
                          playSFX('projectOpen')
                          setActiveModalProject(p)
                        }}
                        className="font-display text-xl font-medium text-white hover:text-accent transition-colors cursor-pointer"
                      >
                        {p.title}
                      </h3>
                      <p className="text-muted text-xs leading-relaxed mt-2 line-clamp-2">
                        {p.description}
                      </p>

                      {/* Tech Chips */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {p.tech.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[0.62rem] font-mono text-muted border border-border/80 bg-background/60 px-2 py-0.5 rounded"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-5 pt-0 border-t border-border/40 flex items-center justify-between gap-3 text-xs mt-3">
                    <button
                      onClick={() => {
                        playSFX('projectOpen')
                        setActiveModalProject(p)
                      }}
                      onMouseEnter={() => playSFX('hover')}
                      className="text-accent hover:underline font-display flex items-center gap-1 min-h-[44px]"
                    >
                      <span>Deep Dive</span>
                      <Maximize2 size={12} />
                    </button>

                    <div className="flex items-center gap-3">
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSFX('click')}
                          onMouseEnter={() => playSFX('hover')}
                          className="text-muted hover:text-white transition-colors p-2"
                          aria-label={`Open demo for ${p.title}`}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {p.githubUrl && (
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => playSFX('click')}
                          onMouseEnter={() => playSFX('hover')}
                          className="text-muted hover:text-white transition-colors p-2"
                          aria-label={`View GitHub repository for ${p.title}`}
                        >
                          <Github size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Case Study Deep-Dive Modal with Sticky Header on Mobile */}
      <AnimatePresence>
        {activeModalProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-background/92 backdrop-blur-md overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            onClick={() => {
              playSFX('modalClose')
              setActiveModalProject(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl overflow-hidden rounded-md my-auto max-h-[94vh] flex flex-col text-foreground"
            >
              {/* Sticky Modal Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-4 sm:p-5 md:p-6 border-b border-border bg-background/95 backdrop-blur-md">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="text-eyebrow text-accent border border-accent/30 bg-accent/5 px-2.5 py-1 rounded">
                    PROJECT {activeModalProject.number}
                  </span>
                  <span className="text-eyebrow text-muted hidden sm:inline font-mono">
                    {activeModalProject.category}
                  </span>
                  {activeModalProject.badge && (
                    <span className="text-eyebrow text-white border border-border bg-surface px-2 py-0.5 rounded text-[0.62rem]">
                      {activeModalProject.badge}
                    </span>
                  )}
                </div>
                <button
                  ref={modalCloseRef}
                  onClick={() => {
                    playSFX('modalClose')
                    setActiveModalProject(null)
                  }}
                  onMouseEnter={() => playSFX('hover')}
                  className="p-2 text-muted hover:text-foreground hover:bg-white/10 rounded-full transition-colors min-h-[44px] min-width-[44px] flex items-center justify-center"
                  aria-label="Close case study dialog"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-8 md:p-10 overflow-y-auto space-y-8">
                {/* Hero Title & Image Showcase */}
                <div className="grid md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <span className="text-accent text-sm font-display">{activeModalProject.tagline}</span>
                    <h2
                      id="case-study-title"
                      className="font-display text-2xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white mt-1"
                    >
                      {activeModalProject.title}
                    </h2>
                    <p className="text-muted mt-3 text-sm md:text-base leading-relaxed">
                      {activeModalProject.description}
                    </p>
                  </div>
                  <div className="md:col-span-5 h-48 md:h-60 rounded-md border border-border overflow-hidden relative shadow-lg">
                    <img
                      src={activeModalProject.image}
                      alt={activeModalProject.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                </div>

                {/* Case Study Details Grid */}
                <div className="grid md:grid-cols-2 gap-6 border-t border-border/60 pt-6">
                  {/* Problem Solved */}
                  <div className="bg-background/50 border border-border p-5 rounded-md">
                    <div className="flex items-center gap-2 text-accent font-display text-base font-medium mb-3">
                      <AlertCircle size={18} />
                      <span>The Challenge &amp; Problem Solved</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      {activeModalProject.problemSolved}
                    </p>
                  </div>

                  {/* My Contribution */}
                  <div className="bg-background/50 border border-border p-5 rounded-md">
                    <div className="flex items-center gap-2 text-accent font-display text-base font-medium mb-3">
                      <UserCheck size={18} />
                      <span>My Engineering Contribution</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">
                      {activeModalProject.myContribution}
                    </p>
                  </div>
                </div>

                {/* Key Features Breakdown */}
                <div className="border-t border-border/60 pt-6">
                  <div className="flex items-center gap-2 font-display text-lg mb-4 text-accent font-medium">
                    <CheckCircle2 size={18} />
                    <span>Key Features &amp; Capabilities</span>
                  </div>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {activeModalProject.keyFeatures.map((feat, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-muted bg-background/40 p-3.5 border border-border/60 rounded"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span className="leading-relaxed">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Architecture Highlights if available */}
                {activeModalProject.architectureDetails && (
                  <div className="border-t border-border/60 pt-6">
                    <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
                      <Code2 size={17} className="text-accent" />
                      <span>Architecture &amp; Implementation Details</span>
                    </div>
                    <ul className="space-y-2">
                      {activeModalProject.architectureDetails.map((arch, idx) => (
                        <li
                          key={idx}
                          className="text-xs sm:text-sm text-muted bg-background/30 px-3.5 py-2.5 border border-border/40 rounded flex items-center gap-2"
                        >
                          <span className="text-accent font-mono text-xs">▸</span>
                          <span>{arch}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="border-t border-border/60 pt-6">
                  <div className="flex items-center gap-2 font-display text-base mb-3 text-white font-medium">
                    <Layers size={16} className="text-accent" />
                    <span>Technology Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeModalProject.tech.map((t) => (
                      <span
                        key={t}
                        className="text-eyebrow text-xs border border-accent/30 bg-accent/5 text-accent px-3 py-1.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky Modal Footer Links */}
              <div className="sticky bottom-0 z-20 p-4 sm:p-5 md:p-6 border-t border-border bg-background/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeModalProject.demoUrl && (
                    <a
                      href={activeModalProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSFX('click')}
                      onMouseEnter={() => playSFX('hover')}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-background font-display text-xs md:text-sm font-semibold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(53,224,224,0.35)] min-h-[44px]"
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
                      onClick={() => playSFX('click')}
                      onMouseEnter={() => playSFX('hover')}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-border bg-surface text-foreground hover:border-accent hover:text-accent font-display text-xs md:text-sm rounded-full transition-all min-h-[44px]"
                    >
                      <Github size={15} />
                      <span>View Code</span>
                    </a>
                  )}
                </div>

                <button
                  onClick={() => {
                    playSFX('modalClose')
                    setActiveModalProject(null)
                  }}
                  onMouseEnter={() => playSFX('hover')}
                  className="text-eyebrow text-muted hover:text-white transition-colors text-xs p-2 min-h-[44px]"
                >
                  ESC OR CLICK OUTSIDE TO CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
