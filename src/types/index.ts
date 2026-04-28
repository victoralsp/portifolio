export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  tech: string[]
  imageUrl: string
  liveUrl?: string
  repoUrl?: string
  featured: boolean
}

export interface Skill {
  name: string
  level: number
  category: SkillCategory
  icon?: string
}

export type SkillCategory = 'frontend' | 'backend' | 'tooling' | 'design'

export interface NavItem {
  label: string
  href: string
}

export interface SocialLink {
  platform: string
  url: string
  icon: string
}
