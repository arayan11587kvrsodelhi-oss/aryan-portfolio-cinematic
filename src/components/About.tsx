import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Download, MapPin, Code2, ShieldCheck, GraduationCap, Check } from 'lucide-react'
import portrait from '../assets/photos/portrait.jpg'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-image',
        { scale: 1.15, yPercent: 6 },
        { scale: 1, yPercent: -4, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true } }
      )
      gsap.fromTo(
        '.profile-card',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } }
      )
      gsap.fromTo(
        '.profile-stat',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 58%' } }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  const handleResumeRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <section id="about" ref={ref} className="px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        <div className="flex items-end justify-between mb-10 md:mb-16">
          <div>
            <span className="text-eyebrow text-accent">PROFILE / 01</span>
            <h2 className="font-display text-display mt-3">Engineering &amp; Design.</h2>
          </div>
          <span className="text-eyebrow hidden md:block text-muted">ARYAN SHARMA — NEW DELHI</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
          {/* Portrait Image Specimen */}
          <div
            className="lg:col-span-5 relative min-h-[480px] sm:min-h-[560px] md:min-h-[640px] overflow-hidden bg-surface border border-border rounded-sm group"
            data-cursor="view"
          >
            <img
              src={portrait}
              alt="Aryan Sharma portrait photo"
              loading="lazy"
              decoding="async"
              className="about-image absolute inset-0 w-full h-full object-cover object-top will-change-transform grayscale group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute left-5 top-5 text-eyebrow border border-white/20 bg-black/60 backdrop-blur px-3 py-1.5 text-xs text-white">
              DELHI / INDIA
            </div>
            <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between">
              <div>
                <p className="font-display text-3xl sm:text-4xl md:text-5xl text-white">Aryan Sharma</p>
                <p className="text-sm text-accent mt-1">BCA Student · Web &amp; Creative Developer</p>
              </div>
              <span className="w-11 h-11 rounded-full border border-accent/60 bg-background/60 backdrop-blur grid place-items-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>

          {/* Profile Statement & Breakdown */}
          <div className="lg:col-span-7 profile-card flex flex-col justify-between border border-border bg-surface p-6 sm:p-8 md:p-10 rounded-sm">
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {['WEB DEVELOPMENT', 'CREATIVE FRONTEND', 'CYBERSECURITY'].map((tag) => (
                  <span key={tag} className="text-eyebrow border border-accent/30 text-accent bg-accent/5 px-3 py-1.5 text-[0.65rem]">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-tight">
                I build interfaces that look considered, move with purpose, and stay grounded in real engineering.
              </p>

              <p className="text-muted leading-relaxed text-sm md:text-base max-w-2xl mt-6">
                I'm a BCA student at Trinity Institute of Professional Studies (GGSIPU, Delhi). My focus sits at the intersection of modern frontend engineering, interactive motion design, and web security. From production e-commerce interfaces to security audit toolings and scroll-driven stories, I build web experiences designed to perform seamlessly.
              </p>
            </div>

            {/* Quick Stats / Focus */}
            <div className="grid sm:grid-cols-3 gap-px bg-border/80 mt-8 border border-border rounded-sm overflow-hidden">
              <div className="profile-stat bg-surface p-5 hover:bg-background/50 transition-colors">
                <MapPin size={18} className="text-accent mb-4" />
                <span className="text-eyebrow text-muted">LOCATION</span>
                <p className="mt-1 font-display text-lg">New Delhi, IN</p>
              </div>
              <div className="profile-stat bg-surface p-5 hover:bg-background/50 transition-colors">
                <Code2 size={18} className="text-accent mb-4" />
                <span className="text-eyebrow text-muted">SPECIALTY</span>
                <p className="mt-1 font-display text-lg">Web &amp; UI Dev</p>
              </div>
              <div className="profile-stat bg-surface p-5 hover:bg-background/50 transition-colors">
                <ShieldCheck size={18} className="text-accent mb-4" />
                <span className="text-eyebrow text-muted">INTEREST</span>
                <p className="mt-1 font-display text-lg">Web Security</p>
              </div>
            </div>

            {/* Education & Resume CTA */}
            <div className="grid sm:grid-cols-12 gap-6 pt-8 mt-8 border-t border-border/80 items-center">
              <div className="sm:col-span-7">
                <div className="flex items-center gap-2 text-accent">
                  <GraduationCap size={16} />
                  <span className="text-eyebrow">EDUCATION</span>
                </div>
                <p className="mt-2 font-display text-lg sm:text-xl text-foreground">Bachelor of Computer Applications</p>
                <p className="text-muted text-xs sm:text-sm mt-0.5">Trinity Institute of Professional Studies, Delhi</p>
              </div>

              <div className="sm:col-span-5 sm:justify-self-end">
                <a
                  href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Resume%20Request%20-%20Aryan%20Sharma"
                  onClick={handleResumeRequest}
                  className="inline-flex items-center gap-2 text-eyebrow border border-accent/40 bg-accent/5 text-accent px-5 py-3 rounded-full hover:bg-accent hover:text-background transition-all duration-300"
                  data-cursor="open"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      <span>Request Sent!</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Request Resume</span>
                    </>
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
