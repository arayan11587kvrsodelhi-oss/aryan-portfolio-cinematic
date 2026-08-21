import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Printer,
  Mail,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Code2,
  Shield,
  MapPin,
  ExternalLink
} from 'lucide-react'
import { useSFX } from '../hooks/useSFX'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const { playSFX } = useSFX()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSFX('modalClose')
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose, playSFX])

  const handlePrint = () => {
    playSFX('click')
    window.print()
  }

  const handleClose = () => {
    playSFX('modalClose')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 md:p-8 bg-background/92 backdrop-blur-md overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-title"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-surface border border-border shadow-2xl rounded-md my-auto max-h-[94vh] flex flex-col overflow-hidden text-foreground print:max-h-none print:shadow-none print:border-none"
          >
            {/* Sticky Header Bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border bg-background/95 backdrop-blur-md print:hidden">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-eyebrow text-accent border border-accent/40 bg-accent/5 px-2.5 py-1 rounded text-[0.62rem] sm:text-xs">
                  OFFICIAL RESUME · ARYAN SHARMA
                </span>
                <span className="text-eyebrow text-muted hidden md:inline font-mono">BCA · TIPS DELHI</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  onMouseEnter={() => playSFX('hover')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs font-display text-muted hover:text-foreground hover:border-accent transition-colors min-h-[38px]"
                  aria-label="Print or save as PDF"
                >
                  <Printer size={13} />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
                <a
                  href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Resume%20Request%20-%20Aryan%20Sharma"
                  onClick={() => playSFX('click')}
                  onMouseEnter={() => playSFX('hover')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/15 border border-accent text-xs font-display text-accent hover:bg-accent hover:text-background transition-colors min-h-[38px]"
                >
                  <Mail size={13} />
                  <span className="hidden sm:inline">Email Copy</span>
                </a>
                <button
                  ref={closeButtonRef}
                  onClick={handleClose}
                  onMouseEnter={() => playSFX('hover')}
                  className="p-2 text-muted hover:text-foreground hover:bg-white/10 rounded-full transition-colors ml-1 min-h-[40px] min-w-[40px] flex items-center justify-center"
                  aria-label="Close resume preview"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Resume Document Content */}
            <div className="p-5 sm:p-8 md:p-10 overflow-y-auto space-y-8 print:p-0">
              {/* Header Title Section */}
              <div className="border-b border-border/80 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 id="resume-title" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                    Aryan Sharma
                  </h1>
                  <p className="text-accent text-base sm:text-lg font-medium mt-1">
                    Creative Frontend Developer &amp; BCA Student
                  </p>
                  <p className="text-muted text-xs sm:text-sm flex flex-wrap items-center gap-2 mt-1">
                    <span className="flex items-center gap-1"><MapPin size={13} className="text-accent" /> New Delhi, India</span>
                    <span>·</span>
                    <span>Open to Developer Roles &amp; High-Impact Projects</span>
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-xs text-muted font-mono">
                  <a href="mailto:arayan11587kvrsodelhi@gmail.com" onClick={() => playSFX('click')} className="hover:text-accent transition-colors">
                    arayan11587kvrsodelhi@gmail.com
                  </a>
                  <a href="https://github.com/arayan11587kvrsodelhi-oss/" target="_blank" rel="noreferrer" onClick={() => playSFX('click')} className="hover:text-accent transition-colors flex items-center gap-1">
                    <span>github.com/arayan11587kvrsodelhi-oss</span>
                    <ExternalLink size={10} />
                  </a>
                  <a href="https://www.linkedin.com/in/aryan-sharma-7681a3380/" target="_blank" rel="noreferrer" onClick={() => playSFX('click')} className="hover:text-accent transition-colors flex items-center gap-1">
                    <span>linkedin.com/in/aryan-sharma</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              {/* Education */}
              <section aria-labelledby="resume-edu">
                <div className="flex items-center gap-2 text-accent font-display text-base font-semibold mb-3 border-b border-border/40 pb-1">
                  <GraduationCap size={18} />
                  <h2 id="resume-edu" className="text-sm font-semibold tracking-wider uppercase text-accent">Education</h2>
                </div>
                <div className="bg-background/40 border border-border/60 p-4 rounded-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-display font-medium text-base text-white">
                      Bachelor of Computer Applications (BCA)
                    </h3>
                    <span className="text-xs text-accent font-mono">2025 — Present</span>
                  </div>
                  <p className="text-sm text-muted mt-0.5">
                    Trinity Institute of Professional Studies · Guru Gobind Singh Indraprastha University (GGSIPU), Delhi
                  </p>
                  <p className="text-xs text-muted/90 mt-2 leading-relaxed">
                    Focus Areas: Data Structures, Web Application Engineering, Database Management Systems, Object-Oriented Programming, and Computer Networks.
                  </p>
                </div>
              </section>

              {/* Technical Skills */}
              <section aria-labelledby="resume-skills">
                <div className="flex items-center gap-2 text-accent font-display text-base font-semibold mb-3 border-b border-border/40 pb-1">
                  <Code2 size={18} />
                  <h2 id="resume-skills" className="text-sm font-semibold tracking-wider uppercase text-accent">Technical Skills &amp; Stack</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-background/40 border border-border/60 p-3.5 rounded-md">
                    <span className="text-white font-medium block mb-1.5">Frontend &amp; UI Engineering</span>
                    <p className="text-muted leading-relaxed">
                      React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Responsive Design, Design Systems
                    </p>
                  </div>
                  <div className="bg-background/40 border border-border/60 p-3.5 rounded-md">
                    <span className="text-white font-medium block mb-1.5">Motion &amp; Interaction</span>
                    <p className="text-muted leading-relaxed">
                      Framer Motion, GSAP, ScrollTrigger, Lenis Smooth Scroll, SVG Animation, Canvas kinematics
                    </p>
                  </div>
                  <div className="bg-background/40 border border-border/60 p-3.5 rounded-md">
                    <span className="text-white font-medium block mb-1.5">Backend, APIs &amp; Data</span>
                    <p className="text-muted leading-relaxed">
                      Node.js, Express.js, RESTful APIs, MySQL, SQL Architecture, Client-side State Architecture
                    </p>
                  </div>
                  <div className="bg-background/40 border border-border/60 p-3.5 rounded-md">
                    <span className="text-white font-medium block mb-1.5">Tools, Security &amp; Workflow</span>
                    <p className="text-muted leading-relaxed">
                      Git, GitHub, Vite, VS Code, Postman, Figma, Web Application Security, Client Input Sanitization
                    </p>
                  </div>
                </div>
              </section>

              {/* Featured Projects */}
              <section aria-labelledby="resume-projects">
                <div className="flex items-center gap-2 text-accent font-display text-base font-semibold mb-3 border-b border-border/40 pb-1">
                  <Briefcase size={18} />
                  <h2 id="resume-projects" className="text-sm font-semibold tracking-wider uppercase text-accent">Featured Engineering Projects</h2>
                </div>

                <div className="space-y-4 text-xs">
                  {/* VELORA */}
                  <div className="bg-background/40 border border-border/60 p-4 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-medium text-sm text-white">VELORA — Modern Fintech Banking Experience</h3>
                        <span className="text-[0.65rem] border border-accent/40 text-accent px-2 py-0.5 rounded">Flagship</span>
                      </div>
                      <span className="text-muted font-mono">React · TypeScript · Framer Motion · Lenis</span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-muted list-disc list-inside leading-relaxed">
                      <li>Architected interactive financial dashboard with simulated multi-currency transfers, real-time balance updates, and savings vault targets.</li>
                      <li>Implemented card security mechanisms including dynamic freeze controls, virtual card generator, and transaction classification.</li>
                      <li>Engineered custom momentum scroll kinematics and Framer Motion spring physics for 60fps responsive performance.</li>
                    </ul>
                  </div>

                  {/* Amber Hour */}
                  <div className="bg-background/40 border border-border/60 p-4 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-medium text-sm text-white">Amber Hour — Cinematic Coffee Experience</h3>
                        <span className="text-[0.65rem] border border-accent/40 text-accent px-2 py-0.5 rounded">Creative Web</span>
                      </div>
                      <span className="text-muted font-mono">React · TypeScript · CSS · Framer Motion</span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-muted list-disc list-inside leading-relaxed">
                      <li>Designed an interactive digital narrative featuring an interactive draggable roast curve spanning 6 roasting phases.</li>
                      <li>Built a scroll-filling ritual timeline using native IntersectionObserver for smooth hardware-accelerated animations.</li>
                      <li>Engineered responsive layout with zero layout shifts and progressive rendering across mobile and desktop devices.</li>
                    </ul>
                  </div>

                  {/* Portfolio & Security Tools */}
                  <div className="bg-background/40 border border-border/60 p-4 rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-display font-medium text-sm text-white">Auth Client &amp; Web Security Tooling</h3>
                      <span className="text-muted font-mono">HTML5 · CSS3 · JavaScript · Web Security</span>
                    </div>
                    <ul className="mt-2.5 space-y-1 text-muted list-disc list-inside leading-relaxed">
                      <li>Developed accessible authentication client with client-side password strength validation, sanitization, and account recovery views.</li>
                      <li>Conducted self-directed research into common web application vulnerabilities and secure authentication flows.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Approach & Values */}
              <section aria-labelledby="resume-approach">
                <div className="flex items-center gap-2 text-accent font-display text-base font-semibold mb-2 border-b border-border/40 pb-1">
                  <Shield size={18} />
                  <h2 id="resume-approach" className="text-sm font-semibold tracking-wider uppercase text-accent">Engineering Philosophy</h2>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Committed to building digital interfaces that combine clean architecture, visual restraint, intentional motion, and rigorous accessibility standards. Passionate about turning complex systems into elegant, human-centered experiences.
                </p>
              </section>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-20 p-4 sm:p-5 border-t border-border bg-background/95 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-3">
                <a
                  href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Opportunity%20Inquiry%20-%20Aryan%20Sharma"
                  onClick={() => playSFX('click')}
                  onMouseEnter={() => playSFX('hover')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-background font-display text-xs sm:text-sm font-semibold rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(53,224,224,0.3)] min-h-[44px]"
                >
                  <span>Connect with Aryan</span>
                  <ArrowUpRight size={14} />
                </a>
                <button
                  onClick={handlePrint}
                  onMouseEnter={() => playSFX('hover')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-border bg-surface text-foreground hover:border-accent hover:text-accent font-display text-xs sm:text-sm rounded-full transition-colors min-h-[44px]"
                >
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
              </div>

              <button
                onClick={handleClose}
                onMouseEnter={() => playSFX('hover')}
                className="text-eyebrow text-muted hover:text-white transition-colors text-xs p-2 min-h-[44px]"
              >
                ESC TO CLOSE
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
