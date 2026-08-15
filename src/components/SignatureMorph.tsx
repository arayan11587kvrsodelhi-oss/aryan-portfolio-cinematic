import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import portrait from '../assets/photos/portrait.jpg'

gsap.registerPlugin(ScrollTrigger)

export default function SignatureMorph() {
  const cloneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.matchMedia('(max-width: 900px)').matches) return
    const start = document.getElementById('hero-portrait')
    const end = document.getElementById('work-morph-target')
    const clone = cloneRef.current
    if (!start || !end || !clone) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: '#top', start: 'top top', endTrigger: '#work', end: 'top 42%', scrub: .7,
        onUpdate: self => {
          const a = start.getBoundingClientRect(), b = end.getBoundingClientRect(), p = self.progress
          gsap.set(clone, {
            x: a.left + (b.left-a.left)*p, y: a.top + (b.top-a.top)*p,
            width: a.width + (b.width-a.width)*p, height: a.height + (b.height-a.height)*p,
            borderRadius: 3*(1-p), opacity: p < .99 ? 1 : 0,
          })
          gsap.set(clone.querySelector('img'), { scale: 1 + p*.16, rotate: p*2.5 })
        },
      })
    })
    return () => ctx.revert()
  }, [])
  return <div ref={cloneRef} className="signature-morph fixed top-0 left-0 z-30 overflow-hidden border border-accent/50 pointer-events-none hidden md:block" style={{ opacity: 0 }}><img src={portrait} alt="" className="w-full h-full object-cover" /></div>
}
