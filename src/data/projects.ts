import p1 from '../assets/photos/ecommerce.jpg'
import p2 from '../assets/photos/project-mockups.svg'
import p3 from '../assets/photos/project-password.svg'
import p4 from '../assets/photos/profile-card.jpg'
import p5 from '../assets/photos/project-security.svg'
import p6 from '../assets/photos/nissan.jpg'
import lumora from '../assets/photos/project-lumora.svg'

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
}

export const projects: Project[] = [
  {
    number: '01',
    title: 'E-Commerce Website',
    category: 'Web Development',
    description: 'A responsive shopping experience with product discovery, filtering, cart interactions and a clean storefront interface built from scratch.',
    problemSolved: 'Small storefronts often lack fast, clutter-free interfaces that allow instant product browsing and seamless cart management across devices without heavy framework overhead.',
    keyFeatures: [
      'Real-time product search and instant category filter',
      'Dynamic shopping cart summary with persistent count',
      'Fully responsive grid layout for mobile and desktop',
      'Custom CSS variables design system for rapid theme customization'
    ],
    myContribution: 'Single-handedly designed and developed the entire frontend layout, state management, and asset structure using clean vanilla web standards.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: p1,
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/ecom.html',
    accentNote: 'Storefront build'
  },
  {
    number: '02',
    title: 'Loading Page',
    category: 'Creative Frontend',
    description: 'A motion-first loading experience designed to make the transition into a product feel intentional instead of waiting on a blank screen.',
    problemSolved: 'Web entry points are frequently abrupt or visually unrefined, leading to higher initial bounce rates during app resource hydration.',
    keyFeatures: [
      'Smooth numerical progress percentage tracking',
      'SVG mask choreography and path reveals',
      'Lightweight asynchronous asset preloader',
      'Custom easing curves for tactile motion feedback'
    ],
    myContribution: 'Formulated the motion choreography and built custom CSS keyframe triggers with JavaScript timing hooks.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: p2,
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/loadpage.html',
    accentNote: 'Motion study'
  },
  {
    number: '03',
    title: 'Password Checker',
    category: 'Web Security',
    description: 'A responsive password-strength interface that evaluates input in real time and communicates security feedback clearly to the user.',
    problemSolved: 'Users routinely set weak passwords due to vague security criteria during account setup.',
    keyFeatures: [
      'Real-time entropy and character dynamic strength evaluation',
      'Visual indicator status bar with reactive color coding',
      'Requirement checklist tracking length, numbers, and symbols',
      'Accessible focus states and screen-reader friendly cues'
    ],
    myContribution: 'Engineered regex-based strength algorithm and reactive UI state updates to deliver instant security insight to end users.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: p3,
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/secure.html',
    accentNote: 'Security UI'
  },
  {
    number: '04',
    title: 'Portfolio Card',
    category: 'Personal Branding',
    description: 'A compact portfolio identity card combining profile information, skills, social links and a dark visual system into a reusable presentation.',
    problemSolved: 'Creators need a lightweight, high-density digital identity card that consolidates contacts, skills, and bio into a single shareable link.',
    keyFeatures: [
      'Glassmorphism aesthetic with high contrast typography',
      'Quick copy and direct action social links',
      'Integrated skill tags and interactive profile breakdown',
      'Ultra-responsive viewport scaling'
    ],
    myContribution: 'Conceptualized and crafted the dark visual identity system, layout architecture, and responsive styling.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: p4,
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/portfoliocard.html',
    accentNote: 'Marketplace template'
  },
  {
    number: '05',
    title: 'Authentication System',
    category: 'Cybersecurity',
    description: 'A login, registration and forgot-password flow built as a standalone client, focused on clean validation states and a secure-feeling UX.',
    problemSolved: 'User onboarding flows need explicit client-side validation to prevent bad payload submissions while keeping the user informed at every step.',
    keyFeatures: [
      'Sign-in, registration, and password reset multi-screen state flow',
      'Client-side real-time form sanitization and error highlights',
      'Password visibility toggles and active state indicators',
      'Production-ready dark theme UI with keyboard accessibility'
    ],
    myContribution: 'Developed the full client interaction, UI state engine, validation rules, and responsive design.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: p5,
    demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/auth-client/',
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/auth-client',
    accentNote: 'Security first'
  },
  {
    number: '06',
    title: 'Automotive Experience',
    category: 'Creative Development',
    description: 'A cinematic automotive interface experiment using large imagery, dark contrast and interaction-driven composition to create a premium product feel.',
    problemSolved: 'Standard automotive showcases suffer from static media that fails to convey modern vehicle performance and elegance.',
    keyFeatures: [
      'Large high-definition visual imagery with depth layers',
      'Dynamic focal shifts and hover parallax effect',
      'Interactive spec breakdown panels',
      'Smooth keyframe and transition choreography'
    ],
    myContribution: 'Architected component structure in React and developed parallax mouse-tracking logic to evoke a luxury showroom feel.',
    tech: ['React', 'CSS3', 'JavaScript'],
    image: p6,
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/',
    accentNote: 'Visual experiment'
  },
  {
    number: '07',
    title: 'Lumora',
    category: 'Creative Development',
    description: 'A luxury perfume concept built around cinematic storytelling, atmospheric visuals and scroll-driven transitions inspired by high-end product advertising.',
    problemSolved: 'High-end products demand digital storytelling that elevates brand luxury beyond flat static images.',
    keyFeatures: [
      'Scroll-driven storytelling synced with GSAP ScrollTrigger',
      'Layered visual depth and scaling typography',
      'Atmospheric lighting and ambient backdrop gradients',
      'Multi-device fluid layout responsiveness'
    ],
    myContribution: 'Built the full interactive experience in React, programming scroll choreography and visual state shifts.',
    tech: ['React', 'GSAP', 'ScrollTrigger', 'Tailwind CSS'],
    image: lumora,
    githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/',
    accentNote: 'Scroll story'
  },
]
