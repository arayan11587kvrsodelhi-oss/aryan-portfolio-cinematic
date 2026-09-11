import veloraImage from '../assets/photos/velora.png'
import amberHourImage from '../assets/photos/amber-hour.png'
import portfolioImage from '../assets/photos/portfolio.png'
import calculatorImage from '../assets/photos/calculator.png'
import portfolioCardImage from '../assets/photos/portfolio-card.png'
import portfolioAuthImage from '../assets/photos/portfolio-auth.png'
import businessLandingImage from '../assets/photos/business-landing.png'
import currpenseImage from '../assets/photos/currpense.png'
import authClientImage from '../assets/photos/auth-client.png'
import aryanImage from '../assets/photos/aryan-project.png'
import nissanImage from '../assets/photos/nissan.jpg'
import sentinelSocImage from '../assets/photos/sentinel-soc-v2.2.png'
import nexusDashboardImage from '../assets/photos/nexus-dashboard.png'

export type RepoCategory =
  | 'FEATURED'
  | 'CYBERSECURITY'
  | 'FINTECH'
  | 'FULL STACK'
  | 'WEB / FRONTEND'
  | 'CREATIVE EXPERIMENTS'
  | 'TOOLS'
  | 'LEARNING / EXPERIMENTAL'

export interface GitHubRepo {
  id: string
  name: string
  displayName: string
  githubUrl: string
  demoUrl?: string
  description: string
  primaryLanguage: 'TypeScript' | 'JavaScript' | 'HTML' | 'CSS'
  technologies: string[]
  category: RepoCategory
  status: string
  isFeatured: boolean
  isExperiment: boolean
  isSmallerProject: boolean
  createdAt: string
  updatedAt: string
  stars: number
  forks: number
  topics: string[]
  previewImage?: string
  readmeSnippet: string
  keyHighlights: string[]
  architecture: string
}

export const GITHUB_OWNER = 'arayan11587kvrsodelhi-oss'
export const GITHUB_PROFILE_URL = 'https://github.com/arayan11587kvrsodelhi-oss/'

