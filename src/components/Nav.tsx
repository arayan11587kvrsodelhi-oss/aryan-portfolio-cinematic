import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight, FileText } from 'lucide-react'
import SoundToggle from './SoundToggle'
import { useSFX } from '../hooks/useSFX'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#services' },
  { label: 'Toolkit', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

interface NavProps {
  onOpenResume?: () => void
}

export default function Nav({ onOpenResume }: NavProps) {
  const { playSFX } = useSFX()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)

      // Section intersection detection with viewport-relative scoring
      const sections = ['top', 'work', 'about', 'services', 'skills', 'experience', 'contact']
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        playSFX('mobileMenu')
        setOpen(false)
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
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/80 py-3.5 shadow-2xl shadow-black/40'
            : 'bg-transparent py-5 md:py-6'
        }`}
      >
        <nav
          className="max-w-container mx-auto flex items-center justify-between px-6 md:px-10"
          aria-label="Main navigation"
        >
          {/* Logo / Brand */}
          <a
            href="#top"
            onClick={() => playSFX('nav')}
            onMouseEnter={() => playSFX('hover')}
            className="font-display text-sm md:text-base tracking-widest font-semibold flex items-center gap-2.5 group"
            data-cursor="default"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_var(--accent)]" />
            <span className="text-foreground tracking-[0.14em]">
              ARYAN <span className="text-accent font-medium">SHARMA</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-7 text-eyebrow bg-surface/50 border border-border/70 backdrop-blur-md px-6 py-2 rounded-full shadow-inner shadow-white/[0.02]">
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

          {/* Desktop Action CTAs & SoundToggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* SFX Audio Control Toggle */}
            <SoundToggle />

            {onOpenResume && (
              <button
                onClick={() => {
                  playSFX('modalOpen')
                  onOpenResume()
                }}
                onMouseEnter={() => playSFX('hover')}
                data-cursor="open"
                className="text-eyebrow text-xs border border-border bg-surface/60 hover:border-accent/60 hover:text-accent px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 min-h-[38px]"
              >
                <FileText size={13} className="text-accent" />
                <span>Resume</span>
              </button>
            )}

            <a
              href="#contact"
              onClick={() => playSFX('click')}
              onMouseEnter={() => playSFX('hover')}
              data-cursor="open"
              className="text-eyebrow text-xs border border-accent/50 bg-accent/10 text-accent hover:bg-accent hover:text-background px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5 shadow-[0_0_15px_rgba(53,224,224,0.15)] min-h-[38px]"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Mobile Right Bar: SoundToggle + Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <SoundToggle showLabel={false} />
            <button
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
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 flex flex-col justify-between px-8 py-24 lg:hidden"
            id="mobile-navigation"
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <span className="text-eyebrow text-accent">NAVIGATION</span>
                <SoundToggle />
              </div>
              <div className="flex flex-col gap-4">
                {LINKS.map((l, idx) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 + 0.1, duration: 0.3 }}
                    onClick={() => {
                      playSFX('nav')
                      setOpen(false)
                    }}
                    aria-current={activeSection === l.href.substring(1) ? 'page' : undefined}
                    className={`font-display text-3xl sm:text-4xl transition-colors flex items-center justify-between min-h-[44px] ${
                      activeSection === l.href.substring(1)
                        ? 'text-accent font-medium'
                        : 'text-foreground hover:text-accent'
                    }`}
                  >
                    <span>{l.label}</span>
                    <span className="text-xs font-mono text-muted">0{idx + 1}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                {onOpenResume && (
                  <button
                    onClick={() => {
                      playSFX('modalOpen')
                      setOpen(false)
                      onOpenResume()
                    }}
                    className="flex-1 text-eyebrow border border-border bg-surface text-foreground hover:border-accent py-3 px-4 rounded-full text-center text-xs flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <FileText size={14} className="text-accent" />
                    <span>View Resume</span>
                  </button>
                )}
                <a
                  href="#contact"
                  onClick={() => {
                    playSFX('click')
                    setOpen(false)
                  }}
                  className="flex-1 text-eyebrow bg-accent text-background font-medium py-3 px-4 rounded-full text-center text-xs flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(53,224,224,0.3)] min-h-[44px]"
                >
                  <span>Contact Me</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>

              <div className="text-xs text-muted flex items-center justify-between pt-2">
                <span>Aryan Sharma · New Delhi</span>
                <a
                  href="mailto:arayan11587kvrsodelhi@gmail.com"
                  className="text-accent hover:underline"
                >
                  arayan11587kvrsodelhi@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
