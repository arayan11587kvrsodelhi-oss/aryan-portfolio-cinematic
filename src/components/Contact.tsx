import { useRef, useState } from 'react'
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
  Code
} from 'lucide-react'

const LINKS = [
  { label: 'Email', icon: Mail, href: 'mailto:arayan11587kvrsodelhi@gmail.com', value: 'arayan11587kvrsodelhi@gmail.com' },
  { label: 'Phone', icon: Phone, href: 'tel:+918076233501', value: '+91 8076233501' },
  { label: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/aryan-sharma-7681a3380/', value: 'aryan-sharma' },
  { label: 'GitHub', icon: Github, href: 'https://github.com/arayan11587kvrsodelhi-oss/', value: 'arayan11587kvrsodelhi-oss' },
  { label: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/aryan._.5harma/', value: 'aryan._.5harma' },
]

const INTENTS = [
  { icon: Code, title: 'Custom Projects', desc: 'Interactive websites, creative frontend builds, and dynamic tools.' },
  { icon: Sparkles, title: 'Creative Collaboration', desc: 'Co-building bold ideas with designers, developers, and founders.' },
  { icon: Briefcase, title: 'Opportunities', desc: 'Open for full-time roles, internships, and high-impact freelance work.' },
  { icon: Users, title: 'Networking', desc: 'Connecting with fellow developers, mentors, and cybersecurity enthusiasts.' },
]

function MagneticCTA() {
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
      href="mailto:arayan11587kvrsodelhi@gmail.com?subject=Portfolio%20Inquiry"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="open"
      className="magnetic group inline-flex items-center gap-3 rounded-full border border-accent/60 bg-accent/10 px-8 py-5 text-lg font-display text-accent hover:bg-accent hover:text-background hover:shadow-[0_0_60px_rgba(53,224,224,0.4)] transition-all duration-300"
    >
      <span>Start a Conversation</span>
      <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={22} />
    </a>
  )
}

export default function Contact() {
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const [formStatus, setFormStatus] = useState<'idle' | 'error' | 'sent'>('idle')

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText('arayan11587kvrsodelhi@gmail.com')
      setCopied(true)
      setCopyError(false)
    } catch {
      setCopyError(true)
      setCopied(false)
    }
    setTimeout(() => { setCopied(false); setCopyError(false) }, 2500)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') || '').trim()
    const email = String(form.get('email') || '').trim()
    const message = String(form.get('message') || '').trim()
    if (!name || !email || !message || !email.includes('@')) {
      setFormStatus('error')
      return
    }
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    window.location.href = `mailto:arayan11587kvrsodelhi@gmail.com?subject=${subject}&body=${body}`
    setFormStatus('sent')
    event.currentTarget.reset()
  }

  return (
    <section id="contact" className="relative px-6 md:px-10 py-[var(--spacing-section)] border-t border-border overflow-hidden">
      <div className="contact-glow pointer-events-none" />

      <div className="max-w-container mx-auto flex flex-col items-center text-center relative z-10">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 text-eyebrow text-accent border border-accent/30 bg-accent/5 px-3.5 py-1.5 rounded-full mb-6">
          <MessageSquare size={13} />
          <span>OPEN FOR COLLABORATION &amp; ROLES</span>
        </div>

        {/* Display Title */}
        <h2 className="font-display text-display max-w-4xl tracking-tight leading-[0.95]">
          LET'S BUILD SOMETHING <br />
          <span className="text-accent">EXTRAORDINARY.</span>
        </h2>

        {/* Subtitle statement */}
        <p className="text-muted text-base md:text-xl max-w-2xl mt-6 leading-relaxed">
          Whether you have a groundbreaking project in mind, an open position on your engineering team, or simply want to connect — my inbox is always open.
        </p>

        {/* Intent Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl my-10 text-left">
          {INTENTS.map((item) => (
            <div
              key={item.title}
              className="bg-surface/60 border border-border/80 p-5 rounded hover:border-accent/50 transition-colors group"
            >
              <item.icon size={20} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-display text-base text-foreground mb-1">{item.title}</h3>
              <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-5xl grid md:grid-cols-2 gap-4 text-left border-y border-border/60 py-8 md:py-10">
          <div className="md:col-span-2 flex items-end justify-between gap-4">
            <div>
              <span className="text-eyebrow text-accent">DIRECT INQUIRY</span>
              <h3 className="font-display text-2xl md:text-3xl mt-2">Tell me what you’re building.</h3>
            </div>
            <span className="text-eyebrow text-muted hidden sm:block">NO BACKEND / EMAIL DRAFT</span>
          </div>
          <label className="flex flex-col gap-2 text-eyebrow text-muted">
            Name
            <input name="name" required autoComplete="name" className="contact-input" placeholder="Your name" />
          </label>
          <label className="flex flex-col gap-2 text-eyebrow text-muted">
            Email
            <input name="email" required type="email" autoComplete="email" className="contact-input" placeholder="you@example.com" />
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-eyebrow text-muted">
            Message
            <textarea name="message" required rows={4} className="contact-input resize-y" placeholder="A few lines about the project, role, or idea." />
          </label>
          <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4">
            <p className={`text-sm ${formStatus === 'error' ? 'text-red-300' : 'text-muted'}`} aria-live="polite">
              {formStatus === 'error' ? 'Add your name, a valid email, and a message.' : formStatus === 'sent' ? 'Your email draft is ready. Send it to complete the inquiry.' : 'I usually reply within a few working days.'}
            </p>
            <button type="submit" className="inline-flex items-center gap-2 bg-accent text-background px-5 py-3 rounded-full font-display text-sm hover:bg-white transition-colors" data-cursor="open">
              <span>Open Email Draft</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </form>

        {/* Main CTA Action */}
        <div className="flex flex-col sm:flex-row items-center gap-4 my-4">
          <MagneticCTA />
          <button
            onClick={copyEmail}
            data-cursor="open"
            className="inline-flex items-center gap-2 px-6 py-4 border border-border bg-surface text-muted hover:text-accent hover:border-accent/60 rounded-full text-sm font-display transition-colors"
          >
            {copied ? (
              <>
                <Check size={16} className="text-accent" />
                <span className="text-accent">Email Copied!</span>
              </>
            ) : copyError ? (
              <>
                <Mail size={16} />
                <span className="text-accent">Copy unavailable</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy Email Address</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Contact Links */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mt-10 text-eyebrow border-t border-border/40 pt-8 w-full max-w-3xl">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-2 text-muted hover:text-accent transition-colors"
              data-cursor="open"
            >
              <l.icon size={15} className="text-accent" />
              <span>{l.label}</span>
            </a>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-14 pt-8 border-t border-border/20 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} Aryan Sharma. All rights reserved.</span>
          <span>Designed &amp; Developed with React, GSAP, Tailwind &amp; Lenis</span>
        </div>
      </div>
    </section>
  )
}
