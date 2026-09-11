import veloraImage from '../assets/photos/velora.png'
import amberHourImage from '../assets/photos/amber-hour.png'
import portfolioImage from '../assets/photos/portfolio.png'
import sentinelSocImage from '../assets/photos/sentinel-soc-v2.2.png'
import nexusDashboardImage from '../assets/photos/nexus-dashboard.png'
export interface Project {
  id: string
  number: string
  title: string
  category: string
  tagline: string
  description: string
  problemSolved: string
  keyFeatures: string[]
  architectureDetails?: string[]
  myContribution: string
  tech: string[]
  image: string
  demoUrl?: string
  githubUrl: string
  accentNote: string
  featured: boolean
  badge?: string
}

export const projects: Project[] = [
  {
    id: 'sentinel-soc',
    number: '01',
    title: 'SENTINEL SOC v2.2',
    category: 'CYBERSECURITY / FULL STACK',
    tagline: 'THREAT INTELLIGENCE. UNDER CONTROL.',
    description: 'A portfolio-grade Security Operations Center platform combining real-time telemetry simulation, automated incident correlation, live threat intelligence (NIST NVD + CISA KEV), MITRE ATT&CK mapping, and defensive AI analyst workflows.',
    problemSolved: 'Bridges live public threat intelligence feeds with synthetic real-time security telemetry, enabling rapid threat triage, attack-chain correlation, and AI-guided incident response without requiring live production compromises.',
    keyFeatures: [
      'Real Public Vulnerability Intelligence: Ingests NIST NVD API 2.0 & CISA Known Exploited Vulnerabilities (KEV) with CVSS v3.1/v4.0 scoring, CWE tracking, and ransomware indicators',
      'Real-Time WebSocket Event Bus: Bidirectional telemetry stream with heartbeat ping-pong, latency monitoring, and automatic exponential backoff reconnect',
      'Security Telemetry Simulation: High-fidelity synthetic event generation modeling BRUTE_FORCE, EXPLOIT_ATTEMPT, PORT_SCAN, SUSPICIOUS_LOGIN, and RANSOMWARE_ACTIVITY',
      'Event Correlation Engine: Sliding time-window pattern matching, attack-chain correlation, and unified incident timelines',
      'Incident Management Lifecycle: Structured incident tracking progressing through OPEN, INVESTIGATING, CONTAINED, and RESOLVED states',
      'Sentinel AI Defensive Analyst: AI-assisted defensive triage, 0–100 risk scoring, MITRE ATT&CK mapping, containment recommendations, and forensic steps',
      'SOC Forensics UI: Interactive Event Detail & Incident Investigation Drawers, Vulnerability Dossier, network flow views, and MITRE technique matrices'
    ],
    architectureDetails: [
      'FastAPI backend with asynchronous WebSocket bus, synthetic telemetry generator, and SQLite event store',
      'NIST NVD API 2.0 & CISA KEV catalog integration with cached intelligence synchronization',
      'Sentinel AI defensive triage engine with MITRE ATT&CK technique mapping and forensic remediation',
      'React + Vite frontend with Tailwind CSS, responsive drawer interfaces, and real-time threat metrics'
    ],
    myContribution: 'Built the full-stack Security Operations Center demo, including the FastAPI WebSocket telemetry engine, threat-intelligence ingestion, correlation rules, Sentinel AI analysis modules, and the interactive React forensic dashboard. Personal portfolio project — not an enterprise production SOC.',
    tech: ['Python', 'FastAPI', 'WebSockets', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'NIST NVD', 'CISA KEV', 'MITRE ATT&CK', 'SQLite', 'Docker'],
    image: sentinelSocImage,
    demoUrl: 'https://sentinel-soc1.vercel.app/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/sentinel-soc',
    accentNote: 'Security Operations Center',
    featured: true,
    badge: 'SECURITY OPERATIONS CENTER'
  },
  {
    id: 'velora',
    number: '02',
    title: 'VELORA',
    category: 'FINTECH / FRONTEND CONCEPT',
    tagline: 'Banking clarity, explored as a concept',
    description: 'A fintech landing-page concept prototype with animated financial visualizations, product storytelling, and a deployable marketing experience.',
    problemSolved: 'Explores how a banking product story can be communicated through interactive landing-page design, animated data visualization, and a deployed demo.',
    keyFeatures: [
      'Interactive financial dashboard with dynamic balance visualization graphs',
      'Simulated multi-currency fund transfers with instant ledger recalculation',
      'Automated savings vaults with real-time target progression tracking',
      'Comprehensive card security suite (freeze toggle, spend limits, virtual card generation)',
      'Intelligent spending breakdown analytics by category and month',
      'Responsive design optimized across 320px mobile to 4K ultra-wide monitors'
    ],
    architectureDetails: [
      'State-driven prototype with optimistic UI feedback',
      'Momentum scroll kinematics synchronized via Lenis',
      'Framer Motion spring physics for card transitions',
      'Modular TypeScript structure organized for future iteration'
    ],
    myContribution: 'Designed the interface, built the landing-page prototype, and implemented the calculators, visualizations, and responsive layouts.',
    tech: ['JavaScript', 'HTML5', 'CSS3', 'Vercel', 'GitHub Pages', 'SEO Meta'],
    image: veloraImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/velora-fintech-landing-page/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/velora-fintech-landing-page',
    accentNote: 'Your money. Your momentum.',
    featured: true,
    badge: 'FLAGSHIP PRODUCT'
  },
  {
    id: 'nexus-dashboard',
    number: '03',
    title: 'NEXUS DASHBOARD',
    category: 'DEVELOPER INTELLIGENCE',
    tagline: 'GitHub Developer Intelligence Dashboard',
    description: 'A developer dashboard experiment powered by real GitHub API data — turning a public profile, repositories, and activity into an analytics-style interface.',
    problemSolved: 'Explores how public GitHub data — repositories, stars, forks, activity, and languages — can be consolidated into one self-updating dashboard view without fabricated metrics.',
    keyFeatures: [
      'Live developer statistics, repository intelligence, and analytics derived from real GitHub API responses',
      'Repository search and filtering with language, topic, recency, star, and fork sorting',
      'Genuine activity timeline processing push, star, fork, PR, issue, and release events',
      'GitHub-style contribution heatmap built from available public event data',
      'Live / Synced / Stale / Offline data-state system with relative sync timestamps',
      'Multiple interface themes — Dark Cyber, Light Slate, and OLED High Contrast',
      'Fully responsive mobile experience with keyboard shortcuts across the dashboard'
    ],
    architectureDetails: [
      'Node.js + Express backend proxying the GitHub API with a cache layer and rate limiting',
      'Server-side dashboard payload served over /api/v1/* endpoints',
      'Vanilla HTML / CSS / JS frontend for a dependency-light bundle',
      'Deployed on Render with automatic sync intervals'
    ],
    myContribution: 'Designed and built the dashboard — the Express/GitHub service layer, cache and rate-limit middleware, activity pipeline, heatmap visualization, and responsive frontend.',
    tech: ['Node.js', 'Express', 'REST API', 'JavaScript', 'HTML5', 'CSS3', 'GitHub API', 'Render'],
    image: nexusDashboardImage,
    demoUrl: 'https://nexus-dashboard-l1q3.onrender.com/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/nexus-dashboard',
    accentNote: 'Live developer intelligence',
    featured: true,
    badge: 'REAL-TIME ANALYTICS'
  },
  {
    id: 'amber-hour',
    number: '04',
    title: 'AMBER HOUR',
    category: 'CREATIVE WEB EXPERIENCE',
    tagline: 'Cinematic Small-Batch Artisanal Coffee Experience',
    description: 'An atmospheric visual storytelling web experience capturing the craft and mindfulness of specialty coffee brewing through responsive typography, physics-based interactions, and cinematic design.',
    problemSolved: 'Explores how an artisanal coffee concept can be presented as a tactile digital narrative about the precision and patience of specialty brewing.',
    keyFeatures: [
      'Interactive draggable roast curve mapping 6 precise roasting temperature phases',
      'Scroll-filling ritual brewing timeline with step-by-step extraction guides',
      'Scroll-triggered cinematic reveals powered by native IntersectionObserver',
      'Refined editorial typography hierarchy and bespoke warm dark color harmonies',
      'Progressive media handling with explicit dimensions to reduce layout shift'
    ],
    architectureDetails: [
      'Hardware-accelerated CSS transforms and requestAnimationFrame loops',
      'Dynamic CSS custom variables synchronized with React state',
      'Mobile-optimized touch physics for gesture-based roasting curves'
    ],
    myContribution: 'Directed the visual aesthetic, engineered custom interactive roasting curves, and implemented the full responsive web experience.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    image: amberHourImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/amber-hour/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/amber-hour',
    accentNote: 'Small batch / first light',
    featured: true,
    badge: 'CINEMATIC EXPERIENCE'
  },
  {
    id: 'aryan-sharma-portfolio',
    number: '05',
    title: 'ARYAN PORTFOLIO CINEMATIC',
    category: 'CREATIVE DEVELOPMENT',
    tagline: 'Cinematic Developer Portfolio & Interaction Laboratory',
    description: 'Personal creative engineering portfolio highlighting interactive web development, high-fidelity motion choreography, and structured technical showcases.',
    problemSolved: 'Establishes a distinctive digital presence that highlights technical rigor as a BCA student alongside high-craft creative frontend and motion engineering.',
    keyFeatures: [
      'Synchronized GSAP ScrollTrigger and Lenis smooth scrolling',
      'Framer Motion spring physics and staggered typography reveals',
      'Interactive case study deep-dive modal system with focus management',
      'Desktop custom trailing cursor with contextual interaction states',
      'Reduced-motion support via prefers-reduced-motion'
    ],
    architectureDetails: [
      'Semantic HTML5 structure with accessible contrast and focus states',
      'Strict TypeScript type safety and modular components'
    ],
    myContribution: 'Designed the visual identity, implemented the motion systems, and built the complete web application.',
    tech: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lenis', 'Framer Motion', 'Tailwind CSS'],
    image: portfolioImage,
    demoUrl: 'https://aryan-sharma-portfolio-lake.vercel.app/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-cinematic',
    accentNote: 'Creative developer identity',
    featured: true,
    badge: 'PORTFOLIO V2'
  },
]
