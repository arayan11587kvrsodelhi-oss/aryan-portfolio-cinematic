import { ArrowUpRight, Github, SearchX } from 'lucide-react'
import type { ArchiveEntry } from './ProjectDirectory'

/* ==========================================================================
   PROJECT DIRECTORY — presentational parts

   ARCHIVE CARD: numbered, compact, premium. Real screenshot when one exists,
   otherwise a deterministic branded fallback built from the project's own
   title and category. No broken image icons, no stretched screenshots, no
   stock imagery and no invented UI.

   BRANDED FALLBACK is generated from the project's real identity: its
   initials, its real title, its real repository name and its category. It
   never implies a screenshot it does not have.
   ========================================================================== */

/** Deterministic hue per category, so a category always reads the same. */
const CATEGORY_HUE: Record<string, number> = {
  CYBERSECURITY: 186,
  'WEB DEVELOPMENT': 168,
  'AI & BACKEND': 202,
  'GAMES & EXPERIMENTS': 294,
}

/** First letter of the first two meaningful words, e.g. "SENTINEL SOC" -> "SS". */
function initials(title: string): string {
  const words = title.replace(/[^\p{L}\p{N} ]/gu, ' ').split(/\s+/).filter(Boolean)
  if (words.length === 0) return '??'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

export function ArchiveCard({
  entry,
  image,
  onHover,
}: {
  entry: ArchiveEntry
  image?: string
  onHover: () => void
}) {
  const hue = CATEGORY_HUE[entry.category] ?? 186

  return (
    <article className="pcard" onMouseEnter={onHover} style={{ ['--pcard-hue' as string]: hue }}>
      {/* ---- Visual: real screenshot, or a branded fallback -------------- */}
      <div className="pcard-media">
        {image ? (
          <img
            src={image}
            alt={`${entry.title} interface`}
            loading="lazy"
            decoding="async"
            className="pcard-img"
          />
        ) : (
          <div className="pcard-fallback" aria-hidden="true">
            <span className="pcard-fallback-mark">{initials(entry.title)}</span>
            <span className="pcard-fallback-repo">{entry.repo?.name ?? entry.key}</span>
          </div>
        )}

        {/* Fixed archive number — stable across every filter and search. */}
        <span className="pcard-number">{entry.number}</span>
      </div>

      {/* ---- Body -------------------------------------------------------- */}
      <div className="pcard-body">
        <div className="pcard-meta">
          <span className="pcard-cat">{entry.category}</span>
          {entry.featured && <span className="pcard-badge">FEATURED</span>}
        </div>

        <h3 className="pcard-title">{entry.title}</h3>
        <p className="pcard-desc">{entry.summary}</p>

        {entry.tech.length > 0 && (
          <ul className="pcard-tech">
            {entry.tech.slice(0, 5).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}

        {/* ---- Actions: only real, verified URLs ever render ------------ */}
        <div className="pcard-actions">
          {entry.liveUrl && (
            <a
              className="pcard-link pcard-link--primary"
              href={entry.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              LIVE DEMO
              <ArrowUpRight size={13} aria-hidden="true" />
              <span className="sr-only"> — {entry.title}</span>
            </a>
          )}
          {entry.sourceUrl && (
            <a
              className="pcard-link"
              href={entry.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              VIEW SOURCE
              <Github size={13} aria-hidden="true" />
              <span className="sr-only"> — {entry.title}</span>
            </a>
          )}
          {!entry.liveUrl && !entry.sourceUrl && (
            <span className="pcard-link pcard-link--muted">NO PUBLIC LINKS</span>
          )}
        </div>
      </div>
    </article>
  )
}

/** Designed empty state — explains the situation and offers a way out. */
export function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="pempty">
      <SearchX size={22} className="pempty-icon" aria-hidden="true" />
      <h3 className="pempty-title">No projects match this search</h3>
      <p className="pempty-text">
        {query
          ? `Nothing in the collection matches "${query}". Try a different term — a project name, a technology, or a category.`
          : 'Nothing in the collection matches this combination of filters.'}
      </p>
      <button type="button" className="pempty-btn" onClick={onReset}>
        Show all projects
      </button>
    </div>
  )
}
