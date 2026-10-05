import { useEffect, useRef } from 'react'
import veloraImage from '../assets/photos/velora.png'
import amberHourImage from '../assets/photos/amber-hour.png'
import portfolioImage from '../assets/photos/portfolio.png'
import sentinelSocImage from '../assets/photos/sentinel-soc-v2.2.png'
import nexusDashboardImage from '../assets/photos/nexus-dashboard.png'
import portfolioCardImage from '../assets/photos/portfolio-card.png'
import businessLandingImage from '../assets/photos/business-landing.png'

/**
 * SkillHoverPreview — ORIGINAL editorial hover/focus preview for skills.
 *
 * Every entry maps a REAL skill from src/data/skills.ts to a REAL project
 * visual that already exists in src/assets/photos and is already wired
 * into this portfolio's data (projects.ts / githubRepos.ts). No stock
 * imagery, no invented projects — each note is grounded in the existing
 * repository data (tech arrays, key features, or real certificates).
 *
 * Interaction:
 *  - Desktop (pointer: fine): preview follows the cursor loosely (lerped
 *    via rAF, no per-frame React state).
 *  - Keyboard focus: preview anchors below the focused chip.
 *  - Touch: tap toggles an anchored preview.
 *  - The panel is supplementary (aria-hidden) — all grounding info is
 *    also visible in the related-project / credential chips.
 */

export interface SkillPreviewEntry {
  skill: string
  project: string
  note: string
  image: string
}

export interface SkillPreviewState {
  skill: string
  /** true → cursor-follow (desktop pointer only) */
  follow: boolean
  /** chip rect (viewport coords) for anchoring */
  anchor: { left: number; top: number; right: number; bottom: number }
}

const p = (skill: string, project: string, note: string, image: string): SkillPreviewEntry => ({
  skill,
  project,
  note,
  image,
})

export const SKILL_PREVIEWS: Record<string, SkillPreviewEntry> = {
  /* Frontend & UI Engineering */
  React: p('React', 'VELORA', 'React 19 interface architecture and component systems.', veloraImage),
  TypeScript: p('TypeScript', 'VELORA', 'Strict typing across the full VELORA interface.', veloraImage),
  JavaScript: p('JavaScript', 'NORTHSTAR STUDIO LANDING', 'Interactive landing behaviour in vanilla JavaScript.', businessLandingImage),
  HTML5: p('HTML5', 'NORTHSTAR STUDIO LANDING', 'SEO-ready semantic HTML5 page structure.', businessLandingImage),
  CSS3: p('CSS3', 'NORTHSTAR STUDIO LANDING', 'Responsive CSS3 layout and dark visual system.', businessLandingImage),
  'Tailwind CSS': p('Tailwind CSS', 'SENTINEL SOC v2.2', 'Tailwind-driven SOC interface system.', sentinelSocImage),
  /* Cybersecurity & Defensive Engineering */
  'SOC Concepts': p('SOC Concepts', 'SENTINEL SOC v2.2', 'SOC platform concepts — telemetry, correlation, incidents.', sentinelSocImage),
  'Security Monitoring': p('Security Monitoring', 'SENTINEL SOC v2.2', 'Real-time security telemetry monitoring workflows.', sentinelSocImage),
  'NIST NVD': p('NIST NVD', 'SENTINEL SOC v2.2', 'Live NIST NVD API 2.0 vulnerability ingestion.', sentinelSocImage),
  'CISA KEV': p('CISA KEV', 'SENTINEL SOC v2.2', 'CISA Known Exploited Vulnerabilities catalog integration.', sentinelSocImage),
  'MITRE ATT&CK': p('MITRE ATT&CK', 'SENTINEL SOC v2.2', 'MITRE ATT&CK technique mapping and matrices.', sentinelSocImage),
  'Vulnerability Intelligence': p('Vulnerability Intelligence', 'SENTINEL SOC v2.2', 'CVSS scoring, CWE tracking, ransomware indicators.', sentinelSocImage),
  /* Motion & Interaction Design */
  GSAP: p('GSAP', 'ARYAN PORTFOLIO CINEMATIC', 'GSAP choreography and staggered reveals.', portfolioImage),
  ScrollTrigger: p('ScrollTrigger', 'ARYAN PORTFOLIO CINEMATIC', 'Scroll-synchronized pinning and parallax systems.', portfolioImage),
  'Framer Motion': p('Framer Motion', 'AMBER HOUR', 'Spring physics and gesture-driven motion.', amberHourImage),
  Lenis: p('Lenis', 'VELORA', 'Lenis smooth scrolling wired into GSAP.', veloraImage),
  'Canvas / SVG': p('Canvas / SVG', 'PORTFOLIO CARD', 'Custom canvas-based border shader and card visuals.', portfolioCardImage),
  'Touch Gestures': p('Touch Gestures', 'AMBER HOUR', 'Touch physics for gesture-based roasting curves.', amberHourImage),
  /* Backend & Developer Tooling */
  Python: p('Python', 'SENTINEL SOC v2.2', 'FastAPI backend engine powering the telemetry bus.', sentinelSocImage),
  FastAPI: p('FastAPI', 'SENTINEL SOC v2.2', 'Asynchronous WebSocket bus and SQLite event store.', sentinelSocImage),
  'Node.js': p('Node.js', 'NEXUS DASHBOARD', 'Node/Express services serving live repository data.', nexusDashboardImage),
  Express: p('Express', 'NEXUS DASHBOARD', 'Express routing and REST API endpoints.', nexusDashboardImage),
  'GitHub REST API': p('GitHub REST API', 'NEXUS DASHBOARD', 'Live repository data via the GitHub REST API.', nexusDashboardImage),
  SQLite: p('SQLite', 'SENTINEL SOC v2.2', 'SQLite event store for incidents and telemetry.', sentinelSocImage),
  Vite: p('Vite', 'VELORA', 'Vite build pipeline for fast, clean iteration.', veloraImage),
  'Git / GitHub': p('Git / GitHub', 'ARYAN PORTFOLIO CINEMATIC', 'Versioned across verified public repositories.', portfolioImage),
  Framer: p('Framer', 'VELORA', 'Framer Motion pipelines inside production interfaces.', veloraImage),
  /* AI & Analytical Thinking */
  'Defensive AI Triage': p('Defensive AI Triage', 'SENTINEL SOC v2.2', 'Sentinel AI defensive analyst with 0–100 risk scoring.', sentinelSocImage),
  'Incident Correlation': p('Incident Correlation', 'SENTINEL SOC v2.2', 'Attack-chain correlation and unified incident timelines.', sentinelSocImage),
  'Fact-Checking AI Output': p('Fact-Checking AI Output', 'SENTINEL SOC v2.2', 'Certified: HP LIFE — Critical Thinking in the AI Era.', sentinelSocImage),
}

