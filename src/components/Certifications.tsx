import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, X } from 'lucide-react'
import { orderedCertifications, Certificate } from '../data/certifications'
import { useSFX } from '../hooks/useSFX'
import { lenisState } from '../lib/useLenis'

gsap.registerPlugin(ScrollTrigger)

const EASE = [0.16, 1, 0.3, 1] as const

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

/* ------------------------------------------------------------------ */
/* Certificate slide — shared by the desktop scroll track and the      */
/* mobile snap slider (cert-slide--mobile modifier).                   */
/* ------------------------------------------------------------------ */
function CertSlide({
  cert,
  index,
  mobile = false,
  onOpen,
}: {
  cert: Certificate
  index: number
  mobile?: boolean
  onOpen: (cert: Certificate) => void
}) {
  return (
    <article
      className={`cert-slide ${mobile ? 'cert-slide--mobile' : ''}`}
      aria-label={`Certificate ${cert.number}: ${cert.title}`}
    >
      <span className="cert-slide-num" aria-hidden="true">
        {cert.number}
      </span>
      <button
        type="button"
        className="cert-slide-media"
        onClick={() => onOpen(cert)}
        data-cursor="view"
        data-cursor-text="VIEW"
        aria-label={`View ${cert.title} certificate`}
      >
        <img
          src={cert.image}
          alt={`${cert.title} certificate`}
          loading={index < 2 ? 'eager' : 'lazy'}
          draggable={false}
        />
      </button>
      <div className="cert-slide-meta">
        <div className="min-w-0">
          <p className="cert-slide-cat">{cert.category}</p>
          <h3 className="cert-slide-title">{cert.title}</h3>
          <p className="cert-slide-issuer">
            {cert.issuer} · {cert.type}
            {cert.date ? ` · ${cert.date}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpen(cert)}
          data-cursor="view"
          data-cursor-text="VIEW"
          className="cert-slide-view"
        >
          VIEW CERTIFICATE
          <ArrowUpRight size={13} />
        </button>
      </div>
    </article>
  )
}

export default function Certifications() {
  const { playSFX } = useSFX()
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLSpanElement>(null)
  const mobileTrackRef = useRef<HTMLDivElement>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [active, setActive] = useState<Certificate | null>(null)
  const total = orderedCertifications.length
  const totalStr = String(total).padStart(2, '0')

  /* Reduced-motion preference */
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  /* Desktop (>= 1024px) — pinned section, vertical scroll drives the
     horizontal certificate track. Mirrors the Projects stage. */
  useEffect(() => {
    if (reduced) return
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const ctx = gsap.context(() => {
        const track = trackRef.current
        const stage = stageRef.current
        if (!track || !stage) return

        const getAmount = () => Math.max(0, track.scrollWidth - stage.clientWidth)

        const tween = gsap.to(track, {
          x: () => -getAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${getAmount()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(total - 1, Math.max(0, Math.round(self.progress * (total - 1))))
              setIndex((prev) => (prev === idx ? prev : idx))
              if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${self.progress})`
              }
            },
          },
        })
        if (tween.scrollTrigger) stRef.current = tween.scrollTrigger

        // Recalculate once all certificate images have finished loading
        const onLoad = () => ScrollTrigger.refresh()
        window.addEventListener('load', onLoad)
        return () => {
          window.removeEventListener('load', onLoad)
          stRef.current = null
        }
      }, stageRef)
      return () => ctx.revert()
    })

    return () => mm.revert()
  }, [reduced, total])

  /* Section heading reveal */
  useEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cert-heading',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
        }
      )
    }, rootRef)
    return () => ctx.revert()
  }, [reduced])

  /* Navigation — desktop routes through Lenis across the pinned range,
     mobile scrolls the snap track to the target panel. */
  const scrollToCert = (i: number) => {
    const clamped = Math.max(0, Math.min(total - 1, i))
    playSFX('nav')
    const st = stRef.current
    if (st && !reduced && window.matchMedia('(min-width: 1024px)').matches) {
      const p = clamped / (total - 1)
      const target = st.start + p * (st.end - st.start)
      const lenis = lenisState.instance
      if (lenis) lenis.scrollTo(target, { duration: 1.15 })
      else window.scrollTo({ top: target, behavior: 'smooth' })
      return
    }
    const el = mobileTrackRef.current?.children[clamped] as HTMLElement | undefined
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', inline: 'center', block: 'nearest' })
  }

  const next = () => scrollToCert(index + 1)
  const prev = () => scrollToCert(index - 1)

  /* Keyboard controls — only while the section is on screen */
  useEffect(() => {
    let inView = false
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting
      },
      { threshold: 0.25 }
    )
    if (rootRef.current) io.observe(rootRef.current)
    const onKey = (event: KeyboardEvent) => {
      if (active || !inView) return
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      io.disconnect()
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, active])

  /* Achievements integration — `certifications:open` opens the lightbox
     directly at the requested certificate. */
  useEffect(() => {
    const onOpenRequest = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail
      const i = typeof detail === 'number' ? ((detail % total) + total) % total : 0
      setIndex(i)
      playSFX('modalOpen')
      setActive(orderedCertifications[i])
    }
    window.addEventListener('certifications:open', onOpenRequest)
    return () => window.removeEventListener('certifications:open', onOpenRequest)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  /* Mobile snap slider — track the active panel while swiping */
  const onMobileScroll = () => {
    const el = mobileTrackRef.current
    if (!el || el.clientWidth === 0) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    const clamped = Math.max(0, Math.min(total - 1, i))
    setIndex((v) => (v === clamped ? v : clamped))
  }

  const desktopStageClass = reduced ? 'hidden' : 'hidden lg:block'
  const mobileStageClass = reduced ? 'block' : 'block lg:hidden'

  return (
    <section id="certifications" ref={rootRef} className="relative border-t border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pt-[var(--spacing-section)]">
        <div className="cert-heading flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <BadgeCheck size={13} />
              <span>RECOGNITION / CERTIFICATES</span>
            </span>
            <h2 className="font-display text-display mt-2 max-w-2xl">Certificates &amp; achievements.</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-eyebrow text-muted font-mono">ALL CERTIFICATES ({totalStr})</span>
          </div>
        </div>
      </div>

      {/* DESKTOP — scroll-driven pinned horizontal track (>= 1024px) */}
      <div ref={stageRef} className={`${desktopStageClass} ${reduced ? 'is-reduced' : ''} cert-stage mt-10`}>
        <div ref={trackRef} className="cert-track">
          {orderedCertifications.map((cert, i) => (
            <CertSlide
              key={cert.id}
              cert={cert}
              index={i}
              onOpen={(c) => {
                playSFX('click')
                setActive(c)
              }}
            />
          ))}
        </div>

        {/* Top chrome: counter + arrows */}
        <div className="work-chrome">
          <div className="work-chrome-status">
            <span className="work-chrome-eyebrow">SCROLL TO EXPLORE</span>
            <div className="work-chrome-count">
              <span className="text-accent font-mono">{pad2(index + 1)}</span>
              <span className="font-mono text-muted"> / {totalStr}</span>
            </div>
          </div>
          <div className="work-chrome-rail">
            <button type="button" onClick={prev} aria-label="Previous certificate" className="work-arrow work-arrow--left" data-cursor="open" data-cursor-text="PREV">
              <ArrowLeft size={18} />
            </button>
            <button type="button" onClick={next} aria-label="Next certificate" className="work-arrow work-arrow--right" data-cursor="open" data-cursor-text="NEXT">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Bottom progress */}
        <div className="work-progress" aria-hidden="true">
          <span ref={progressFillRef} className="work-progress-fill" />
        </div>
      </div>

      {/* MOBILE / reduced-motion — native touch snap slider */}
      <div className={`${mobileStageClass} max-w-container mx-auto px-4 sm:px-6 md:px-10 mt-10 pb-[var(--spacing-section)]`}>
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono text-sm text-white/90 shrink-0">
            {pad2(index + 1)} <span className="text-muted">/ {totalStr}</span>
          </span>
          <div className="cert-rail flex-1">
            <span className="cert-rail-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
          <button type="button" onClick={prev} aria-label="Previous certificate" className="cert-nav-btn" data-cursor="open">
            <ArrowLeft size={16} />
          </button>
          <button type="button" onClick={next} aria-label="Next certificate" className="cert-nav-btn" data-cursor="open">
            <ArrowRight size={16} />
          </button>
        </div>

        <div
          ref={mobileTrackRef}
          className="cert-mobile-track"
          onScroll={onMobileScroll}
          style={{ touchAction: 'pan-x' }}
        >
          {orderedCertifications.map((cert, i) => (
            <div key={cert.id} className="cert-mobile-panel">
              <CertSlide cert={cert} index={i} mobile onOpen={(c) => setActive(c)} />
            </div>
          ))}
        </div>
        <p className="text-eyebrow text-muted text-center mt-4">SWIPE TO BROWSE</p>
      </div>

      {/* Desktop section bottom spacing (mobile container carries its own) */}
      <div className={desktopStageClass + ' pb-[var(--spacing-section)]'} aria-hidden="true" />

      <AnimatePresence>
        {active && <CertificateModal item={active} onClose={() => setActive(null)} reduced={reduced} />}
      </AnimatePresence>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Lightbox — ESC to close, focus management, scroll lock              */
/* ------------------------------------------------------------------ */
function CertificateModal({ item, onClose, reduced }: { item: Certificate; onClose: () => void; reduced: boolean }) {
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
      transition={{ duration: reduced ? 0.01 : 0.25 }}
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl p-4 sm:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Certificate viewer"
      onClick={onClose}
    >
      <div className="min-h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: reduced ? 0.01 : 0.35, ease: EASE }}
          className="relative w-full max-w-5xl bg-surface border border-border p-5 sm:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close certificate viewer"
            className="absolute right-3 top-3 p-3 text-muted hover:text-white min-h-[44px]"
            data-cursor="close"
          >
            <X size={20} />
          </button>
          <div className="pr-12 mb-6">
            <span className="text-eyebrow text-accent">
              {item.category} / {item.number}
            </span>
            <h2 className="font-display text-2xl sm:text-4xl text-white mt-2">{item.title}</h2>
            <p className="text-muted text-sm mt-2">
              {item.issuer} · {item.type}
            </p>
          </div>
          <img
            src={item.image}
            alt={`${item.title} certificate`}
            className="max-h-[72vh] w-full object-contain bg-background"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
