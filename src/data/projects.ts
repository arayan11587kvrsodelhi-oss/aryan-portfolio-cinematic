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
  tech: string[]
  image: string
  demoUrl?: string
  githubUrl?: string
  accentNote: string
}

export const projects: Project[] = [
  { number: '01', title: 'E-Commerce Website', category: 'Web Development', description: 'A responsive shopping experience with product discovery, filtering, cart interactions and a clean storefront interface built from scratch.', tech: ['HTML', 'CSS', 'JavaScript'], image: p1, githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/ecom.html', accentNote: 'Storefront build' },
  { number: '02', title: 'Loading Page', category: 'Creative Frontend', description: 'A motion-first loading experience designed to make the transition into a product feel intentional instead of waiting on a blank screen.', tech: ['HTML', 'CSS', 'JavaScript'], image: p2, githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/loadpage.html', accentNote: 'Motion study' },
  { number: '03', title: 'Password Checker', category: 'Web Security', description: 'A responsive password-strength interface that evaluates input in real time and communicates security feedback clearly to the user.', tech: ['HTML', 'CSS', 'JavaScript'], image: p3, githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/secure.html', accentNote: 'Security UI' },
  { number: '04', title: 'Portfolio Card', category: 'Personal Branding', description: 'A compact portfolio identity card combining profile information, skills, social links and a dark visual system into a reusable presentation.', tech: ['HTML', 'CSS', 'JavaScript'], image: p4, githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/aryan/blob/main/portfoliocard.html', accentNote: 'Marketplace template' },
  { number: '05', title: 'Authentication System', category: 'Cybersecurity', description: 'A login, registration and forgot-password flow built as a standalone client, focused on clean validation states and a secure-feeling UX.', tech: ['HTML', 'CSS', 'JavaScript'], image: p5, demoUrl: 'https://arayan11587kvrsodelhi-oss.github.io/auth-client/', githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/auth-client', accentNote: 'Security first' },
  { number: '06', title: 'Automotive Experience', category: 'Creative Development', description: 'A cinematic automotive interface experiment using large imagery, dark contrast and interaction-driven composition to create a premium product feel.', tech: ['React', 'CSS', 'JavaScript'], image: p6, githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/', accentNote: 'Visual experiment' },
  { number: '07', title: 'Lumora', category: 'Creative Development', description: 'A luxury perfume concept built around cinematic storytelling, atmospheric visuals and scroll-driven transitions inspired by high-end product advertising.', tech: ['React', 'GSAP', 'ScrollTrigger'], image: lumora, githubUrl: 'https://github.com/arayan11587kvrsodelhi-oss/', accentNote: 'Scroll story' },
]
