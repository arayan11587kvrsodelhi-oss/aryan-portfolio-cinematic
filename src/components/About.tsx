import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Download, MapPin, Code2, ShieldCheck, GraduationCap } from 'lucide-react'
import portrait from '../assets/photos/portrait.jpg'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-image', { scale: 1.2, yPercent: 8 }, { scale: 1, yPercent: -5, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.fromTo('.profile-card', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } })
      gsap.fromTo('.profile-stat', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: .08, duration: .65, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 55%' } })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={ref} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex items-end justify-between mb-12 md:mb-20">
          <div><span className="text-eyebrow text-accent">PROFILE / 01</span><h2 className="font-display text-display mt-4">More than a card.</h2></div>
          <span className="text-eyebrow hidden md:block">ARYAN SHARMA</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
          <div className="lg:col-span-5 relative min-h-[560px] md:min-h-[680px] overflow-hidden bg-surface border border-border" data-cursor="view">
            <img src={portrait} alt="Aryan Sharma" className="about-image absolute inset-0 w-full h-full object-cover object-top will-change-transform" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
            <div className="absolute left-5 top-5 text-eyebrow border border-white/20 bg-black/40 backdrop-blur px-3 py-2">DELHI / INDIA</div>
            <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between">
              <div><p className="font-display text-4xl md:text-5xl">Aryan Sharma</p><p className="text-sm text-white/70 mt-2">BCA Student · Web Developer</p></div>
              <span className="w-12 h-12 rounded-full border border-accent/60 grid place-items-center text-accent"><ArrowUpRight size={18}/></span>
            </div>
          </div>

          <div className="lg:col-span-7 profile-card flex flex-col justify-between border border-border bg-surface p-6 md:p-10">
            <div>
              <div className="flex flex-wrap gap-2 mb-8">
                {['WEB', 'CREATIVE', 'SECURITY'].map(tag => <span key={tag} className="text-eyebrow border border-accent/30 text-accent px-3 py-1.5">{tag}</span>)}
              </div>
              <p className="font-display text-statement max-w-3xl">I build interfaces that look considered, move with purpose, and stay grounded in real engineering.</p>
              <p className="text-muted leading-relaxed max-w-2xl mt-8">I'm a BCA student at Trinity Institute of Professional Studies, Delhi. My work sits between frontend development, interactive design and cybersecurity — from responsive websites and authentication flows to cinematic scroll experiments.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-px bg-border mt-12 border border-border">
              <div className="profile-stat bg-surface p-5"><MapPin size={18} className="text-accent mb-5"/><span className="text-eyebrow">BASED IN</span><p className="mt-2 font-display text-xl">New Delhi</p></div>
              <div className="profile-stat bg-surface p-5"><Code2 size={18} className="text-accent mb-5"/><span className="text-eyebrow">FOCUS</span><p className="mt-2 font-display text-xl">Web + UI</p></div>
              <div className="profile-stat bg-surface p-5"><ShieldCheck size={18} className="text-accent mb-5"/><span className="text-eyebrow">INTEREST</span><p className="mt-2 font-display text-xl">Security</p></div>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 pt-8 mt-8 border-t border-border">
              <div><div className="flex items-center gap-2 text-accent"><GraduationCap size={16}/><span className="text-eyebrow">EDUCATION</span></div><p className="mt-3 font-display text-xl">Bachelor of Computer Applications</p><p className="text-muted text-sm mt-1">Trinity Institute of Professional Studies, Delhi</p></div>
              <div className="flex sm:justify-end items-start"><a href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Resume%20Request" className="inline-flex items-center gap-2 text-eyebrow border border-border px-4 py-3 hover:border-accent hover:text-accent transition-colors" data-cursor="open"><Download size={14}/> Request Resume</a></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
