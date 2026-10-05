import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Award, ArrowUpRight } from 'lucide-react'
import { achievements } from '../data/achievements'
import { useSFX } from '../hooks/useSFX'

export default function Achievements() {
  const ref = useRef<HTMLElement>(null)
  const { playSFX } = useSFX()
  const achievement = achievements[0]

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) node.classList.add('is-visible')
      },
      { threshold: 0.2 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const handleOpenCertificate = () => {
    playSFX('click')
    const target = document.querySelector('#recognition') || document.querySelector('#certifications')
    target?.scrollIntoView({ behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('certifications:open', { detail: 0 }))
  }

  return (
    <section
      id="achievements"
      ref={ref}
      className="achievement-feature px-4 sm:px-6 md:px-10 py-[var(--spacing-section)] border-t border-border"
    >
      <div className="max-w-container mx-auto grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="lg:col-span-7"
        >
          <span className="text-eyebrow text-accent flex items-center gap-2">
            <Award size={13} /> VERIFIED MERIT RECOGNITION
          </span>
          <p className="font-display text-6xl sm:text-8xl md:text-9xl text-white/15 leading-none mt-4 font-bold select-none">
            TOP 5
          </p>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium leading-none text-white">
            {achievement.title}
          </h2>
          <p className="text-accent text-sm md:text-base mt-4 font-mono">
            {achievement.organization} · {achievement.label}
          </p>
          <p className="text-muted max-w-xl mt-5 text-base md:text-lg leading-relaxed">
            {achievement.description} Selected on performance and applied artificial intelligence coursework,
            evaluated across multi-college participant cohorts.
          </p>
          <button
            type="button"
            onClick={handleOpenCertificate}
            onMouseEnter={() => playSFX('hover')}
            data-cursor="view"
            data-cursor-text="VIEW"
            data-magnetic
            className="mt-8 inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent hover:text-black transition-all rounded-full px-6 py-3.5 text-xs font-mono tracking-wider min-h-[44px]"
          >
            INSPECT MERIT CREDENTIAL <ArrowUpRight size={14} />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden border border-accent/40 bg-surface shadow-[0_0_45px_rgba(53,224,224,0.15)] cursor-pointer group"
          onClick={handleOpenCertificate}
        >
          <img
            src={achievement.certificateImage}
            alt="EY AI Fundamentals Certificate of Merit"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-6 bg-background/80 transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-black/80 text-accent border border-accent/30">
              CLICK TO EXPAND ↗
            </span>
          </div>
          <span className="absolute left-4 bottom-4 text-eyebrow text-accent font-mono bg-black/70 px-2.5 py-1 rounded border border-accent/20">
            CERTIFICATE OF MERIT · WINNER
          </span>
        </motion.div>
      </div>
    </section>
  )
}
