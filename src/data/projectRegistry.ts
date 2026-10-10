/* ==========================================================================
   CANONICAL PROJECT REGISTRY — single source of truth for BOTH the six
   featured projects and the full 21-project archive.

   WHY THIS FILE EXISTS
   --------------------
   The GitHub API is the source of truth for *which* repositories exist and for
   their live URLs, but it cannot supply a display title, a written
   description, a category, or a screenshot. Those are curated here so that:

   - the six featured projects can never be reordered by API sort order,
   - every project gets a stable identity and a stable archive number,
   - a project is never listed twice when it exists in both this file and the
     API response.

   INTEGRITY RULES (do not relax)
   ------------------------------
   1. `repoName` MUST match the real GitHub repository name exactly. That is
      the join key against the API.
   2. `liveUrl` / `githubUrl` are only ever real, already-published URLs. They
      are shown only after the API confirms the repository exists; nothing is
      constructed or guessed.
   3. `summary` is a short factual description. It is deliberately conservative
      and only states what the repository demonstrably is.
   4. `category` is derived from the real stack and purpose recorded here — not
      invented.
   5. Nothing is invented for a repository that is not in this file: the
      archive still shows it, using its real API name and live URL, under the
      `WEB DEVELOPMENT` default with a "description not provided" note.

   NUMBERING
   ---------
   `number` is assigned from the canonical order below and is FIXED. Filtering
   or searching never renumbers: a card keeps its number whatever the user is
   looking at.
   ========================================================================== */

export type ProjectCategory =
  | 'CYBERSECURITY'
  | 'WEB DEVELOPMENT'
  | 'AI & BACKEND'
  | 'GAMES & EXPERIMENTS'

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  'CYBERSECURITY',
  'WEB DEVELOPMENT',
  'AI & BACKEND',
  'GAMES & EXPERIMENTS',
]

export interface CanonicalProject {
  /** Exact GitHub repository name. The join key. Never invented. */
  repoName: string
  /** Stable identity. Used as the React key and for dedupe. */
  id: string
  /** Curated display title. */
  title: string
  /** One-line factual description. */
  summary: string
  category: ProjectCategory
  /**
   * Technology list. Real stacks only, taken from the repository's actual
   * dependencies/usage. The API language and topics are appended at runtime,
   * never replacing these.
   */
  tech: string[]
  /**
   * Verified live URL, when one genuinely exists. Undefined means "do not
   * render a LIVE DEMO action" — a card must never advertise a URL it cannot
   * prove.
   */
  liveUrl?: string
  /** True when this project is one of the six curated featured projects. */
  featured: boolean
}

/**
 * The six featured projects, in the exact order they must appear.
 * Order here is authoritative and independent of the API's sort order.
 */
export const FEATURED_ORDER: string[] = [
  'sentinel-soc',
  'aryan-portfolio-cinematic',
  'vigil-cloud-security',
  'Typing-car-race',
  'nexus-dashboard',
  'velora-fintech-landing-page',
]

