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

export interface Project {
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
  githubUrl?: string
  accentNote: string
  featured: boolean
  badge?: string
}

export const projects: Project[] = [
  {
    number: '01',
    title: 'VELORA',
    category: 'Fintech Product',
    tagline: 'Modern Banking & Financial Telemetry Prototype',
    description: 'A flagship modern fintech application built with high-performance UI engineering, interactive financial telemetry, simulated transactions, savings vault logic, and smooth momentum scrolling.',
    problemSolved: 'Transforms complex multi-currency banking and personal money management into an intuitive, high-clarity digital interface. Eliminates fragmented financial tracking through a unified real-time dashboard.',
    keyFeatures: [
      'Interactive financial dashboard with dynamic balance visualization graphs',
      'Simulated multi-currency fund transfers with instant ledger recalculation',
      'Automated savings vaults with real-time target progression tracking',
      'Comprehensive card security suite (freeze toggle, spend limits, virtual card generation)',
      'Intelligent spending breakdown analytics by category and month',
      'Responsive design optimized across 320px mobile to 4K ultra-wide monitors'
    ],
    architectureDetails: [
      'State-driven simulation engine with optimistic UI feedback',
      'Momentum scroll kinematics synchronized via Lenis',
      'Framer Motion spring physics for 60fps card transitions',
      'Modular TypeScript architecture structured for scalable enterprise growth'
    ],
    myContribution: 'Architected the complete product interface, state simulation models, data visualization components, and frontend motion design.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lenis'],
    image: veloraImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/velora-fintech-landing-page/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/velora-fintech-landing-page',
    accentNote: 'Your money. Your momentum.',
    featured: true,
    badge: 'FLAGSHIP PRODUCT'
  },
  {
    number: '02',
    title: 'AMBER HOUR',
    category: 'Creative Web',
    tagline: 'Cinematic Small-Batch Artisanal Coffee Experience',
    description: 'An atmospheric visual storytelling web experience capturing the craft and mindfulness of specialty coffee brewing through responsive typography, physics-based interactions, and cinematic design.',
    problemSolved: 'Elevates an artisanal consumer brand beyond traditional static catalogs into an engaging, tactile digital narrative that evokes the precision, aroma, and patience of specialty coffee.',
    keyFeatures: [
      'Interactive draggable roast curve mapping 6 precise roasting temperature phases',
      'Scroll-filling ritual brewing timeline with step-by-step extraction guides',
      'Scroll-triggered cinematic reveals powered by native IntersectionObserver',
      'Refined editorial typography hierarchy and bespoke warm dark color harmonies',
      'Progressive media handling with zero layout shift (CLS: 0)'
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
    number: '03',
    title: 'ARYAN SHARMA PORTFOLIO',
    category: 'Creative Development',
    tagline: 'Cinematic Developer Portfolio & Interaction Laboratory',
    description: 'Personal creative engineering portfolio highlighting interactive web development, high-fidelity motion choreography, and structured technical showcases.',
    problemSolved: 'Establishes a distinctive digital presence that highlights technical rigor as a BCA student alongside high-craft creative frontend and motion engineering.',
    keyFeatures: [
      'Synchronized GSAP ScrollTrigger and Lenis smooth momentum scrolling',
      'Framer Motion spring physics and staggered typography reveals',
      'Interactive case study deep-dive modal system with focus management',
      'Desktop custom trailing cursor with contextual interaction states',
      'Complete accessibility compliance with prefers-reduced-motion support'
    ],
    architectureDetails: [
      'Zero unnecessary third-party dependencies for minimal bundle weight',
      'Full semantic HTML5 structure and WCAG-compliant contrast levels',
      'Strict TypeScript type safety and modular components'
    ],
    myContribution: 'Designed the visual identity, implemented all motion systems, and built the complete web application.',
    tech: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lenis', 'Framer Motion', 'Tailwind CSS'],
    image: portfolioImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-cinematic/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-cinematic',
    accentNote: 'Creative developer identity',
    featured: true,
    badge: 'PORTFOLIO V2'
  },
  {
    number: '04',
    title: 'SCIENTIFIC CALCULATOR',
    category: 'Tools & Utilities',
    tagline: 'Browser-Based Scientific & Mathematical Computing Tool',
    description: 'A focused, responsive mathematical calculator providing standard arithmetic, scientific functions, degree/radian mode switching, and keyboard-friendly execution.',
    problemSolved: 'Delivers an instant, distraction-free calculation tool directly in the browser with precise order-of-operations parsing.',
    keyFeatures: [
      'Comprehensive trigonometric and logarithmic scientific functions',
      'Degree and Radian angle computation toggle',
      'Full keyboard listener support for rapid calculation',
      'Parenthesis hierarchy evaluation and calculation memory'
    ],
    myContribution: 'Engineered the calculator parser logic and responsive tactile keypad interface.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: calculatorImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/calc/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/calc',
    accentNote: 'Mathematical tool',
    featured: true
  },
  {
    number: '05',
    title: 'PORTFOLIO CARD',
    category: 'Personal Branding',
    tagline: 'Minimalist Interactive Developer Profile Card',
    description: 'A compact, shareable digital business card communicating core skills, availability status, and social entry points with clean typography and instant load times.',
    problemSolved: 'Provides a lightweight, highly portable profile snippet for quick introductions across developer communities and hiring managers.',
    keyFeatures: [
      'Live availability status indicator',
      'Concise developer introduction and stack breakdown',
      'Direct social and GitHub profile links',
      'Lightweight sub-50KB bundle for instant rendering'
    ],
    myContribution: 'Designed and coded the minimal card interface.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Git'],
    image: portfolioCardImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio-card/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/portfolio-card',
    accentNote: 'Developer identity',
    featured: true
  },
  {
    number: '06',
    title: 'NISSAN GTR CLONE',
    category: 'Automotive Web',
    tagline: 'Automotive Digital Experience & Performance Showcase',
    description: 'An aggressive, high-contrast automotive web study inspired by the legendary Nissan GT-R, exploring vehicle specifications, engineering data, and dark mode visuals.',
    problemSolved: 'Translates motorsport aesthetic aggression and telemetry data into a structured web interface.',
    keyFeatures: [
      'High-contrast dark automotive visual direction',
      'Performance specification highlights (0-100 km/h, Twin-Turbo V6 specs)',
      'Responsive visual layout with clean vehicle photography'
    ],
    myContribution: 'Built the standalone automotive presentation page.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: nissanImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/nissan-gtr-clone/ezgif-5e46aafc1c78ffbc-jpg',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/nissan-gtr-clone',
    accentNote: 'Automotive study',
    featured: true
  },
  {
    number: '07',
    title: 'PORTFOLIO AUTH SYSTEM',
    category: 'Web Security',
    tagline: 'Full-Featured Developer Portfolio with Integrated Authentication',
    description: 'A comprehensive multi-view portfolio system integrated with user authentication entry points, registration flows, protected views, and developer project showcases.',
    problemSolved: 'Demonstrates the convergence of client-side portfolio presentation with structured authentication screens and input validation.',
    keyFeatures: [
      'Dedicated login and registration viewports',
      'Client-side form validation with real-time error handling',
      'Complete about, skills, projects, and contact sections',
      'Responsive layout across mobile and desktop breakpoints'
    ],
    myContribution: 'Developed the complete authentication UI workflows and portfolio integration.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: portfolioAuthImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-auth/auth-system/public/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-auth',
    accentNote: 'Portfolio & auth flow',
    featured: true
  },
  {
    number: '08',
    title: 'NORTHSTAR STUDIO LANDING',
    category: 'Landing Page',
    tagline: 'Responsive Business & Creative Agency Landing Page',
    description: 'A sleek, conversion-focused business landing page created for Northstar Studio showcasing creative services, case study highlights, client testimonials, and pricing tiers.',
    problemSolved: 'Provides a structured, professional agency landing page layout that guides prospective clients through services, proof of work, and clear calls to action.',
    keyFeatures: [
      'Structured services and capability breakdown',
      'Interactive pricing tiers with feature comparisons',
      'Curated portfolio case study showcase',
      'Fully responsive mobile navigation and layout'
    ],
    myContribution: 'Designed and implemented the Northstar Studio landing page.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: businessLandingImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/Responsive-Business-Landing-Page/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/Responsive-Business-Landing-Page',
    accentNote: 'Northstar Studio',
    featured: false
  },
  {
    number: '09',
    title: 'CURRPENSE',
    category: 'Tools & Utilities',
    tagline: 'Rapid Real-Time Currency Exchange Calculator',
    description: 'A clean, lightweight currency conversion application supporting major global currencies with intuitive input controls and instant calculation.',
    problemSolved: 'Eliminates the clutter of traditional exchange calculators with a fast, lightweight, and responsive browser utility.',
    keyFeatures: [
      'Multi-currency dropdown selection and swapping',
      'Real-time conversion calculation as user types',
      'Accurate numerical input filtering and formatting',
      'Clean minimalist interface'
    ],
    myContribution: 'Built the currency calculation logic and user interface.',
    tech: ['JavaScript', 'HTML5', 'CSS3'],
    image: currpenseImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/currpense/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/currpense',
    accentNote: 'Currency converter',
    featured: false
  },
  {
    number: '10',
    title: 'AUTH CLIENT',
    category: 'Web Security',
    tagline: 'Secure Authentication & Account Recovery Client Interface',
    description: 'A purpose-built authentication client featuring sign-in, account creation, password recovery, and client-side password strength verification.',
    problemSolved: 'Provides a reusable, accessible, and secure user entry gateway following modern UX standards for authentication.',
    keyFeatures: [
      'Login, registration, and forgot-password flows',
      'Interactive password visibility toggle and strength meter',
      'Client-side sanitization and error messaging',
      'Keyboard-accessible form inputs with clear focus rings'
    ],
    myContribution: 'Built the authentication interface and validation behaviors.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: authClientImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/auth-client/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/auth-client',
    accentNote: 'Security interface',
    featured: true
  },
  {
    number: '11',
    title: 'ARYAN WEB EXPERIMENT',
    category: 'Web Development',
    tagline: 'Standalone Experimental Web Application',
    description: 'A published web experiment exploring layout techniques, typography, and interactive components deployed on Vercel.',
    problemSolved: 'A testing ground for cutting-edge CSS layouts and frontend experiments.',
    keyFeatures: [
      'Deployed on Vercel with automated CI/CD',
      'Fast lightweight bundle and asset optimization',
      'Modern responsive container architecture'
    ],
    myContribution: 'Built and deployed the experimental project.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: aryanImage,
    demoUrl: 'https://aryan-sable.vercel.app',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan',
    accentNote: 'Web experiment',
    featured: false
  }
]
