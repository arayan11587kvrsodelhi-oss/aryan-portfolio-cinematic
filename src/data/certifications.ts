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
}

const asset = (name: string) => `${import.meta.env.BASE_URL}certificates/${name}`

// Verified against the visible issuer/title text on each supplied certificate image.
const certificateImages = {
  eyAnudipMerit: asset('ey-anudip-ai-fundamentals-applications.jpg'),
  eyMicrosoftPassport: asset('ey-anudip-ai-skills-passport.jpg'),
  hpCriticalThinking: asset('hp-critical-thinking-ai.jpg'),
  ibmWebDevelopment: asset('ibm-web-development-fundamentals.jpg'),
  ibmCareerManagement: asset('ibm-career-management-essentials.jpg'),
  trinity404Makeover: asset('trinity-fiesta-404-makeover.jpg'),
  networkBullsIndustrialVisit: asset('network-bulls-industrial-visit.jpg'),
} as const
export const certifications: Certificate[] = [
  { id: 'ey-anudip-ai', order: 1, number: '01', title: 'AI FUNDAMENTALS AND APPLICATIONS', issuer: 'EY × Anudip Foundation', category: 'Artificial Intelligence', type: 'Certificate of Merit', image: certificateImages.eyAnudipMerit, description: 'TOP 5 / WINNER — selected among participants from 2 colleges.' },
  { id: 'ey-microsoft-passport', order: 2, number: '02', title: 'AI SKILLS PASSPORT', issuer: 'EY × Microsoft', category: 'Artificial Intelligence', type: 'Certificate of Completion', image: certificateImages.eyMicrosoftPassport },
  { id: 'hp-critical-thinking', order: 3, number: '03', title: 'CRITICAL THINKING IN THE AI ERA', issuer: 'HP LIFE / HP Foundation', category: 'AI / Professional Skills', type: 'Certificate of Completion', date: 'March 3, 2026', image: certificateImages.hpCriticalThinking },
  { id: 'ibm-web-development', order: 4, number: '04', title: 'WEB DEVELOPMENT FUNDAMENTALS', issuer: 'IBM SkillsBuild', category: 'Web Development', type: 'Certificate of Completion', date: 'January 12, 2026', image: certificateImages.ibmWebDevelopment },
  { id: 'ibm-career-management', order: 5, number: '05', title: 'CAREER MANAGEMENT ESSENTIALS', issuer: 'IBM SkillsBuild', category: 'Professional Development', type: 'Certificate of Completion', date: 'January 13, 2026', image: certificateImages.ibmCareerManagement },
  { id: 'trinity-404', order: 6, number: '06', title: '404 MAKEOVER', issuer: 'Trinity Institute of Professional Studies', category: 'College / Event', type: 'Certificate of Participation', image: certificateImages.trinity404Makeover },
  { id: 'network-bulls-visit', order: 7, number: '07', title: 'INDUSTRIAL VISIT — NETWORK IMPLEMENTATION', issuer: 'Network Bulls', category: 'Networking', type: 'Certificate of Participation', date: 'July 4, 2026', image: certificateImages.networkBullsIndustrialVisit },
]

export const orderedCertifications = [...certifications].sort((a, b) => a.order - b.order)