export const canonicalProjects: CanonicalProject[] = [
  {
    repoName: 'sentinel-soc',
    id: 'sentinel-soc',
    title: 'SENTINEL SOC v2.2',
    summary:
      'A full-stack Security Operations Center platform: real-time telemetry simulation, incident correlation, live NIST NVD and CISA KEV threat intelligence, and MITRE ATT&CK mapping behind an interactive React forensics dashboard.',
    category: 'CYBERSECURITY',
    tech: ['Python', 'FastAPI', 'WebSockets', 'React', 'TypeScript', 'NIST NVD', 'CISA KEV', 'MITRE ATT&CK'],
    liveUrl: 'https://sentinel-soc1.vercel.app/',
    featured: true,
  },
  {
    repoName: 'aryan-portfolio-cinematic',
    id: 'aryan-portfolio-cinematic',
    title: 'ARYAN SHARMA PORTFOLIO',
    summary:
      'A cinematic developer portfolio built with GSAP ScrollTrigger, Lenis momentum scrolling and Framer Motion, with accessible modals and prefers-reduced-motion support throughout.',
    category: 'WEB DEVELOPMENT',
    tech: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lenis', 'Framer Motion', 'Tailwind CSS'],
    liveUrl: 'https://aryan-sharma-portfolio-lake.vercel.app/',
    featured: true,
  },
  {
    repoName: 'vigil-cloud-security',
    id: 'vigil-cloud-security',
    title: 'VIGIL — CLOUD SECURITY INTELLIGENCE',
    summary:
      'Cloud security intelligence platform for monitoring, analysing and visualising security risk: interactive attack-path graphs with React Flow and telemetry charts over a FastAPI service.',
    category: 'CYBERSECURITY',
    tech: ['React', 'TypeScript', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'React Flow', 'Recharts'],
    liveUrl: 'https://vigil-cloud-security-frontend.vercel.app/',
    featured: true,
  },
  {
    repoName: 'Typing-car-race',
    id: 'typing-car-racer',
    title: '3D TYPING CAR RACER',
    summary:
      'A browser typing racing game where typing speed and accuracy become throttle. 3D race scenes run on React Three Fiber and Three.js, with a 2D campaign map across three worlds. In development: the first stage is playable and tested.',
    category: 'GAMES & EXPERIMENTS',
    tech: ['React', 'TypeScript', 'Vite', 'React Three Fiber', 'Three.js', 'Tailwind CSS'],
    liveUrl: 'https://3d-typing-racer-game.vercel.app/',
    featured: true,
  },
  {
    repoName: 'nexus-dashboard',
    id: 'nexus-dashboard',
    title: 'NEXUS DASHBOARD',
    summary:
      'A developer intelligence dashboard aggregating repository activity into searchable, charted insight for day-to-day engineering decisions.',
    category: 'AI & BACKEND',
    tech: ['JavaScript', 'React', 'Data Visualisation'],
    liveUrl: 'https://nexus-dashboard-l1q3.onrender.com/',
    featured: true,
  },
  {
    repoName: 'velora-fintech-landing-page',
    id: 'velora-fintech-landing-page',
    title: 'VELORA FINTECH LANDING PAGE',
    summary:
      'A premium fintech landing page exploring trust-first visual hierarchy, restrained motion and responsive product storytelling for a financial product.',
    category: 'WEB DEVELOPMENT',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/velora-fintech-landing-page/',
    featured: true,
  },

  {
    repoName: 'cyberdesk-incident-management-platform',
    id: 'cyberdesk-incident-management',
    title: 'CYBERDESK INCIDENT MANAGEMENT',
    summary:
      'A security operations incident management platform covering incident, alert, asset, investigation, task, audit and role-based access workflows.',
    category: 'CYBERSECURITY',
    tech: ['React', 'TypeScript', 'Incident Response', 'Role-Based Access'],
    liveUrl: 'https://cyberdesk-incident-management-platf-three.vercel.app',
    featured: false,
  },
  {
    repoName: 'Nexa-ai',
    id: 'nexa-ai',
    title: 'NEXA AI',
    summary:
      'An AI product interface experiment exploring conversational flows and prompt-driven UI patterns in a React and TypeScript front end.',
    category: 'AI & BACKEND',
    tech: ['React', 'TypeScript', 'AI Interface'],
    liveUrl: 'https://nexa-ai-fawn-eight.vercel.app',
    featured: false,
  },
  {
    repoName: 'haya-footwear',
    id: 'haya-footwear',
    title: 'HAYA — PREMIUM FOOTWEAR CONCEPT',
    summary:
      'A premium footwear concept storefront built as a design exercise, with an editorial product layout and scroll-led storytelling.',
    category: 'WEB DEVELOPMENT',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    liveUrl: 'https://haya-footwear.vercel.app',
    featured: false,
  },
  {
    repoName: 'portfolio-v3',
    id: 'portfolio-v3',
    title: 'PORTFOLIO V3',
    summary:
      'The third iteration of this portfolio, published through GitHub Pages as a step in the design and build history.',
    category: 'WEB DEVELOPMENT',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio-v3/',
    featured: false,
  },
  {
    repoName: 'portfolio-card',
    id: 'portfolio-card',
    title: 'PORTFOLIO CARD',
    summary:
      'A compact single-card portfolio layout built as a focused study in hierarchy, typography and restrained interaction.',
    category: 'WEB DEVELOPMENT',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    liveUrl: 'https://portfolio-card-lake.vercel.app/',
    featured: false,
  },
  {
    repoName: 'amber-hour',
    id: 'amber-hour',
    title: 'AMBER HOUR COFFEE CO.',
    summary:
      'A cinematic small-batch coffee brand experience with a scroll-driven brewing timeline and hardware-accelerated interaction.',
    category: 'WEB DEVELOPMENT',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/amber-hour/',
    featured: false,
  },

  {
    repoName: 'Responsive-Business-Landing-Page',
    id: 'responsive-business-landing-page',
    title: 'NORTHSTAR STUDIO LANDING',
    summary:
      'A responsive business landing page built with semantic HTML5, CSS3 and JavaScript as a layout and accessibility study.',
    category: 'WEB DEVELOPMENT',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/Responsive-Business-Landing-Page/',
    featured: false,
  },
  {
    repoName: 'aryan-portfolio-auth',
    id: 'aryan-portfolio-auth',
    title: 'PORTFOLIO AUTH SYSTEM',
    summary:
      'An accessible authentication client with client-side password strength validation, sanitisation and account recovery views.',
    category: 'WEB DEVELOPMENT',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Web Security'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-auth/auth-system/public/',
    featured: false,
  },
  {
    repoName: 'auth-client',
    id: 'auth-client',
    title: 'AUTH CLIENT',
    summary:
      'A reusable login and signup client with validation, error states and keyboard-accessible forms.',
    category: 'WEB DEVELOPMENT',
    tech: ['HTML', 'CSS', 'JavaScript', 'Forms'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/auth-client/',
    featured: false,
  },
  {
    repoName: 'portfolio',
    id: 'portfolio-v1',
    title: 'PORTFOLIO V1',
    summary:
      'The first published portfolio, kept as the starting point of the design and build progression.',
    category: 'WEB DEVELOPMENT',
    tech: ['CSS', 'HTML', 'JavaScript'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio/',
    featured: false,
  },
  {
    repoName: 'currpense',
    id: 'currpense',
    title: 'CURRPENSE',
    summary:
      'A currency and expense tracking tool for logging spend and converting amounts across currencies.',
    category: 'AI & BACKEND',
    tech: ['JavaScript', 'Finance', 'Tooling'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/currpense/',
    featured: false,
  },
  {
    repoName: 'calc',
    id: 'calc',
    title: 'SCIENTIFIC CALCULATOR',
    summary:
      'A scientific calculator with extended functions and a keyboard-driven input model.',
    category: 'GAMES & EXPERIMENTS',
    tech: ['JavaScript', 'Calculator', 'Tooling'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/calc/',
    featured: false,
  },
  {
    repoName: 'nissan-gtr-clone',
    id: 'nissan-gtr-clone',
    title: 'NISSAN GTR CLONE',
    summary:
      'A front-end automotive showcase experiment recreating a performance car product experience with HTML, CSS and animation.',
    category: 'GAMES & EXPERIMENTS',
    tech: ['HTML5', 'CSS3', 'Animation'],
    liveUrl: 'https://arayan11587kvrsodelhi-oss.github.io/nissan-gtr-clone/',
    featured: false,
  },
  {
    repoName: 'aryan',
    id: 'aryan-web-lab',
    title: 'ARYAN WEB LAB',
    summary:
      'A multi-page web experiment hub holding interactive canvas animations, physics prototypes and component studies.',
    category: 'GAMES & EXPERIMENTS',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Canvas'],
    liveUrl: 'https://aryan-sable.vercel.app',
    featured: false,
  },
  {
    repoName: 'cyber-tag-game',
    id: 'cyber-tag-game',
    title: 'CYBERTAG GAME',
    summary:
      'A browser game project presented through a neon cyber interface. Excluded from the featured collection.',
    category: 'GAMES & EXPERIMENTS',
    tech: ['React', 'Vite', 'Three.js', 'WebSocket'],
    liveUrl: 'https://cybertag-arena-game.vercel.app/',
    featured: false,
  },
]

/** Canonical registry, indexed by exact repository name. */
export const canonicalByRepoName = new Map(canonicalProjects.map((p) => [p.repoName, p]))

/** The six featured projects, in the exact required order. */
export const featuredProjects: CanonicalProject[] = FEATURED_ORDER.map((repoName) => {
  const found = canonicalByRepoName.get(repoName)
  if (!found) throw new Error(`Featured project "${repoName}" is missing from the canonical registry`)
  return found
})
