import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  GraduationCap,
  Award,
  Github,
  Linkedin,
  Mail,
  Phone,
  ExternalLink,
  X,
  FileText,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { projects } from '../data/projects'
import { orderedCertifications } from '../data/certifications'
import { skillGroups } from '../data/skills'
import { GITHUB_PROFILE_URL } from '../data/githubRepos'

interface RecruiterViewProps {
  isOpen: boolean
  onClose: () => void
  onOpenResume: () => void
}

export default function RecruiterView({ isOpen, onClose, onOpenResume }: RecruiterViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Top flagship projects
  const topProjects = projects.slice(0, 4)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl p-3 sm:p-6 md:p-8 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="recruiter-view-title"
      >
        <div className="min-h-full flex items-center justify-center py-6">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-5xl rounded-3xl border border-white/15 bg-[#0d0e12] p-6 sm:p-10 shadow-2xl text-white"
          >
            {/* Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                      Recruiter Mode Active
                    </span>
                    <span className="text-xs font-mono text-white/40">30-Second Executive Summary</span>
                  </div>
                  <h1 id="recruiter-view-title" className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                    Aryan Sharma — Developer Dossier
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onOpenResume}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono text-white flex items-center gap-2 transition-colors"
                >
                  <FileText size={14} />
                  <span>Full Resume</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  aria-label="Exit Recruiter View"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Quick Profile & Contact Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 rounded-2xl bg-white/[0.02] border border-white/5 mb-8 text-xs font-mono">
              <div>
                <div className="text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <GraduationCap size={14} className="text-emerald-400" /> Education
                </div>
                <div className="font-semibold text-white text-sm">Bachelor of Computer Applications</div>
                <div className="text-white/60">Trinity Institute of Professional Studies (TIPS, Dwarka)</div>
                <div className="text-white/40 mt-0.5">Computer Science · 2025 – 2029</div>
              </div>

              <div>
                <div className="text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-blue-400" /> Specialization
                </div>
                <div className="font-semibold text-white text-sm">Creative Frontend & Security-Focused Web</div>
                <div className="text-white/60">React, TypeScript, FastAPI, WebSockets</div>
                <div className="text-white/40 mt-0.5">Interactive interfaces + Threat-intelligence demo</div>
              </div>

              <div>
                <div className="text-white/40 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone size={14} className="text-purple-400" /> Direct Channels
                </div>
                <div className="space-y-1 text-white/80">
                  <div>
                    <a href="mailto:arayan11587kvrsodelhi@gmail.com" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Mail size={12} /> arayan11587kvrsodelhi@gmail.com
                    </a>
                  </div>
                  <div>
                    <a href="https://www.linkedin.com/in/aryan-sharma-7681a3380" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Linkedin size={12} /> linkedin.com/in/aryan-sharma-7681a3380 ↗
                    </a>
                  </div>
                  <div>
                    <a href={GITHUB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Github size={12} /> github.com/arayan11587kvrsodelhi-oss ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Flagship Projects Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <Sparkles size={16} className="text-emerald-400" /> Flagship Projects
                </h2>
                <span className="text-xs font-mono text-white/40">4 Curated Highlights</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-white/60">
                          {p.category}
                        </span>
                        <span className="text-xs font-mono text-emerald-400 font-semibold">{p.number}</span>
                      </div>
                      <h3 className="text-base font-display font-semibold text-white mb-1">{p.title}</h3>
                      <p className="text-xs font-mono text-white/60 mb-3 line-clamp-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {p.tech.slice(0, 4).map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[10px] font-mono text-white/70">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-white/5 text-xs font-mono">
                      <a
                        href={p.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                      >
                        <Github size={12} /> GitHub ↗
                      </a>
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 transition-colors flex items-center gap-1"
                        >
                          <ExternalLink size={12} /> Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Certifications & Merit */}
            <div className="mb-10">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
                  <Award size={16} className="text-accent" /> Verified Recognition & Credentials
                </h2>
                <span className="text-xs font-mono text-white/40">Grounded & Verifiable</span>
              </div>

              <div className="space-y-2.5">
                {orderedCertifications.slice(0, 5).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 font-semibold">{cert.number}</span>
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{cert.title}</span>
                          {cert.hierarchyTier === 'Merit Recognition' && (
                            <span className="px-2 py-0.2 rounded text-[10px] bg-accent/20 text-accent font-bold">
                              WINNER / TOP 5
                            </span>
                          )}
                        </div>
                        <div className="text-white/50 text-[11px]">
                          {cert.issuer} · {cert.type} {cert.date ? `(${cert.date})` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {cert.verificationUrl && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1 text-[11px]"
                        >
                          Verify on Credly ↗
                        </a>
                      )}
                      <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px]">
                        {cert.hierarchyTier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills Overview */}
            <div className="mb-8">
              <h2 className="text-lg font-display font-semibold text-white mb-4">
                Technical Capabilities Matrix
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillGroups.map((g) => (
                  <div key={g.category} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-xs font-mono font-semibold text-white mb-1">{g.category}</div>
                    <div className="text-[11px] font-mono text-white/50 mb-2.5">{g.subtitle}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {g.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-white/5 text-[11px] font-mono text-white/80">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
              <div className="text-white/40">
                GitHub: <span className="text-white">github.com/arayan11587kvrsodelhi-oss</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors"
                >
                  Return to Cinematic Experience
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
