import { useEffect, useState } from 'react'
import { ArrowUpRight, Github } from 'lucide-react'
import { hasLocalImage, loadLocalImage, type ProjectRepo } from '../hooks/useGitHubRepos'
import type { CanonicalProject } from '../data/projectRegistry'

/* ==========================================================================
   FEATURED PROJECTS — separate presentation and selection logic

   These six are curated and ORDERED HERE, not by the GitHub API. The API is
   only consulted to confirm each repository still exists and to pick up its
   live URL. It can never add, remove or reorder a card: the featured list is
   the authority.

   The full archive renders separately below, so nothing here duplicates it.
   ========================================================================== */

export function FeaturedProjects({
  projects,
  repos,
  reduced,
}: {
  projects: CanonicalProject[]
  repos: ProjectRepo[]
  reduced: boolean
}) {
  const byName = new Map(repos.map((r) => [r.name, r]))
  const images = useFeaturedImages(projects)

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 md:px-10 pb-4">
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-eyebrow text-accent">FEATURED SELECTION</span>
        <span className="h-[1px] flex-1 min-w-[2rem] bg-border" />
        <span className="text-xs font-mono text-white/45">{pad(projects.length)} CURATED</span>
      </div>

      <ul className="feat-grid">
        {projects.map((project, i) => {
          const repo = byName.get(project.repoName)
          // Prefer the API's live URL; fall back to the verified curated one.
          const liveUrl = repo?.demoUrl || project.liveUrl || ''
          const sourceUrl = repo?.githubUrl ?? `https://github.com/arayan11587kvrsodelhi-oss/${project.repoName}`
          const image = images[project.repoName]

          return (
            <li key={project.id} className="feat-item">
              <article className="feat-card">
                {/* Visual — the whole media area links to the primary URL */}
                <div className="feat-media">
                  {image ? (
                    <img
                      src={image}
                      alt={`${project.title} interface`}
                      loading={i < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      className={`feat-img ${reduced ? '' : 'feat-img--zoom'}`}
                    />
                  ) : (
                    <div className="feat-fallback" aria-hidden="true">
                      <span className="feat-fallback-mark">{initials(project.title)}</span>
                    </div>
                  )}
                  <span className="feat-index">{pad(i + 1)}</span>
                </div>

                {/* Body */}
                <div className="feat-body">
                  <span className="feat-cat">{project.category}</span>
                  <h3 className="feat-title">{project.title}</h3>
                  <p className="feat-desc">{project.summary}</p>

                  <ul className="feat-tech">
                    {project.tech.slice(0, 5).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>

                  {/* Real, separately-targeted actions. */}
                  <span className="feat-actions">
                    {liveUrl ? (
                      <a
                        className="feat-link feat-link--primary"
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        LIVE DEMO
                        <ArrowUpRight size={13} aria-hidden="true" />
                        <span className="sr-only"> — {project.title}</span>
                      </a>
                    ) : (
                      <span className="feat-link feat-link--muted">NO LIVE DEPLOY</span>
                    )}
                    <a
                      className="feat-link"
                      href={sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      VIEW SOURCE
                      <Github size={13} aria-hidden="true" />
                      <span className="sr-only"> — {project.title}</span>
                    </a>
                  </span>
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/* ---- Lazy image resolution, scoped to the featured six only ------------- */
function useFeaturedImages(projects: CanonicalProject[]) {
  const [images, setImages] = useState<Record<string, string>>({})
  // Stable dependency: the joined repo names of the featured projects that
  // actually have a committed screenshot.
  const withImages = projects
    .filter((p) => hasLocalImage(p.repoName))
    .map((p) => p.repoName)
    .join('|')

  useEffect(() => {
    let cancelled = false
    for (const name of withImages.split('|').filter(Boolean)) {
      loadLocalImage(name).then((url) => {
        if (url && !cancelled) {
          setImages((prev) => (prev[name] ? prev : { ...prev, [name]: url }))
        }
      })
    }
    return () => {
      cancelled = true
    }
  }, [withImages])

  return images
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function initials(title: string): string {
  const words = title.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean)
  if (words.length === 0) return '??'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}
