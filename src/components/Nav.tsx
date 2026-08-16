import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Toolkit', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      // Section intersection detection
      const sections = LINKS.map((l) => l.href.substring(1))
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-background/85 backdrop-blur-md border-b border-border/80 py-4 shadow-lg shadow-black/20' : 'bg-transparent py-6'
        }`}
      >
        <nav className="max-w-container mx-auto flex items-center justify-between px-6 md:px-10" aria-label="Main navigation">
          <a
            href="#top"
            className="font-display text-sm tracking-widest font-semibold flex items-center gap-2 group"
            data-cursor="default"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent group-hover:scale-125 transition-transform" />
            <span>
              ARYAN <span className="text-accent">SHARMA</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 text-eyebrow">
            {LINKS.map((l) => {
              const id = l.href.substring(1)
              const isActive = activeSection === id
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`transition-colors relative py-1 ${
                      isActive ? 'text-accent font-medium' : 'text-muted hover:text-foreground'
                    }`}
                    data-cursor="open"
                  >
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="mailto:arayan11587kvrsodelhi@gmail.com"
              data-cursor="open"
              className="text-eyebrow border border-accent/40 bg-accent/5 text-accent hover:bg-accent hover:text-background px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-1.5"
            >
              <span>Get in Touch</span>
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2 rounded hover:bg-white/10 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col justify-between px-8 py-24 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <span className="text-eyebrow text-accent">NAVIGATION</span>
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-display font-display hover:text-accent transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </div>

            <div className="border-t border-border pt-6 flex flex-col gap-4">
              <span className="text-eyebrow text-muted">DIRECT CONTACT</span>
              <a
                href="mailto:arayan11587kvrsodelhi@gmail.com"
                className="text-accent font-display text-lg flex items-center justify-between"
              >
                <span>arayan11587kvrsodelhi@gmail.com</span>
                <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
