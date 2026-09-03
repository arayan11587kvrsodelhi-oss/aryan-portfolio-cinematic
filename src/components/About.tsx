import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ArrowUpRight,
  Download,
  MapPin,
  Code2,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  FileText
} from 'lucide-react'
import portrait from '../assets/photos/portrait.jpg'
import { useSFX } from '../hooks/useSFX'

gsap.registerPlugin(ScrollTrigger)

interface AboutProps {
  onOpenResume?: () => void
}

export default function About({ onOpenResume }: AboutProps) {
  const { playSFX } = useSFX()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-image',
        { scale: 1.12, yPercent: 4 },
        {
          scale: 1,
          yPercent: -4,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
        }
      )
      gsap.fromTo(
        '.profile-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      )
      gsap.fromTo(
        '.profile-stat',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 60%' },
        }
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={ref} className="px-4 sm:px-6 md:px-10 py-[var(--spacing-section)] border-t border-border">
      <div className="max-w-container mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10 md:mb-14">
          <div>
            <span className="text-eyebrow text-accent flex items-center gap-2">
              <Sparkles size={13} />
              <span>PROFILE &amp; PHILOSOPHY / 03</span>
            </span>
            <h2 className="font-display text-display mt-2">Engineering &amp; Design.</h2>
          </div>
          <span className="text-eyebrow hidden md:block text-muted font-mono">
            ARYAN SHARMA — NEW DELHI
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
          {/* Portrait Image Specimen with Explicit Dimensions */}
          <div
            className="lg:col-span-5 relative min-h-[480px] sm:min-h-[540px] md:min-h-[620px] overflow-hidden bg-surface border border-border rounded-md group"
            onMouseEnter={() => playSFX('projectHover')}
            data-cursor="view"
          >
            <img
              src={portrait}
              alt="Aryan Sharma portrait"
              width={600}
              height={800}
              loading="lazy"
              decoding="async"
              className="about-image absolute inset-0 w-full h-full object-cover object-top will-change-transform grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-90" />
            
            <div className="absolute left-4 top-4 text-eyebrow border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs text-white rounded">
              DELHI / INDIA
            </div>

            <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between">
              <div>
                <p className="font-display text-3xl sm:text-4xl text-white font-medium">Aryan Sharma</p>
                <p className="text-sm text-accent mt-0.5">BCA Student · Creative Frontend Developer</p>
              </div>
              <span className="w-10 h-10 rounded-full border border-accent/60 bg-background/70 backdrop-blur grid place-items-center text-accent group-hover:bg-accent group-hover:text-background transition-all duration-300 shadow-[0_0_15px_rgba(53,224,224,0.3)]">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </div>

          {/* Profile Statement & Narrative */}
          <div className="lg:col-span-7 profile-card flex flex-col justify-between border border-border bg-surface p-6 sm:p-8 md:p-10 rounded-md">
            <div>
              {/* Pillar Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['FRONTEND ENGINEERING', 'MOTION KINEMATICS', 'WEB SECURITY', 'UI ARCHITECTURE'].map((tag) => (
                  <span
                    key={tag}
                    onMouseEnter={() => playSFX('hover')}
                    className="text-eyebrow border border-accent/30 text-accent bg-accent/5 px-3 py-1.5 text-[0.65rem] rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bold Editorial Manifesto */}
              <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium leading-tight text-white">
                I build digital interfaces that look intentional, move with purpose, and remain grounded in solid engineering.
              </h3>

              {/* Structured Storytelling */}
              <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed mt-6">
                <p>
                  I'm a Bachelor of Computer Applications (BCA) student at <span className="text-foreground font-medium">Trinity Institute of Professional Studies (GGSIPU, Delhi)</span>. My work spans the entire journey from design concept to production deployment — specializing in high-performance React architectures, interactive visual experiences, and client-side security mechanisms.
                </p>
                <p>
                  I believe exceptional web development is not about excessive decoration; it is about seamless typography, responsive layout precision, hardware-accelerated animations, and intuitive ergonomics that respect the user's attention.
                </p>
              </div>
            </div>

            {/* Core Focus Pillars */}
            <div className="grid sm:grid-cols-3 gap-px bg-border/80 my-8 border border-border rounded-md overflow-hidden">
              <div
                onMouseEnter={() => playSFX('hover')}
                className="profile-stat bg-surface p-5 hover:bg-background/60 transition-colors"
              >
                <MapPin size={18} className="text-accent mb-3" />
                <span className="text-eyebrow text-muted text-[0.62rem]">LOCATION</span>
                <p className="mt-1 font-display text-lg text-white font-medium">New Delhi, IN</p>
              </div>
              <div
                onMouseEnter={() => playSFX('hover')}
                className="profile-stat bg-surface p-5 hover:bg-background/60 transition-colors"
              >
                <Code2 size={18} className="text-accent mb-3" />
                <span className="text-eyebrow text-muted text-[0.62rem]">CORE FOCUS</span>
                <p className="mt-1 font-display text-lg text-white font-medium">Creative Frontend</p>
              </div>
              <div
                onMouseEnter={() => playSFX('hover')}
                className="profile-stat bg-surface p-5 hover:bg-background/60 transition-colors"
              >
                <ShieldCheck size={18} className="text-accent mb-3" />
                <span className="text-eyebrow text-muted text-[0.62rem]">RESEARCH</span>
                <p className="mt-1 font-display text-lg text-white font-medium">Web Security</p>
              </div>
            </div>

            {/* Education & Resume Action */}
            <div className="grid sm:grid-cols-12 gap-6 pt-6 border-t border-border/80 items-center">
              <div className="sm:col-span-7">
                <div className="flex items-center gap-2 text-accent">
                  <GraduationCap size={16} />
                  <span className="text-eyebrow text-accent">ACADEMIC FOUNDATION</span>
                </div>
                <p className="mt-1.5 font-display text-lg sm:text-xl text-white font-medium">
                  Bachelor of Computer Applications
                </p>
                <p className="text-muted text-xs sm:text-sm mt-0.5">
                  Trinity Institute of Professional Studies (GGSIPU, Delhi) · 2025–Present
                </p>
              </div>

              <div className="sm:col-span-5 sm:justify-self-end">
                {onOpenResume ? (
                  <button
                    onClick={() => {
                      playSFX('modalOpen')
                      onOpenResume()
                    }}
                    onMouseEnter={() => playSFX('hover')}
                    className="inline-flex items-center gap-2 text-eyebrow border border-accent/50 bg-accent/10 text-accent px-5 py-3 rounded-full hover:bg-accent hover:text-background transition-all duration-300 shadow-[0_0_15px_rgba(53,224,224,0.2)] min-h-[44px]"
                    data-cursor="open"
                  >
                    <FileText size={14} />
                    <span>View Official Resume</span>
                  </button>
                ) : (
                  <a
                    href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Resume%20Request%20-%20Aryan%20Sharma"
                    onClick={() => playSFX('click')}
                    onMouseEnter={() => playSFX('hover')}
                    className="inline-flex items-center gap-2 text-eyebrow border border-accent/50 bg-accent/10 text-accent px-5 py-3 rounded-full hover:bg-accent hover:text-background transition-all duration-300 shadow-[0_0_15px_rgba(53,224,224,0.2)] min-h-[44px]"
                    data-cursor="open"
                  >
                    <Download size={14} />
                    <span>Request Resume</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
