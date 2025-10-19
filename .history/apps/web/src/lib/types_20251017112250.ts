export type Domain = 'INNER' | 'HEALTH' | 'RELATIONSHIP' | 'FINANCE'
export type Privacy = 'PRIVATE' | 'GROUP' | 'LINK' | 'PUBLIC_ANON'

export interface User {
  id: string
  email: string
  name?: string
  locale?: string
  tz?: string
  privacyDefault: Privacy
  role: 'USER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface Lesson {
  id: string
  userId: string
  contentRaw: string
  contentSummary?: string
  domain: Domain
  tags: string[]
  mood: number
  resonance: number
  gratitude?: string
  attachments: string[]
  visibility: Privacy
  language?: string
  aiConcepts: string[]
  aiNextQuestion?: string
  shareToken?: string
  createdAt: string
  updatedAt: string
}

export interface Goal {
  id: string
  userId: string
  type: string
  target: number
  current: number
  sprintSize: number
  cadence: string
  status: string
  createdAt: string
  updatedAt: string
  sprints?: Sprint[]
}

export interface Sprint {
  id: string
  goalId: string
  index: number
  startAt: string
  endAt: string
  target: number
  done: number
  createdAt: string
}

export interface AnalyticsOverview {
  totalLessons: number
  domainStats: {
    domain: Domain
    count: number
  }[]
  streak: number
  heatmap: {
    date: string
    count: number
  }[]
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}
