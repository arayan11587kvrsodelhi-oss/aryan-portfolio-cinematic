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
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) node.classList.add('is-visible') }, { threshold: .2 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <section id="achievements" ref={ref} className="achievement-feature px-4 sm:px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
    <div className="max-w-container mx-auto grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
      <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} className="lg:col-span-7">
        <span className="text-eyebrow text-accent flex items-center gap-2"><Award size={13} /> ACHIEVEMENT</span>
        <p className="font-display text-6xl sm:text-8xl md:text-9xl text-white/15 leading-none mt-4">TOP 5</p>
        <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-medium leading-none text-white">{achievement.title}</h2>
        <p className="text-accent text-sm md:text-base mt-4">{achievement.organization}</p>
        <p className="text-muted max-w-xl mt-5 text-base md:text-lg leading-relaxed">{achievement.description}</p>
        <button type="button" onClick={() => { document.querySelector('#certifications')?.scrollIntoView({ behavior: 'smooth' }); window.dispatchEvent(new CustomEvent('certifications:open', { detail: 0 })) }} onMouseEnter={() => playSFX('hover')} data-cursor="view" data-cursor-text="VIEW" data-magnetic className="mt-8 inline-flex items-center gap-2 border-accent text-accent hover:bg-accent hover:text-background transition-colors rounded-full px-5 py-3 text-eyebrow min-h-[44px]">VIEW CERTIFICATE <ArrowUpRight size={14} /></button>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .25 }} className="lg:col-span-5 relative aspect-[4/3] overflow-hidden border-accent/30 bg-surface shadow-[0_0_45px_rgba(53,224,224,.12)]">
        <img src={achievement.certificateImage} alt="EY AI Fundamentals Certificate of Merit" className="w-full h-full object-contain p-5 bg-background" />
        <span className="absolute left-4 bottom-4 text-eyebrow text-white/70">CERTIFICATE OF MERIT · WINNER</span>
      </motion.div>
    </div>
  </section>
}