export default function SkillHoverPreview({ preview }: { preview: SkillPreviewState | null }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const displayRef = useRef<SkillPreviewEntry | undefined>(undefined)
  const targetRef = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })

  const entry = preview ? SKILL_PREVIEWS[preview.skill] : undefined

  /* Keep the last entry mounted while the panel fades out (exit anim) */
  useEffect(() => {
    if (entry) displayRef.current = entry
  }, [entry])
  const shown = entry ?? displayRef.current

  /* Position on open only — anchored or initial cursor-side placement */
  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !preview) return
    const vw = window.innerWidth
    const vh = window.innerHeight
    const pw = panel.offsetWidth || 264
    const ph = panel.offsetHeight || 240
    let x: number
    let y: number
    if (preview.follow) {
      x = Math.min(Math.max(preview.anchor.right + 16, 12), vw - pw - 12)
      y = Math.min(Math.max(preview.anchor.top - 32, 12), vh - ph - 12)
    } else {
      x = Math.min(Math.max(preview.anchor.left - 10, 12), vw - pw - 12)
      y = preview.anchor.bottom + 10
      if (y + ph > vh - 12) y = Math.max(12, preview.anchor.top - ph - 10)
    }
    posRef.current = { x, y }
    targetRef.current = { x, y }
    panel.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [preview])

  /* Loose cursor-follow (desktop only): rAF lerp, zero React state/frame */
  useEffect(() => {
    if (!preview?.follow) return
    const panel = panelRef.current
    if (!panel) return

    const onMove = (e: MouseEvent) => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const pw = panel.offsetWidth || 264
      const ph = panel.offsetHeight || 240
      targetRef.current = {
        x: Math.min(Math.max(e.clientX + 22, 12), vw - pw - 12),
        y: Math.min(Math.max(e.clientY - ph / 2, 12), vh - ph - 12),
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let raf = 0
    const tick = () => {
      const tg = targetRef.current
      posRef.current.x += (tg.x - posRef.current.x) * 0.16
      posRef.current.y += (tg.y - posRef.current.y) * 0.16
      panel.style.transform = `translate3d(${posRef.current.x.toFixed(1)}px, ${posRef.current.y.toFixed(1)}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [preview])

  return (
    <div
      ref={panelRef}
      className={`skpv-panel${preview ? ' is-open' : ''}`}
      aria-hidden="true"
    >
      {shown && (
        <>
          <div className="skpv-media">
            <img src={shown.image} alt="" decoding="async" draggable={false} />
          </div>
          <div className="skpv-body">
            <span className="skpv-kicker">FEATURED IN</span>
            <span className="skpv-proj">{shown.project}</span>
            <span className="skpv-name">{shown.skill}</span>
            <span className="skpv-note">{shown.note}</span>
          </div>
        </>
      )}
    </div>
  )
}

