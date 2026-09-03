export interface SkillGroup {
  category: string
  subtitle: string
  skills: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Frontend & UI Engineering',
    subtitle: 'Interfaces, design systems & rendering',
    skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind'],
  },
  {
    category: 'Motion & Interaction',
    subtitle: 'Choreography, physics & smooth scroll',
    skills: ['GSAP', 'ScrollTrigger', 'Framer Motion', 'Lenis', 'Canvas / SVG'],
  },
  {
    category: 'Backend & APIs',
    subtitle: 'Runtimes, services & network layer',
    skills: ['Node.js', 'Express', 'REST APIs', 'HTTP / Client State'],
  },
  {
    category: 'Database & Data Systems',
    subtitle: 'Relational modeling & queries',
    skills: ['MySQL', 'SQL', 'Data Modeling'],
  },
  {
    category: 'Tools / Workflow',
    subtitle: 'Tooling, build & prototyping',
    skills: ['Git', 'GitHub', 'Vite', 'VS Code', 'Postman', 'Figma'],
  },
  {
    category: 'Web Application Security',
    subtitle: 'Hardening & safe client workflows',
    skills: ['Authentication', 'Input Sanitization', 'OWASP practices'],
  },
]

export const totalSkillCount = skillGroups.reduce((n, g) => n + g.skills.length, 0)
