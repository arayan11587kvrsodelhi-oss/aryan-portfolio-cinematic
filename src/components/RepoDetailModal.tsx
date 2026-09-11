import { useEffect, useRef } from 'react'
import type { GitHubRepo } from '../data/githubRepos'
import { LANGUAGE_COLORS } from '../data/githubRepos'

interface RepoDetailModalProps {
  repo: GitHubRepo | null
  onClose: () => void
}

export default function RepoDetailModal({ repo, onClose }: RepoDetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!repo) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [repo, onClose])

  if (!repo) return null

  const langColor = LANGUAGE_COLORS[repo.primaryLanguage] || '#888'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="repo-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0c0d10] p-6 sm:p-8 shadow-2xl text-white/90"
      >
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 tracking-wider uppercase">
              {repo.category}
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: langColor }}
              />
              <span className="text-white/80">{repo.primaryLanguage}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {repo.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-white/50 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors font-mono text-xs"
            aria-label="Close dialog"
          >
            ✕ [ESC]
          </button>
        </div>

        {/* Title & Path */}
        <div className="mb-6">
          <div className="text-xs font-mono text-white/40 tracking-wider mb-1">
            arayan11587kvrsodelhi-oss / {repo.name}
          </div>
          <h2
            id="repo-modal-title"
            className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight"
          >
            {repo.displayName}
          </h2>
        </div>

        {/* Optional Preview Image */}
        {repo.previewImage && (
          <div className="mb-6 rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-[16/9] max-h-72">
            <img
              src={repo.previewImage}
              alt={`${repo.displayName} preview`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-top"
            />
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2">
            Description
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-white/80">
            {repo.description}
          </p>
        </div>

        {/* Architecture */}
        {repo.architecture && (
          <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-1.5">
              Architecture
            </h3>
            <p className="text-xs sm:text-sm font-mono text-white/70 leading-relaxed">
              {repo.architecture}
            </p>
          </div>
        )}

        {/* Key Highlights */}
        {repo.keyHighlights && repo.keyHighlights.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2.5">
              Key Highlights
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-white/70 font-mono">
              {repo.keyHighlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400 select-none">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies Pills */}
        <div className="mb-8">
          <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-2.5">
            Technologies & Libraries
          </h3>
          <div className="flex flex-wrap gap-2">
            {repo.technologies.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-xs font-mono rounded-md bg-white/5 border border-white/10 text-white/80"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Verified Metadata Row */}
        <div className="mb-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-white/40 gap-3">
          <div>Created: {repo.createdAt}</div>
          <div>Updated: {repo.updatedAt}</div>
          <div>Stars: {repo.stars} · Forks: {repo.forks}</div>
        </div>

        {/* Action Buttons - Only when verified */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={repo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-medium text-sm hover:bg-white/90 transition-all shadow-lg"
          >
            <span>VIEW GITHUB</span>
            <span className="text-xs">↗</span>
          </a>

          {repo.demoUrl && (
            <a
              href={repo.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-medium text-sm transition-all"
            >
              <span>LIVE EXPERIENCE</span>
              <span className="text-xs">↗</span>
            </a>
          )}

          <button
            onClick={onClose}
            className="ml-auto text-xs font-mono text-white/40 hover:text-white transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  )
}
