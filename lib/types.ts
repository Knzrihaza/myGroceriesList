export type App = {
  id: string
  name: string
  developer: string
  contact_email: string
  website_url?: string
  setup_complete?: boolean
  created_at?: string
  updated_at?: string
}

export type Rule = {
  id: string
  app_id: string
  data_collected: string
  purpose: string
  retention: string
  third_parties: string
  legal_basis: string
  order: number
  created_at: string
  updated_at: string
}

export type NavbarData = {
  links: { label: string; url: string }[]
  cta_text: string
  cta_url: string
}

export type HeroData = {
  headline: string
  subheadline: string
  cta_text: string
  cta_url: string
  secondary_cta_text?: string
  secondary_cta_url?: string
  image_url?: string
  bg_style: 'gradient' | 'solid' | 'image'
}

export type TrustBadgeItem = { image_url: string; alt: string }
export type FeatureItem    = { icon: string; title: string; description: string }
export type StatItem       = { value: string; label: string }
export type ScreenshotItem = { url: string; caption?: string }
export type StepItem       = { title: string; description: string }

export type AppStoreData = {
  label: string
  apple_url?: string
  google_url?: string
}

export type CtaData = {
  headline: string
  subtext?: string
  primary_text: string
  primary_url: string
  secondary_text?: string
  secondary_url?: string
}

export type FooterData = {
  copyright: string
  social_links: { platform: string; url: string }[]
  columns: { heading: string; links: { label: string; url: string }[] }[]
}

export type LandingConfig = {
  id: string
  app_id: string
  primary_color: string
  accent_color: string
  font: 'inter' | 'geist' | 'poppins'
  logo_url?: string
  favicon_url?: string
  navbar_enabled: boolean
  hero_enabled: boolean
  trust_badges_enabled: boolean
  features_enabled: boolean
  stats_enabled: boolean
  screenshots_enabled: boolean
  steps_enabled: boolean
  app_store_enabled: boolean
  cta_enabled: boolean
  navbar: NavbarData
  hero: HeroData
  trust_badges: TrustBadgeItem[]
  features: FeatureItem[]
  stats: StatItem[]
  screenshots: ScreenshotItem[]
  steps: StepItem[]
  app_store: AppStoreData
  cta: CtaData
  footer: FooterData
  created_at?: string
  updated_at?: string
}

export type DeleteAccountConfig = {
  id: string
  app_id: string
  title: string
  intro?: string
  steps: { title: string; description: string }[]
  data_deleted: string[]
  contact_email?: string
  retention_text?: string
  created_at?: string
  updated_at?: string
}

export type SectionKey =
  | 'navbar_enabled'
  | 'hero_enabled'
  | 'trust_badges_enabled'
  | 'features_enabled'
  | 'stats_enabled'
  | 'screenshots_enabled'
  | 'steps_enabled'
  | 'app_store_enabled'
  | 'cta_enabled'
