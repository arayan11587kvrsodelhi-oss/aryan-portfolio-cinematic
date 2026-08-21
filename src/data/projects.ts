import veloraImage from '../assets/photos/velora.png'
import amberHourImage from '../assets/photos/amber-hour.png'
import portfolioImage from '../assets/photos/portfolio.png'
import calculatorImage from '../assets/photos/calculator.png'
import portfolioCardImage from '../assets/photos/portfolio-card.png'
import portfolioV3Image from '../assets/photos/portfolio-v3.png'
import portfolioAuthImage from '../assets/photos/portfolio-auth.png'
import portfolioClassicImage from '../assets/photos/portfolio-classic.png'
import businessLandingImage from '../assets/photos/business-landing.png'
import currpenseImage from '../assets/photos/currpense.png'
import authClientImage from '../assets/photos/auth-client.png'
import aryanImage from '../assets/photos/aryan-project.png'
import nissanImage from '../assets/photos/nissan.jpg'

export interface Project {
  number: string
  title: string
  category: string
  description: string
  problemSolved: string
  keyFeatures: string[]
  myContribution: string
  tech: string[]
  image: string
  demoUrl?: string
  githubUrl?: string
  accentNote: string
  featured: boolean
}

export const projects: Project[] = [
  {
    number: '01', title: 'VELORA', category: 'Fintech',
    description: 'A modern fintech product prototype with an interactive financial dashboard, simulated transactions, savings, financial insights, smooth scrolling and premium UI interactions.',
    problemSolved: 'A product prototype for spending smarter, saving effortlessly, and staying in control from one intelligent platform.',
    keyFeatures: ['Interactive financial dashboard', 'Simulated transactions and savings', 'Financial insights', 'Smooth scrolling and premium UI interactions'],
    myContribution: 'Product prototype and frontend experience.',
    tech: ['React', 'TypeScript', 'Vite', 'CSS / Tailwind', 'Lenis', 'Framer Motion', 'Recharts'],
    image: veloraImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/velora-fintech-landing-page/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/velora-fintech-landing-page',
    accentNote: 'Your money. Your momentum.', featured: true
  },
  {
    number: '02', title: 'AMBER HOUR', category: 'Creative Web',
    description: 'A cinematic coffee experience focused on immersive visual storytelling, animation and premium web interactions.',
    problemSolved: 'A small-batch coffee concept for the slow part of the morning: the kettle, the window, and the ten minutes before anything else starts.',
    keyFeatures: ['Draggable roast curve with six roast stages', 'Scroll-triggered reveals', 'Scroll-filling ritual timeline', 'Native IntersectionObserver and requestAnimationFrame motion'],
    myContribution: 'Cinematic frontend experience built with hand-rolled CSS and React.',
    tech: ['Vite', 'React', 'TypeScript', 'CSS', 'Framer Motion'],
    image: amberHourImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/amber-hour/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/amber-hour',
    accentNote: 'Small batch / first light', featured: true
  },
  {
    number: '03', title: 'ARYAN SHARMA CINEMATIC PORTFOLIO', category: 'Creative Development',
    description: 'My personal creative developer portfolio focused on cinematic motion, interactive UI and modern frontend development.',
    problemSolved: 'A personal platform for presenting creative frontend work through motion, interaction and a deliberate visual system.',
    keyFeatures: ['Cinematic scrolling', 'GSAP and ScrollTrigger animations', 'Lenis smooth scrolling', 'Responsive mobile animation strategy'],
    myContribution: 'Designed and developed the portfolio experience.',
    tech: ['React', 'TypeScript', 'Vite', 'GSAP', 'Lenis', 'Framer Motion'],
    image: portfolioImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-cinematic/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-cinematic',
    accentNote: 'Web / creative developer', featured: true
  },
  {
    number: '04', title: 'CALCULATOR', category: 'Tools',
    description: 'A scientific calculator published as a focused web tool.',
    problemSolved: 'A compact browser-based space for scientific calculations.',
    keyFeatures: ['Degree mode', 'Scientific functions', 'Parentheses and exponent operations', 'Keyboard-friendly calculator controls'],
    myContribution: 'Built the calculator interface and interaction logic.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    image: calculatorImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/calc/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/calc',
    accentNote: 'Scientific tool', featured: true
  },
  {
    number: '05', title: 'PORTFOLIO CARD', category: 'Personal Branding',
    description: 'A compact developer portfolio card with a focused personal introduction and technology list.',
    problemSolved: 'A concise, shareable presentation of Aryan Sharma’s developer profile.',
    keyFeatures: ['Project availability status', 'Profile introduction', 'Technology list', 'Direct portfolio presentation'],
    myContribution: 'Built the responsive portfolio card.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Git'],
    image: portfolioCardImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio-card/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/portfolio-card',
    accentNote: 'Developer identity', featured: true
  },
  {
    number: '06', title: 'PORTFOLIO V3', category: 'Creative Development',
    description: 'A published portfolio iteration presenting Aryan Sharma as a full-stack developer and creative technologist.',
    problemSolved: 'A further portfolio exploration for presenting modern web experiences and technical work.',
    keyFeatures: ['About, skills, projects and experience sections', 'Creative technologist positioning', 'Responsive published experience'],
    myContribution: 'Built and published this portfolio iteration.',
    tech: ['React', 'TypeScript', 'Vite'],
    image: portfolioV3Image,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio-v3/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/portfolio-v3',
    accentNote: 'Portfolio iteration', featured: true
  },
  {
    number: '07', title: 'NISSAN GTR CLONE', category: 'Automotive Web',
    description: 'A public HTML repository exploring a Nissan GTR themed web experience.',
    problemSolved: 'An automotive interface exploration published as a standalone web project.',
    keyFeatures: ['Automotive visual direction', 'Standalone HTML project'],
    myContribution: 'Built the published repository project.',
    tech: ['HTML'], image: nissanImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/nissan-gtr-clone/ezgif-5e46aafc1c78ffbc-jpg',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/nissan-gtr-clone',
    accentNote: 'Automotive study', featured: true
  },
  {
    number: '08', title: 'ARYAN PORTFOLIO AUTH', category: 'Web Development',
    description: 'A portfolio site with authentication screens, personal profile content and project presentation.',
    problemSolved: 'A portfolio exploration combining personal presentation with login and registration entry points.',
    keyFeatures: ['About, skills, projects and contact sections', 'Login and register screens'],
    myContribution: 'Built the published portfolio and auth experience.',
    tech: ['HTML', 'CSS', 'JavaScript'], image: portfolioAuthImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/aryan-portfolio-auth/auth-system/public/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan-portfolio-auth',
    accentNote: 'Portfolio / auth', featured: true
  },
  {
    number: '09', title: 'PORTFOLIO', category: 'Personal Branding',
    description: 'A published portfolio site for Aryan Sharma as a BCA student and web developer.',
    problemSolved: 'A focused personal site for presenting profile information and web development work.',
    keyFeatures: ['About, skills, projects and contact sections', 'Responsive portfolio presentation'],
    myContribution: 'Built the published portfolio experience.',
    tech: ['HTML', 'CSS', 'JavaScript'], image: portfolioClassicImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/portfolio/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/portfolio',
    accentNote: 'Web developer portfolio', featured: true
  },
  {
    number: '10', title: 'RESPONSIVE BUSINESS LANDING PAGE', category: 'Landing Page',
    description: 'A responsive business landing page published as Northstar Studio.',
    problemSolved: 'A business-facing presentation for services, portfolio work and pricing.',
    keyFeatures: ['Services section', 'Portfolio section', 'Pricing section', 'Responsive layout'],
    myContribution: 'Built the published landing page experience.',
    tech: ['HTML', 'CSS', 'JavaScript'], image: businessLandingImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/Responsive-Business-Landing-Page/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/Responsive-Business-Landing-Page',
    accentNote: 'Northstar Studio', featured: false
  },
  {
    number: '11', title: 'CURRPENSE', category: 'Tools',
    description: 'A published currency converter with amount, currency selection and conversion controls.',
    problemSolved: 'A compact browser tool for converting between common currencies.',
    keyFeatures: ['Currency selection', 'Conversion controls', 'Exchange-rate display'],
    myContribution: 'Built the published currency converter.',
    tech: ['JavaScript', 'HTML', 'CSS'], image: currpenseImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/currpense/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/currpense',
    accentNote: 'Currency converter', featured: false
  },
  {
    number: '12', title: 'AUTH CLIENT', category: 'Web Security',
    description: 'A focused authentication client with login, registration and password recovery entry points.',
    problemSolved: 'A concise interface for common account access flows.',
    keyFeatures: ['Login form', 'Register flow entry point', 'Forgot-password entry point'],
    myContribution: 'Built the published authentication client interface.',
    tech: ['HTML', 'CSS'], image: authClientImage,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/auth-client/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/auth-client',
    accentNote: 'Login interface', featured: false
  },
  {
    number: '13', title: 'ARYAN', category: 'Web Development',
    description: 'A public HTML repository with a deployed homepage.',
    problemSolved: 'A standalone web project published for experimentation and presentation.',
    keyFeatures: ['Published homepage', 'Standalone HTML project'],
    myContribution: 'Built the published web project.',
    tech: ['HTML'], image: aryanImage,
    demoUrl: 'https://aryan-sable.vercel.app',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan',
    accentNote: 'Published web project', featured: false
  },
]
