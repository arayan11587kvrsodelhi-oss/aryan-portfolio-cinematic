export type Certificate = {
  id: string
  order: number
  number: string
  title: string
  issuer: string
  category: string
  type: string
  date?: string
  image: string
  description?: string
  verificationUrl?: string
  credentialId?: string
  hierarchyTier: 'Merit Recognition' | 'Industry Certification' | 'University Achievement' | 'Professional Training' | 'Workshop'
}

const asset = (name: string) => `${import.meta.env.BASE_URL}certificates/${name}`

const certificateImages = {
  eyAnudipMerit: asset('ey-anudip-ai-fundamentals-applications.jpg'),
  eyMicrosoftPassport: asset('ey-anudip-ai-skills-passport.jpg'),
  hpCriticalThinking: asset('hp-critical-thinking-ai.jpg'),
  ibmWebDevelopment: asset('ibm-web-development-fundamentals.jpg'),
  ibmCareerManagement: asset('ibm-career-management-essentials.jpg'),
  trinity404Makeover: asset('trinity-fiesta-404-makeover.jpg'),
  wscubeCybersecurity: asset('wscube-cybersecurity-2026.png'),
  networkBullsIndustrialVisit: asset('network-bulls-industrial-visit.jpg'),
} as const

export const certifications: Certificate[] = [
  {
    id: 'ey-anudip-ai',
    order: 1,
    number: '01',
    title: 'AI FUNDAMENTALS AND APPLICATIONS',
    issuer: 'EY × Anudip Foundation',
    category: 'Artificial Intelligence',
    type: 'Certificate of Merit',
    hierarchyTier: 'Merit Recognition',
    image: certificateImages.eyAnudipMerit,
    description: 'TOP 5 / WINNER — selected among participants from 2 colleges.'
  },
  {
    id: 'ey-microsoft-passport',
    order: 2,
    number: '02',
    title: 'AI SKILLS PASSPORT',
    issuer: 'EY × Microsoft',
    category: 'Artificial Intelligence',
    type: 'Certificate of Completion',
    hierarchyTier: 'Industry Certification',
    image: certificateImages.eyMicrosoftPassport,
    description: 'General & employability curriculum covering Sustainability, Business, Entrepreneurship, and Technology.'
  },
  {
    id: 'ibm-career-management',
    order: 3,
    number: '03',
    title: 'CAREER MANAGEMENT ESSENTIALS',
    issuer: 'IBM SkillsBuild',
    category: 'Professional Development',
    type: 'Certificate of Completion',
    hierarchyTier: 'Industry Certification',
    date: 'January 13, 2026',
    image: certificateImages.ibmCareerManagement,
    verificationUrl: 'https://www.credly.com/badges/d8034b5b-5591-44ad-8e23-4d212d1ec4a7',
    credentialId: 'd8034b5b-5591-44ad-8e23-4d212d1ec4a7',
    description: 'Digital credential verified on Credly by IBM SkillsBuild.'
  },
  {
    id: 'ibm-web-development',
    order: 4,
    number: '04',
    title: 'WEB DEVELOPMENT FUNDAMENTALS',
    issuer: 'IBM SkillsBuild',
    category: 'Web Development',
    type: 'Certificate of Completion',
    hierarchyTier: 'Industry Certification',
    date: 'January 12, 2026',
    image: certificateImages.ibmWebDevelopment,
    description: 'Core web architecture, semantic markup, and responsive layouts.'
  },
  {
    id: 'trinity-404',
    order: 5,
    number: '05',
    title: '404 MAKEOVER',
    issuer: 'Trinity Institute of Professional Studies',
    category: 'College / IT Fiesta',
    type: 'Certificate of Participation',
    hierarchyTier: 'University Achievement',
    image: certificateImages.trinity404Makeover,
    description: 'UI/UX redesign competition at TIPS IT & Management Fiesta.'
  },
  {
    id: 'hp-critical-thinking',
    order: 6,
    number: '06',
    title: 'CRITICAL THINKING IN THE AI ERA',
    issuer: 'HP LIFE / HP Foundation',
    category: 'AI & Decision Making',
    type: 'Certificate of Completion',
    hierarchyTier: 'Professional Training',
    date: 'March 3, 2026',
    image: certificateImages.hpCriticalThinking,
    credentialId: 'af399c3a-3af9-4316-b3a4-359a6ccff432',
    description: 'Fact-checking tools, bias mitigation, and evaluating AI-generated information.'
  },
  {
    id: 'wscube-cybersecurity',
    order: 7,
    number: '07',
    title: 'BUILD A CAREER IN CYBERSECURITY IN 2026',
    issuer: 'WsCube Tech',
    category: 'Cybersecurity',
    type: 'Certificate of Participation',
    hierarchyTier: 'Workshop',
    date: 'March 8, 2026',
    image: certificateImages.wscubeCybersecurity,
    credentialId: 'WS/2026/M/42986',
    description: 'Masterclass on foundational cybersecurity architecture and career roadmaps.'
  },
  {
    id: 'network-bulls-visit',
    order: 8,
    number: '08',
    title: 'INDUSTRIAL VISIT — NETWORK IMPLEMENTATION',
    issuer: 'Network Bulls',
    category: 'Networking',
    type: 'Certificate of Participation',
    hierarchyTier: 'Workshop',
    date: 'July 4, 2026',
    image: certificateImages.networkBullsIndustrialVisit,
    description: 'Hands-on exposure to enterprise network routing, switching, and rack topologies.'
  }
]

export const orderedCertifications = [...certifications].sort((a, b) => a.order - b.order)
