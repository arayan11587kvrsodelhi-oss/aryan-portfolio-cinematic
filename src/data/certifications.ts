export type Certificate = {
  id: string
  order: number
  number: string
  title: string
  issuer: string
  category: string
  type: string
  date?: string
  image?: string
  pdfUrl?: string
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
  owaspSecuritySummit: asset('owasp-security-summit-2026.png'),
  be10xAiToolsWorkshop: asset('be10x-ai-tools-workshop.png'),
  redTeamLeadersLlmSecurityExpert: asset('red-team-leaders-llm-security-expert.png'),
  claude101: asset('claude-101.png'),
  tataGenAiDataAnalytics: asset('tata-genai-data-analytics.jpg'),
  tataCybersecurityAnalyst: asset('tata-cybersecurity-analyst.jpg'),
  ciscoNiitCyberAwareness: asset('cisco-niit-cyber-awareness-ai-prime.jpg'),
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
    id: 'claude-101',
    order: 3,
    number: '03',
    title: 'CLAUDE 101',
    issuer: 'Anthropic',
    category: 'Artificial Intelligence',
    type: 'Certificate of Completion',
    hierarchyTier: 'Industry Certification',
    date: 'November 2026',
    image: certificateImages.claude101,
    pdfUrl: asset('claude-101.pdf'),
    credentialId: 'zksvyatrnraz',
    verificationUrl: 'https://verify.skilljar.com/c/zksvyatrnraz',
    description: 'Prompting fundamentals, conversational design, and practical Claude model capabilities.'
  },
  {
    id: 'tata-genai-data-analytics',
    order: 4,
    number: '04',
    title: 'GENAI POWERED DATA ANALYTICS',
    issuer: 'Tata Group · Forage',
    category: 'Artificial Intelligence',
    type: 'Job Simulation Certificate of Completion',
    hierarchyTier: 'Professional Training',
    date: 'November 1, 2026',
    image: certificateImages.tataGenAiDataAnalytics,
    credentialId: '6ae769fcca8bdf3bb427a81e',
    description: 'Exploratory data analysis, delinquency prediction with AI, and AI-driven business strategy.'
  },
  {
    id: 'ibm-career-management',
    order: 5,
    number: '05',
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
    order: 6,
    number: '06',
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
    order: 7,
    number: '07',
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
    order: 8,
    number: '08',
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
    order: 9,
    number: '09',
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
    order: 10,
    number: '10',
    title: 'INDUSTRIAL VISIT — NETWORK IMPLEMENTATION',
    issuer: 'Network Bulls',
    category: 'Networking',
    type: 'Certificate of Participation',
    hierarchyTier: 'Workshop',
    date: 'July 4, 2026',
    image: certificateImages.networkBullsIndustrialVisit,
    description: 'Hands-on exposure to enterprise network routing, switching, and rack topologies.'
  },
  {
    id: 'owasp-security-summit-2026',
    order: 11,
    number: '11',
    title: 'OWASP SECURITY SUMMIT 2026',
    issuer: 'OWASP',
    category: 'Cybersecurity',
    type: 'Certificate of Participation',
    hierarchyTier: 'Workshop',
    date: 'October 2, 2026',
    image: certificateImages.owaspSecuritySummit,
    description: 'Organized by Knight Secured Company in collaboration with Cyber Leelawat.'
  },
  {
    id: 'be10x-ai-tools-workshop',
    order: 12,
    number: '12',
    title: 'AI TOOLS WORKSHOP',
    issuer: 'be10X',
    category: 'Artificial Intelligence',
    type: 'Certificate of Completion',
    hierarchyTier: 'Workshop',
    date: 'October 4, 2026',
    image: certificateImages.be10xAiToolsWorkshop,
    description: 'AI tools and ChatGPT workshop. Covers creating presentations, analysing data, and coding/debugging with AI.',
    verificationUrl: 'https://app.aicareeraccelerator.in/certificate/ZKBPKq-pRYlbwjZ',
    credentialId: 'ZKBPKq-pRYlbwjZ',
  },
  {
    id: 'red-team-leaders-cllmse',
    order: 13,
    number: '13',
    title: 'CERTIFIED LLM SECURITY EXPERT (CLLMSE)',
    issuer: 'Red Team Leaders',
    category: 'Cybersecurity',
    type: 'Certificate',
    hierarchyTier: 'Industry Certification',
    date: 'September 30, 2026',
    image: certificateImages.redTeamLeadersLlmSecurityExpert,
    credentialId: 'a001646c2c6d4ba2'
  },
  {
    id: 'tata-cybersecurity-analyst',
    order: 14,
    number: '14',
    title: 'CYBERSECURITY ANALYST JOB SIMULATION',
    issuer: 'Tata Group · Forage',
    category: 'Cybersecurity',
    type: 'Job Simulation Certificate of Completion',
    hierarchyTier: 'Professional Training',
    date: 'October 19, 2026',
    image: certificateImages.tataCybersecurityAnalyst,
    credentialId: '6ad5cd749ecfc0cf9fb5bd0a',
    description: 'Identity and access management (IAM) fundamentals, IAM strategy assessment, and custom IAM solutions.'
  },
  {
    id: 'cisco-niit-cyber-awareness',
    order: 15,
    number: '15',
    title: 'PROGRAM IN CYBER AWARENESS AI PRIME',
    issuer: 'Cisco & NIIT Foundation · DSCI',
    category: 'Cybersecurity',
    type: 'Certificate of Completion',
    hierarchyTier: 'Professional Training',
    date: 'October 15, 2026',
    image: certificateImages.ciscoNiitCyberAwareness,
    credentialId: '27P0613840014362726',
    description: 'Cyber Suraksha Plus Program curriculum on defensive cybersecurity, data protection, and digital awareness.'
  }
]

export const orderedCertifications = [...certifications].sort((a, b) => a.order - b.order)

/* ==========================================================================
   TOP CERTIFICATES — the three credentials featured at the head of the
   Recognition section, in this exact order:

     1. EY AI Fundamentals & Applications  (Certificate of Merit)
     2. CERTIFIED LLM SECURITY EXPERT (CLLMSE) — Red Team Leaders
     3. WEB DEVELOPMENT FUNDAMENTALS — IBM SkillsBuild
   ========================================================================== */

const TOP_CERTIFICATE_IDS = [
  'ey-anudip-ai',
  'red-team-leaders-cllmse',
  'ibm-web-development',
] as const

export const topCertifications: Certificate[] = TOP_CERTIFICATE_IDS.map(
  (id) => certifications.find((c) => c.id === id)
).filter((c): c is Certificate => Boolean(c))
