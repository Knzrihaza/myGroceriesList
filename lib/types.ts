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
