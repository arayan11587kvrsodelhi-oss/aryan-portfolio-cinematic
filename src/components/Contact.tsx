import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  Check,
  Copy,
  MessageSquare,
  Sparkles,
  Briefcase,
  Users,
  Code,
  ArrowUp,
  Clock,
  Send,
  FileText
} from 'lucide-react'
import { useSFX } from '../hooks/useSFX'

interface ContactProps {
  onOpenResume?: () => void
}

const LINKS = [
  { label: 'Email', icon: Mail, href: 'mailto:arayan11587kvrsodelhi@gmail.com', value: 'arayan11587kvrsodelhi@gmail.com' },
  { label: 'Phone', icon: Phone, href: 'tel:+918076233501', value: '+91 8076233501' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/aryan-sharma-7681a3380/', value: 'aryan-sharma' },
  { label: 'GitHub', icon: Github, href: 'https://github.com/arayan11587kvrsodelhi-oss/', value: 'arayan11587kvrsodelhi-oss' },
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/aryan._.5harma/', value: 'aryan._.5harma' },
]

const INTENTS = [
  { icon: Code, title: 'Frontend & UI Engineering', desc: 'Building high-performance interactive web apps, design systems, and dynamic tools.' },
  { icon: Sparkles, title: 'Creative Motion & Web', desc: 'Co-creating atmospheric web experiences with rich storytelling and physics animations.' },
  { icon: Briefcase, title: 'Engineering Opportunities', desc: 'Available for full-time developer roles, internships, and high-impact freelance projects.' },
  { icon: Users, title: 'Networking & Security', desc: 'Connecting with developers, designers, mentors, and cybersecurity enthusiasts.' },
]

function MagneticCTA() {
  const { playSFX } = useSFX()
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const b = ref.current
    if (!b) return
    const r = b.getBoundingClientRect()
    gsap.to(b, {
      x: (e.clientX - r.left - r.width / 2) * 0.28,
      y: (e.clientY - r.top - r.height / 2) * 0.28,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: 'auto',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' })
  }

  return (
    <a
      ref={ref}
      href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Portfolio%20Inquiry%20-%20Aryan%20Sharma"
      onClick={() => playSFX('click')}
      onMouseEnter={() => playSFX('hover')}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="open"
      className="magnetic group inline-flex items-center gap-3 rounded-full border border-accent/70 bg-accent/15 px-8 py-4 sm:py-5 text-base sm:text-lg font-display text-accent hover:bg-accent hover:text-background hover:shadow-[0_0_50px_rgba(53,224,224,0.4)] transition-all duration-300 font-medium min-h-[48px]"
    >
      <span>Start a Conversation</span>
      <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={22} />
    </a>
  )
}

export default function Contact({ onOpenResume }: ContactProps) {
  const { playSFX } = useSFX()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'error' | 'sent'>('idle')
  const [delhiTime, setDelhiTime] = useState('')

  // Live IST Clock
  useEffect(() => {
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
      setDelhiTime(new Intl.DateTimeFormat('en-US', options).format(new Date()))
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('arayan11587kvrsodelhi@gmail.com')
      playSFX('success')
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
      setCopied(false)
    }
    setTimeout(() => {
      setCopied(false)
      setCopyError(false)
    }, 2800)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormStatus('submitting')

    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim()
    const message = String(form.get('message') || '').trim()

    if (!name || !email || !message || !email.includes('@')) {
      setFormStatus('error')
      return
    }

    // Pre-fill email client draft
    playSFX('success')
    setTimeout(() => {
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`)
      const body = encodeURIComponent(`Hi Aryan,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)
      window.location.href = `mailto:arayan11587kvrsodelhi@gmail.com?subject=${subject}&body=${body}`
      setFormStatus('sent')
    }, 400)
  }

  const scrollToTop = () => {
    playSFX('click')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section id="contact" className="relative px-4 sm:px-6 md:px-10 py-[var(--spacing-section)] border-t border-border overflow-hidden">
      <div className="contact-glow pointer-events-none" />

      <div className="max-w-container mx-auto flex flex-col items-center text-center relative z-10">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 text-eyebrow text-accent border border-accent/30 bg-accent/5 px-3.5 py-1.5 rounded-full mb-6">
          <MessageSquare size={13} />
          <span>OPEN FOR COLLABORATION &amp; ROLES</span>
        </div>

        {/* Display Title */}
        <h2 className="font-display text-display max-w-4xl tracking-tight leading-[0.95] text-white">
          LET'S BUILD SOMETHING <br />
          <span className="text-accent">EXTRAORDINARY.</span>
        </h2>

        {/* Subtitle Statement */}
        <p className="text-muted text-base md:text-xl max-w-2xl mt-6 leading-relaxed">
          Whether you have a breakthrough project in mind, an engineering role on your team, or want to connect — my inbox is always open.
        </p>

        {/* Intent Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl my-10 text-left">
          {INTENTS.map((item) => (
            <div
              key={item.title}
              onMouseEnter={() => playSFX('hover')}
              className="bg-surface/80 border border-border p-5 rounded-md hover:border-accent/50 hover:shadow-lg hover:shadow-cyan-950/20 transition-all duration-300 group"
            >
              <item.icon size={20} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-base text-white font-medium mb-1">{item.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Direct Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-4xl grid md:grid-cols-2 gap-4 text-left border-y border-border/80 py-8 md:py-10 bg-surface/40 p-6 md:p-8 rounded-md my-4 backdrop-blur-sm"
          aria-label="Direct message form"
        >
          <div className="md:col-span-2 flex flex-wrap items-end justify-between gap-4 mb-2">
            <div>
              <span className="text-eyebrow text-accent">DIRECT INQUIRY</span>
              <h3 className="font-display text-2xl md:text-3xl text-white font-medium mt-1">
                Tell me what you’re building.
              </h3>
            </div>
            <span className="text-eyebrow text-muted text-xs font-mono">
              QUICK EMAIL DRAFT
            </span>
          </div>

          <label className="flex flex-col gap-2 text-eyebrow text-muted">
            Your Name
            <input
              name="name"
              required
              autoComplete="name"
              className="contact-input"
              placeholder="e.g. Alex Mercer"
              aria-required="true"
            />
          </label>

          <label className="flex flex-col gap-2 text-eyebrow text-muted">
            Email Address
            <input
              name="email"
              required
              type="email"
              autoComplete="email"
              className="contact-input"
              placeholder="alex@company.com"
              aria-required="true"
            />
          </label>

          <label className="md:col-span-2 flex flex-col gap-2 text-eyebrow text-muted">
            Message
            <textarea
              name="message"
              required
              rows={4}
              className="contact-input resize-y"
              placeholder="Tell me about the project, opportunity, timeline, or scope."
              aria-required="true"
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
            <p
              id="form-status"
              className={`text-xs ${
                formStatus === 'error'
                  ? 'text-red-400 font-medium'
                  : formStatus === 'sent'
                  ? 'text-accent font-medium'
                  : 'text-muted'
              }`}
              aria-live="polite"
            >
              {formStatus === 'error'
                ? 'Please provide your name, a valid email, and a message.'
                : formStatus === 'sent'
                ? '✓ Email draft generated! Complete and send via your email client.'
                : formStatus === 'submitting'
                ? 'Preparing your email draft...'
                : 'I typically respond within 24–48 hours.'}
            </p>

            <button
              type="submit"
              onMouseEnter={() => playSFX('hover')}
              className="inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-full font-display font-medium text-sm hover:bg-white transition-all shadow-[0_0_20px_rgba(53,224,224,0.3)] min-h-[44px]"
              data-cursor="open"
            >
              <span>Draft Email Message</span>
              <Send size={14} />
            </button>
          </div>
        </form>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 my-6">
          <MagneticCTA />

          <button
            type="button"
            onClick={copyEmail}
            onMouseEnter={() => playSFX('hover')}
            data-cursor="open"
            className="inline-flex items-center gap-2 px-7 py-4 sm:py-5 border border-border bg-surface text-muted hover:text-accent hover:border-accent/60 rounded-full text-base font-display transition-all min-h-[48px]"
          >
            {copied ? (
              <>
                <Check size={18} className="text-accent" />
                <span className="text-accent font-medium">Email Copied to Clipboard!</span>
              </>
            ) : copyError ? (
              <>
                <Mail size={18} />
                <span className="text-accent">arayan11587kvrsodelhi@gmail.com</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span>Copy Email Address</span>
              </>
            )}
          </button>

          {onOpenResume && (
            <button
              type="button"
              onClick={() => {
                playSFX('modalOpen')
                onOpenResume()
              }}
              onMouseEnter={() => playSFX('hover')}
              data-cursor="open"
              className="inline-flex items-center gap-2 px-6 py-4 sm:py-5 border border-border bg-surface text-muted hover:text-foreground hover:border-accent/60 rounded-full text-base font-display transition-all min-h-[48px]"
            >
              <FileText size={18} className="text-accent" />
              <span>Preview Resume</span>
            </button>
          )}
        </div>

        {/* Direct Contact Links with generous touch targets */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 text-eyebrow border-t border-border/40 pt-8 w-full max-w-3xl">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={() => playSFX('click')}
              onMouseEnter={() => playSFX('hover')}
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors py-2 px-1 min-h-[44px]"
              data-cursor="open"
            >
              <l.icon size={16} className="text-accent" />
              <span>{l.label}</span>
            </a>
          ))}
        </div>

        {/* Footer Meta Bar */}
        <div className="mt-14 pt-8 border-t border-border/30 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div className="flex items-center gap-2 font-mono text-[0.72rem]">
            <Clock size={13} className="text-accent" />
            <span>NEW DELHI (IST):</span>
            <span className="text-foreground font-medium">{delhiTime || '5:30 PM'}</span>
          </div>

          <span>© {new Date().getFullYear()} Aryan Sharma.</span>

          <button
            type="button"
            onClick={scrollToTop}
            onMouseEnter={() => playSFX('hover')}
            className="inline-flex items-center gap-1.5 text-muted hover:text-accent transition-colors font-display p-2 min-h-[44px]"
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </section>
  )
}