export const githubRepos: GitHubRepo[] = [
  {
    id: 'sentinel-soc',
    name: 'sentinel-soc',
    displayName: 'SENTINEL SOC v2.2',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/sentinel-soc',
    demoUrl: 'https://sentinel-soc1.vercel.app/',
    description: 'A portfolio-grade Security Operations Center (SOC) platform that combines real-time telemetry simulation, automated incident correlation, live threat intelligence (NIST NVD + CISA KEV), MITRE ATT&CK mapping, and defensive AI analyst workflows.',
    primaryLanguage: 'TypeScript',
    technologies: ['TypeScript', 'Python', 'FastAPI', 'WebSockets', 'React', 'Vite', 'Tailwind CSS', 'SQLite', 'Docker', 'NIST NVD', 'CISA KEV', 'MITRE ATT&CK'],
    category: 'CYBERSECURITY',
    status: 'Flagship Platform',
    isFeatured: true,
    isExperiment: false,
    isSmallerProject: false,
    createdAt: '2026-08-23',
    updatedAt: '2026-09-07',
    stars: 0,
    forks: 0,
    topics: ['cybersecurity', 'soc', 'threat-intelligence', 'fastapi', 'websockets', 'mitre-attack'],
    previewImage: sentinelSocImage,
    readmeSnippet: 'Threat intelligence. Under control. Combines real-time telemetry simulation, automated incident correlation, live NIST NVD + CISA KEV feeds, and MITRE ATT&CK mapping.',
    keyHighlights: [
      'Bidirectional WebSocket event stream with heartbeat & reconnect',
      'Real public vulnerability feeds (NIST NVD API 2.0 & CISA KEV)',
      'Synthetic security event simulation (BRUTE_FORCE, EXPLOIT, RANSOMWARE)',
      'Incident management lifecycle across OPEN, INVESTIGATING, CONTAINED, RESOLVED',
      'Sentinel AI defensive analyst with MITRE ATT&CK mapping and forensic steps'
    ],
    architecture: 'FastAPI asynchronous backend + SQLite event store + React Vite frontend with real-time WebSocket telemetry.'
  },
  {
    id: 'nexus-dashboard',
    name: 'nexus-dashboard',
    displayName: 'NEXUS DASHBOARD',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/nexus-dashboard',
    demoUrl: 'https://nexus-dashboard-l1q3.onrender.com/',
    description: 'A developer intelligence dashboard powered by real GitHub API data — transforming public repositories, activity, and contribution metrics into live analytics.',
    primaryLanguage: 'JavaScript',
    technologies: ['Node.js', 'Express', 'GitHub API', 'JavaScript', 'HTML5', 'CSS3', 'Vitest', 'Render'],
    category: 'FULL STACK',
    status: 'Deployed Demo',
    isFeatured: true,
    isExperiment: false,
    isSmallerProject: false,
    createdAt: '2026-08-26',
    updatedAt: '2026-08-29',
    stars: 0,
    forks: 0,
    topics: ['developer-dashboard', 'github-api', 'analytics', 'nodejs', 'express'],
    previewImage: nexusDashboardImage,
    readmeSnippet: 'GitHub Developer Intelligence Dashboard powered by real GitHub data with a cached proxy layer.',
    keyHighlights: [
      'Live developer statistics and repository analytics via GitHub API',
      'Genuine activity timeline processing push, star, fork, and PR events',
      'Dynamic GitHub contribution heatmap built from public event streams',
      'Cache and rate-limit middleware with live / stale state monitoring',
      'Multi-theme support: Dark Cyber, Light Slate, and OLED High Contrast'
    ],
    architecture: 'Node.js Express backend proxying GitHub REST API with caching layer, paired with zero-dependency responsive frontend.'
  },
  {
    id: 'velora-fintech-landing-page',
    name: 'velora-fintech-landing-page',
    displayName: 'VELORA FINTECH',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/velora-fintech-landing-page',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/velora-fintech-landing-page/',
    description: 'A flagship modern fintech application built with high-performance UI engineering, interactive financial telemetry, simulated transactions, savings vault progress, and smooth momentum scrolling.',
    primaryLanguage: 'TypeScript',
    technologies: ['React 19', 'TypeScript', 'Vite', 'Tailwind CSS v4', 'Framer Motion', 'Lenis', 'Recharts', 'Lucide React'],
    category: 'FINTECH',
    status: 'Flagship Product',
    isFeatured: true,
    isExperiment: false,
    isSmallerProject: false,
    createdAt: '2026-08-19',
    updatedAt: '2026-08-21',
    stars: 0,
    forks: 0,
    topics: ['fintech', 'banking', 'framer-motion', 'lenis-scroll', 'tailwind-v4'],
    previewImage: veloraImage,
    readmeSnippet: 'Modern fintech product experience & digital banking prototype featuring interactive financial telemetry, simulated transactions, and spring physics.',
    keyHighlights: [
      'Interactive financial dashboard with dynamic balance visualization',
      'Simulated multi-currency fund transfers with instant ledger update',
      'Automated savings vaults with real-time target progression',
      'Comprehensive card security controls (freeze toggle, spend limits)',
      'Momentum scroll kinematics synchronized via Lenis & Framer Motion'
    ],
    architecture: 'React 19 + TypeScript + Tailwind CSS v4 with Framer Motion spring physics and Lenis smooth momentum scroll.'
  },
  {
    id: 'amber-hour',
    name: 'amber-hour',
    displayName: 'AMBER HOUR COFFEE CO.',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/amber-hour',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/amber-hour/',
    description: 'A concept site for a small-batch coffee roaster built around mindful visual storytelling, featuring interactive draggable roast curves, step-by-step ritual extraction timelines, and bespoke typography.',
    primaryLanguage: 'TypeScript',
    technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'IntersectionObserver'],
    category: 'CREATIVE EXPERIMENTS',
    status: 'Cinematic Concept',
    isFeatured: true,
    isExperiment: false,
    isSmallerProject: false,
    createdAt: '2026-08-17',
    updatedAt: '2026-08-18',
    stars: 0,
    forks: 0,
    topics: ['creative-web', 'roast-curve', 'editorial-design', 'framer-motion'],
    previewImage: amberHourImage,
    readmeSnippet: 'A concept site for a small-batch coffee roaster built around one idea: this brand is not for the rushed morning, but for the quiet craft before it.',
    keyHighlights: [
      'Interactive draggable roast curve mapping 6 temperature phases',
      'Scroll-filling ritual brewing timeline with step-by-step extraction guides',
      'Scroll-triggered cinematic reveals powered by native IntersectionObserver',
      'Refined editorial typography hierarchy and bespoke warm dark color harmonies'
    ],
    architecture: 'Vite + React + TypeScript with hardware-accelerated CSS transforms and touch-friendly draggable canvas.'
  },
  {
    id: 'aryan-portfolio-cinematic',
    name: 'aryan-portfolio-cinematic',
    displayName: 'ARYAN PORTFOLIO CINEMATIC',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-cinematic',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-cinematic/',
    description: 'Personal creative engineering portfolio focused on cinematic scrolling choreography, GSAP ScrollTrigger timeline orchestration, Lenis smooth scrolling, and structured technical showcases.',
    primaryLanguage: 'TypeScript',
    technologies: ['React', 'TypeScript', 'Vite', 'GSAP', 'ScrollTrigger', 'Lenis', 'Tailwind CSS', 'Framer Motion'],
    category: 'WEB / FRONTEND',
    status: 'Primary Portfolio',
    isFeatured: true,
    isExperiment: false,
    isSmallerProject: false,
    createdAt: '2026-08-13',
    updatedAt: '2026-09-03',
    stars: 0,
    forks: 0,
    topics: ['portfolio', 'cinematic', 'gsap', 'scrolltrigger', 'lenis'],
    previewImage: portfolioImage,
    readmeSnippet: 'A Vite + React + TypeScript portfolio focused on cinematic scrolling and interaction: GSAP + ScrollTrigger, Lenis smooth scrolling, scroll-driven portrait morph.',
    keyHighlights: [
      'Synchronized GSAP ScrollTrigger and Lenis smooth momentum scrolling',
      'Scroll-driven portrait morph and staggered typography reveals',
      'Interactive project modal drawers with keyboard accessibility',
      'Desktop custom trailing cursor with contextual interaction states'
    ],
    architecture: 'React + TypeScript + Vite with GSAP ScrollTrigger animation pipeline and Lenis momentum physics.'
  },
  {
    id: 'calc',
    name: 'calc',
    displayName: 'SCIENTIFIC CALCULATOR',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/calc',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/calc/',
    description: 'A focused, responsive mathematical calculator providing standard arithmetic, trigonometric, logarithmic functions, degree/radian mode switching, and keyboard-friendly execution.',
    primaryLanguage: 'JavaScript',
    technologies: ['JavaScript', 'HTML5', 'CSS3'],
    category: 'TOOLS',
    status: 'Completed Utility',
    isFeatured: false,
    isExperiment: false,
    isSmallerProject: true,
    createdAt: '2026-07-16',
    updatedAt: '2026-07-22',
    stars: 0,
    forks: 0,
    topics: ['calculator', 'scientific-calculator', 'javascript', 'math-parser'],
    previewImage: calculatorImage,
    readmeSnippet: 'Browser-based scientific calculator with trigonometric, logarithmic, and parenthesis parsing.',
    keyHighlights: [
      'Comprehensive trigonometric and logarithmic scientific functions',
      'Degree and Radian angle computation toggle',
      'Full keyboard listener support for rapid calculation',
      'Parenthesis hierarchy evaluation and calculation memory'
    ],
    architecture: 'Pure vanilla JavaScript mathematical parser with responsive CSS grid keypad.'
  },
  {
    id: 'currpense',
    name: 'currpense',
    displayName: 'CURRPENSE',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/currpense',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/currpense/',
    description: 'A clean, lightweight currency conversion and expense calculation tool supporting major global currencies with reactive input controls and instant calculation.',
    primaryLanguage: 'JavaScript',
    technologies: ['JavaScript', 'HTML5', 'CSS3'],
    category: 'TOOLS',
    status: 'Completed Utility',
    isFeatured: false,
    isExperiment: false,
    isSmallerProject: true,
    createdAt: '2026-07-21',
    updatedAt: '2026-07-21',
    stars: 0,
    forks: 0,
    topics: ['currency-converter', 'calculator', 'utility', 'javascript'],
    previewImage: currpenseImage,
    readmeSnippet: 'Rapid real-time currency exchange conversion and expense calculator utility.',
    keyHighlights: [
      'Multi-currency dropdown selection and swapping',
      'Real-time conversion calculation as user types',
      'Accurate numerical input filtering and formatting',
      'Clean minimalist interface'
    ],
    architecture: 'Lightweight client-side currency calculator with zero external dependencies.'
  },
  {
    id: 'auth-client',
    name: 'auth-client',
    displayName: 'AUTH CLIENT',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/auth-client',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/auth-client/',
    description: 'A purpose-built authentication client featuring sign-in, account creation, password recovery, password visibility toggle, and client-side password strength verification.',
    primaryLanguage: 'HTML',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'WEB / FRONTEND',
    status: 'Active Experiment',
    isFeatured: false,
    isExperiment: true,
    isSmallerProject: true,
    createdAt: '2026-07-16',
    updatedAt: '2026-07-16',
    stars: 0,
    forks: 0,
    topics: ['login-page', 'authentication', 'form-validation', 'ui'],
    previewImage: authClientImage,
    readmeSnippet: 'Authentication client interface with login, registration, and forgot password screens.',
    keyHighlights: [
      'Login, registration, and forgot-password flows',
      'Interactive password visibility toggle and strength meter',
      'Client-side sanitization and error messaging',
      'Keyboard-accessible form inputs with clear focus rings'
    ],
    architecture: 'Semantic HTML5 multi-view form architecture with modular CSS and client validation.'
  },
  {
    id: 'aryan-portfolio-auth',
    name: 'aryan-portfolio-auth',
    displayName: 'PORTFOLIO AUTH SYSTEM',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-auth',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-auth/auth-system/public/',
    description: 'A multi-view developer portfolio system integrated with user authentication entry points, registration flows, protected views, and developer project showcases.',
    primaryLanguage: 'CSS',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'WEB / FRONTEND',
    status: 'Active Experiment',
    isFeatured: false,
    isExperiment: true,
    isSmallerProject: true,
    createdAt: '2026-08-08',
    updatedAt: '2026-08-08',
    stars: 0,
    forks: 0,
    topics: ['portfolio', 'auth-system', 'login-flow'],
    previewImage: portfolioAuthImage,
    readmeSnippet: 'Developer portfolio integrated with client authentication workflows.',
    keyHighlights: [
      'Dedicated login and registration viewports',
      'Client-side form validation with real-time error handling',
      'Complete about, skills, projects, and contact sections',
      'Responsive layout across mobile and desktop breakpoints'
    ],
    architecture: 'Multi-screen portfolio layout integrating authentication state flows.'
  },
  {
    id: 'portfolio-card',
    name: 'portfolio-card',
    displayName: 'PORTFOLIO CARD',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/portfolio-card',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio-card/',
    description: 'A compact, shareable digital business card communicating core skills, availability status, and social entry points with electric border glow effects.',
    primaryLanguage: 'CSS',
    technologies: ['CSS3', 'HTML5', 'JavaScript', 'BorderGlow.js'],
    category: 'CREATIVE EXPERIMENTS',
    status: 'Interactive Component',
    isFeatured: false,
    isExperiment: true,
    isSmallerProject: true,
    createdAt: '2026-08-05',
    updatedAt: '2026-08-18',
    stars: 0,
    forks: 0,
    topics: ['card-interactions', 'electric-border', 'glow-effect'],
    previewImage: portfolioCardImage,
    readmeSnippet: 'Minimalist developer profile card featuring electric border and glow shader interactions.',
    keyHighlights: [
      'Electric border animation with dynamic mouse tracking',
      'Live availability status indicator',
      'Concise developer introduction and stack breakdown',
      'Lightweight sub-50KB bundle for instant rendering'
    ],
    architecture: 'Custom canvas-based electric border shader and responsive CSS card container.'
  },
  {
    id: 'portfolio',
    name: 'portfolio',
    displayName: 'PORTFOLIO V1',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/portfolio',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio/',
    description: 'Initial personal developer portfolio iteration establishing foundational web layout, navigation, and project presentation.',
    primaryLanguage: 'CSS',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'LEARNING / EXPERIMENTAL',
    status: 'Early Milestone',
    isFeatured: false,
    isExperiment: true,
    isSmallerProject: true,
    createdAt: '2026-08-06',
    updatedAt: '2026-08-07',
    stars: 0,
    forks: 0,
    topics: ['portfolio', 'v1', 'web-development'],
    previewImage: portfolioImage,
    readmeSnippet: 'Foundational portfolio iteration demonstrating core HTML5/CSS3 layout fundamentals.',
    keyHighlights: [
      'Clean CSS grid and flexbox layout structures',
      'Responsive navigation and mobile drawer',
      'Early project showcase and contact channels'
    ],
    architecture: 'Semantic HTML5 structure and custom CSS styling.'
  },
  {
    id: 'nissan-gtr-clone',
    name: 'nissan-gtr-clone',
    displayName: 'NISSAN GTR CLONE',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/nissan-gtr-clone',
    description: 'An aggressive, high-contrast automotive web study inspired by the Nissan GT-R, exploring vehicle specifications, engineering telemetry, and dark mode visuals.',
    primaryLanguage: 'HTML',
    technologies: ['HTML5', 'CSS3', 'JavaScript'],
    category: 'CREATIVE EXPERIMENTS',
    status: 'Design Exploration',
    isFeatured: false,
    isExperiment: true,
    isSmallerProject: true,
    createdAt: '2026-08-13',
    updatedAt: '2026-08-14',
    stars: 0,
    forks: 0,
    topics: ['automotive', 'nissan-gtr', 'dark-ui'],
    previewImage: nissanImage,
    readmeSnippet: 'High-contrast automotive visual study exploring performance specs and motorsport aesthetic.',
    keyHighlights: [
      'High-contrast dark automotive visual direction',
      'Performance specification highlights (0-100 km/h, Twin-Turbo V6 specs)',
      'Responsive visual layout with clean vehicle photography'
    ],
    architecture: 'Responsive dark-theme showcase page with structured telemetry cards.'
  },
  {
    id: 'Responsive-Business-Landing-Page',
    name: 'Responsive-Business-Landing-Page',
    displayName: 'NORTHSTAR STUDIO LANDING',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/Responsive-Business-Landing-Page',
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/Responsive-Business-Landing-Page/',
    description: 'A sleek business landing page concept for Northstar Studio showcasing services, case-study highlights, and pricing tiers.',
    primaryLanguage: 'HTML',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'SEO Meta'],
    category: 'WEB / FRONTEND',
    status: 'Completed Landing Page',
    isFeatured: false,
    isExperiment: false,
    isSmallerProject: true,
    createdAt: '2026-08-03',
    updatedAt: '2026-08-03',
    stars: 0,
    forks: 0,
    topics: ['landing-page', 'business', 'agency', 'responsive'],
    previewImage: businessLandingImage,
    readmeSnippet: 'Sleek responsive business and creative agency landing page with pricing tiers and services.',
    keyHighlights: [
      'Structured services and capability breakdown',
      'Interactive pricing tiers with feature comparisons',
      'Curated portfolio case study showcase',
      'Fully responsive mobile navigation and layout'
    ],
    architecture: 'SEO-ready HTML5 page structure with sitemap.xml, robots.txt, and responsive CSS3.'
  },
  {
    id: 'aryan',
    name: 'aryan',
    displayName: 'ARYAN WEB LAB',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan',
    demoUrl: 'https://aryan-sable.vercel.app',
    description: 'A multi-page web experimental playground containing interactive bulb animations, dashboard views, e-commerce prototypes, and security experiments deployed on Vercel.',
    primaryLanguage: 'HTML',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Vercel'],
    category: 'LEARNING / EXPERIMENTAL',
    status: 'Multi-Page Lab',
    isFeatured: false,
    isExperiment: true,
    isSmallerProject: true,
    createdAt: '2026-02-26',
    updatedAt: '2026-07-16',
    stars: 0,
    forks: 0,
    topics: ['web-lab', 'experiments', 'animation', 'vercel'],
    previewImage: aryanImage,
    readmeSnippet: 'Multi-page web experiment hub featuring interactive canvas animations and component prototypes.',
    keyHighlights: [
      'Deployed on Vercel with automated CI/CD',
      'Interactive bulb physics and toggle animations',
      'Prototype dashboard, e-commerce, and password views',
      'Fast lightweight bundle and asset optimization'
    ],
    architecture: 'Multi-entry HTML5/CSS3/JavaScript laboratory repository.'
  }
]

export const REPO_CATEGORIES: RepoCategory[] = [
  'FEATURED',
  'CYBERSECURITY',
  'FINTECH',
  'FULL STACK',
  'WEB / FRONTEND',
  'CREATIVE EXPERIMENTS',
  'TOOLS',
  'LEARNING / EXPERIMENTAL'
]

export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  HTML: '#e34f26',
  CSS: '#563d7c',
  Python: '#3572A5'
}
