export interface SkillGroup {
  category: string
  subtitle: string
  skills: string[]
  relatedProjects: string[]
  relatedCertificates: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend & UI Engineering',
    subtitle: 'Interfaces, design systems & rendering',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS'],
    relatedProjects: ['VELORA', 'AMBER HOUR', 'PORTFOLIO V3', 'ARYAN PORTFOLIO CINEMATIC'],
    relatedCertificates: ['IBM Web Development Fundamentals', 'Trinity 404 Makeover']
  },
  {
    category: 'Cybersecurity & Defensive Engineering',
    subtitle: 'Threat telemetry, SOC workflows & security basics',
    skills: ['SOC Concepts', 'Security Monitoring', 'NIST NVD', 'CISA KEV', 'MITRE ATT&CK', 'Vulnerability Intelligence'],
    relatedProjects: ['SENTINEL SOC v2.2', 'AUTH CLIENT', 'PORTFOLIO AUTH SYSTEM'],
    relatedCertificates: ['WsCube Tech Cybersecurity Masterclass 2026', 'Network Bulls Industrial Visit']
  },
  {
    category: 'Motion & Interaction Design',
    subtitle: 'Choreography & spring physics',
    skills: ['GSAP', 'ScrollTrigger', 'Framer Motion', 'Lenis', 'Canvas / SVG', 'Touch Gestures'],
    relatedProjects: ['AMBER HOUR', 'VELORA', 'PORTFOLIO CARD', 'ARYAN PORTFOLIO CINEMATIC'],
    relatedCertificates: ['Trinity 404 Makeover']
  },
  {
    category: 'Backend & Developer Tooling',
    subtitle: 'Runtimes, APIs & developer tooling',
    skills: ['Python', 'FastAPI', 'Node.js', 'Express', 'GitHub REST API', 'SQLite', 'Vite', 'Git / GitHub', 'Framer'],
    relatedProjects: ['NEXUS DASHBOARD', 'SENTINEL SOC v2.2', 'SCIENTIFIC CALCULATOR'],
    relatedCertificates: ['IBM Career Management Essentials', 'EY AI Skills Passport']
  },
  {
    category: 'AI & Analytical Thinking',
    subtitle: 'Defensive triage & LLM-assisted workflows',
    skills: ['Defensive AI Triage', 'Incident Correlation', 'Vulnerability Intelligence', 'Fact-Checking AI Output'],
    relatedProjects: ['SENTINEL SOC v2.2 (AI Analyst)'],
    relatedCertificates: ['EY × Anudip AI Fundamentals (Top 5 / Winner)', 'HP LIFE Critical Thinking in the AI Era', 'EY × Microsoft AI Skills Passport']
  }
]

export const totalSkillCount = skillGroups.reduce((n, g) => n + g.skills.length, 0)
