export type Achievement = {
  id: string
  title: string
  label: string
  organization: string
  description: string
  certificateImage: string
  featured: boolean
}

export const achievements: Achievement[] = [{
  id: 'ey-anudip-top-five',
  label: 'TOP 5 / WINNER',
  title: 'EY AI FUNDAMENTALS & APPLICATIONS',
  organization: 'EY × Anudip Foundation',
  description: 'Selected among participants from 2 colleges. Certificate of Merit.',
  certificateImage: `${import.meta.env.BASE_URL}certificates/ey-anudip-ai-fundamentals-applications.jpg`,
  featured: true,
}]
