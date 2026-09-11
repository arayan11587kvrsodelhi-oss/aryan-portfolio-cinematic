import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight, FileText, Github, Zap } from 'lucide-react'
import SoundToggle from './SoundToggle'
import { useSFX } from '../hooks/useSFX'
import { GITHUB_PROFILE_URL } from '../data/githubRepos'

const LINKS = [
  { label: 'Projects', href: '#workbench' },
  { label: 'Capabilities', href: '#skills' },
  { label: 'Recognition', href: '#recognition' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

interface NavProps {
  onOpenResume?: () => void
  onOpenRecruiterView?: () => void
}

export default function Nav({ onOpenResume, onOpenRecruiterView }: NavProps) {
  const { playSFX } = useSFX()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [githubHovered, setGithubHovered] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const mobileNavRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)

      const sections = ['top', 'workbench', 'skills', 'recognition', 'about', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight * 0.35

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i]
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          if (scrollPosition >= top) {
            setActiveSection(id === 'top' ? '' : id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (wasOpenRef.current && !open) {
      menuButtonRef.current?.focus()
    }
    wasOpenRef.current = open
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    mobileNavRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        playSFX('mobileMenu')
        setOpen(false)
        return
      }

      if (event.key === 'Tab' && mobileNavRef.current) {
        const focusable = mobileNavRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable.length) {
          event.preventDefault()
          return
        }

        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, playSFX])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-xl border-b border-border/80 py-3 shadow-2xl shadow-black/40'
            : 'bg-transparent py-5 md:py-6'
        }`}
      >
        <nav
          className="max-w-container mx-auto flex items-center justify-between px-4 sm:px-6 md:px-10"
          aria-label="Main navigation"
        >
          {/* Logo / Brand */}
          <a
            href="#top"
            onClick={() => playSFX('nav')}
            onMouseEnter={() => playSFX('hover')}
            className="font-display text-sm md:text-base tracking-widest font-semibold flex items-center gap-2.5 group shrink-0"
            data-magnetic
            data-cursor="open"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_var(--accent)]" />
            <span className="text-foreground tracking-[0.14em]">
              ARYAN <span className="text-accent font-medium">SHARMA</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden xl:flex items-center gap-6 text-eyebrow bg-surface/60 border border-border/70 backdrop-blur-md px-5 py-2 rounded-full shadow-inner shadow-white/[0.02]">
            {LINKS.map((l) => {
              const id = l.href.substring(1)
              const isActive = activeSection === id
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => playSFX('nav')}
                    onMouseEnter={() => playSFX('hover')}
                    className={`transition-colors relative py-1 text-xs tracking-wider ${
                      isActive ? 'text-accent font-medium' : 'text-muted hover:text-foreground'
                    }`}
                    data-magnetic
                    data-cursor="open"
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full shadow-[0_0_8px_var(--accent)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Desktop Action CTAs */}
          <div className="hidden xl:flex items-center gap-2.5">
            {/* Audio Control */}
            <SoundToggle />

            {/* Recruiter Mode Toggle Button */}
            {onOpenRecruiterView && (
              <button
                type="button"
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenRecruiterView()
                }}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                className="text-eyebrow text-xs border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 px-3.5 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 min-h-[40px] shadow-[0_0_12px_rgba(16,185,129,0.15)]"
                title="Open Recruiter 30-Second Dossier"
              >
                <Zap size={13} className="text-emerald-400 animate-pulse" />
                <span>RECRUITER VIEW</span>
              </button>
            )}

            {/* GitHub Button with Subtle Hover Interaction: OPEN GITHUB ↗ */}
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => {
                playSFX('hover')
                setGithubHovered(true)
              }}
              onMouseLeave={() => setGithubHovered(false)}
              className="text-eyebrow text-xs border border-white/20 bg-white/5 hover:bg-white text-white hover:text-black px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 min-h-[40px] font-mono"
            >
              <Github size={13} />
              <span>{githubHovered ? 'OPEN GITHUB ↗' : 'GITHUB'}</span>
            </a>

            {/* Resume Button */}
            {onOpenResume && (
              <button
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenResume()
                }}
                onMouseEnter={() => playSFX('hover')}
                data-magnetic
                data-cursor="open"
                className="text-eyebrow text-xs border border-border bg-surface/60 hover:border-accent/60 hover:text-accent px-3.5 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 min-h-[40px]"
              >
                <FileText size={13} className="text-accent" />
                <span>Resume</span>
              </button>
            )}
          </div>

          {/* Mobile Right Bar */}
          <div className="flex items-center gap-2 xl:hidden">
            {onOpenRecruiterView && (
              <button
                type="button"
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenRecruiterView()
                }}
                className="text-[11px] font-mono border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <Zap size={11} />
                <span>RECRUITER</span>
              </button>
            )}
            <SoundToggle showLabel={false} />
            <button
              type="button"
              ref={menuButtonRef}
              className="text-foreground p-2 rounded border border-border bg-surface/70 hover:border-accent/50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-controls="mobile-navigation"
              aria-expanded={open}
              onClick={() => {
                playSFX('mobileMenu')
                setOpen((v) => !v)
              }}
            >
              {open ? <X size={22} className="text-accent" /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={mobileNavRef}
            tabIndex={-1}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 flex flex-col justify-between px-8 py-20 xl:hidden overflow-y-auto"
            id="mobile-navigation"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-eyebrow text-accent">NAVIGATION</span>
                <SoundToggle />
              </div>

              <div className="flex flex-col gap-3">
                {LINKS.map((l, idx) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => {
                      playSFX('nav')
                      setOpen(false)
                    }}
                    className="font-display text-2xl text-foreground hover:text-accent transition-colors py-1.5 flex items-center justify-between border-b border-white/5"
                  >
                    <span>{l.label}</span>
                    <ArrowUpRight size={18} className="text-white/30" />
                  </motion.a>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 pt-4">
                {onOpenRecruiterView && (
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      onOpenRecruiterView()
                    }}
                    className="w-full py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center justify-center gap-2"
                  >
                    <Zap size={14} />
                    <span>OPEN RECRUITER VIEW</span>
                  </button>
                )}

                <a
                  href={GITHUB_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white text-black font-mono text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Github size={14} />
                  <span>OPEN GITHUB PROFILE ↗</span>
                </a>
              </div>
            </div>

            <div className="pt-8 border-t border-border/60 text-xs font-mono text-muted">
              <div>@arayan11587kvrsodelhi-oss</div>
              <div className="text-white/40 mt-1">Creative Frontend & Defensive Engineering</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
