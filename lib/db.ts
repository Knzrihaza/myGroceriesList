import fs from 'fs/promises'
import path from 'path'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { App, Rule, LandingConfig, NavbarData, HeroData, AppStoreData, CtaData, FooterData, DeleteAccountConfig } from '@/lib/types'

const useSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)

// ── JSON backend ──────────────────────────────────────────────────────────────

const JSON_PATH = path.join(process.cwd(), 'data', 'rules.json')

type JsonStore = { app: App; rules: Rule[] }

async function readJson(): Promise<JsonStore> {
  const raw = await fs.readFile(JSON_PATH, 'utf-8')
  return JSON.parse(raw) as JsonStore
}

async function writeJson(store: JsonStore): Promise<void> {
  await fs.writeFile(JSON_PATH, JSON.stringify(store, null, 2), 'utf-8')
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function getApp(): Promise<App> {
  if (useSupabase) {
    const sb = await createServerClient()
    const { data, error } = await sb.from('apps').select('*').limit(1).single()
    if (error) throw new Error(error.message)
    return data as App
  }
  return (await readJson()).app
}

export async function getRules(): Promise<Rule[]> {
  if (useSupabase) {
    const sb = await createServerClient()
    const { data, error } = await sb
      .from('rules')
      .select('*')
      .order('order', { ascending: true })
    if (error) throw new Error(error.message)
    return data as Rule[]
  }
  const store = await readJson()
  return [...store.rules].sort((a, b) => a.order - b.order)
}

export async function createRule(
  ruleData: Omit<Rule, 'id' | 'app_id' | 'order' | 'created_at' | 'updated_at'>
): Promise<Rule> {
  const app = await getApp()
  const now = new Date().toISOString()

  if (useSupabase) {
    const sb = await createServerClient()
    const { data: existing } = await sb
      .from('rules')
      .select('order')
      .order('order', { ascending: false })
      .limit(1)
      .single()
    const nextOrder = existing ? (existing.order as number) + 1 : 0
    const { data, error } = await sb
      .from('rules')
      .insert({ ...ruleData, app_id: app.id, order: nextOrder, created_at: now, updated_at: now })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Rule
  }

  const store = await readJson()
  const nextOrder = store.rules.length
  const newRule: Rule = {
    ...ruleData,
    id: crypto.randomUUID(),
    app_id: app.id,
    order: nextOrder,
    created_at: now,
    updated_at: now,
  }
  store.rules.push(newRule)
  await writeJson(store)
  return newRule
}

export async function updateRule(
  id: string,
  updates: Partial<Omit<Rule, 'id' | 'app_id' | 'created_at'>>
): Promise<Rule> {
  const now = new Date().toISOString()

  if (useSupabase) {
    const sb = await createServerClient()
    const { data, error } = await sb
      .from('rules')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as Rule
  }

  const store = await readJson()
  const idx = store.rules.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error(`Rule ${id} not found`)
  store.rules[idx] = { ...store.rules[idx], ...updates, updated_at: now }
  await writeJson(store)
  return store.rules[idx]
}

export async function deleteRule(id: string): Promise<void> {
  if (useSupabase) {
    const sb = await createServerClient()
    const { error } = await sb.from('rules').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return
  }

  const store = await readJson()
  store.rules = store.rules.filter((r) => r.id !== id)
  store.rules.forEach((r, i) => { r.order = i })
  await writeJson(store)
}

export async function reorderRules(orderedIds: string[]): Promise<void> {
  const now = new Date().toISOString()

  if (useSupabase) {
    const sb = await createServerClient()
    const results = await Promise.all(
      orderedIds.map((id, index) =>
        sb.from('rules').update({ order: index, updated_at: now }).eq('id', id)
      )
    )
    const failed = results.find((r) => r.error)
    if (failed) throw new Error(failed.error!.message)
    return
  }

  const store = await readJson()
  const map = new Map(store.rules.map((r) => [r.id, r]))
  if (orderedIds.some((id) => !map.has(id))) {
    throw new Error(`reorderRules: unknown ID(s) in orderedIds`)
  }
  store.rules = orderedIds.map((id, index) => ({ ...map.get(id)!, order: index }))
  await writeJson(store)
}

export async function upsertApp(
  appData: Partial<Omit<App, 'id' | 'created_at'>>
): Promise<App> {
  const now = new Date().toISOString()

  if (useSupabase) {
    const sb = await createServerClient()
    const existing = await getApp()
    const { data, error } = await sb
      .from('apps')
      .upsert({ ...existing, ...appData, updated_at: now })
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data as App
  }

  const store = await readJson()
  store.app = { ...store.app, ...appData }
  await writeJson(store)
  return store.app
}

// ── Default landing config seed ───────────────────────────────────────────────

export const DEFAULT_LANDING_CONFIG = {
  primary_color: '#6366f1',
  accent_color: '#0f172a',
  font: 'inter' as const,
  navbar_enabled: true,
  hero_enabled: true,
  trust_badges_enabled: false,
  features_enabled: true,
  stats_enabled: false,
  screenshots_enabled: false,
  steps_enabled: false,
  app_store_enabled: false,
  cta_enabled: true,
  navbar: { links: [], cta_text: 'Get Started', cta_url: '#' } as NavbarData,
  hero: {
    headline: 'Your app name',
    subheadline: 'A short description of what your app does.',
    cta_text: 'Get Started',
    cta_url: '#',
    bg_style: 'gradient' as const,
  } as HeroData,
  trust_badges: [],
  features: [
    { icon: 'ShieldCheck', title: 'Feature one',   description: 'Describe this feature.' },
    { icon: 'Zap',         title: 'Feature two',   description: 'Describe this feature.' },
    { icon: 'Globe',       title: 'Feature three', description: 'Describe this feature.' },
  ],
  stats: [],
  screenshots: [],
  steps: [],
  app_store: { label: 'Download now' } as AppStoreData,
  cta: { headline: 'Ready to get started?', primary_text: 'Get Started', primary_url: '#' } as CtaData,
  footer: {
    copyright: `© ${new Date().getFullYear()} Your App`,
    social_links: [],
    columns: [],
  } as FooterData,
}

// ── Landing config ────────────────────────────────────────────────────────────

export async function getLandingConfig(): Promise<LandingConfig | null> {
  if (useSupabase) {
    const app = await getApp()
    const sb = await createServerClient()
    const { data } = await sb
      .from('landing_config')
      .select('*')
      .eq('app_id', app.id)
      .single()
    return (data as LandingConfig) ?? null
  }
  return null
}

export async function upsertLandingConfig(
  updates: Partial<Omit<LandingConfig, 'id' | 'app_id' | 'created_at'>>
): Promise<LandingConfig> {
  if (!useSupabase) throw new Error('Landing config requires Supabase')
  const app = await getApp()
  const sb = await createServerClient()
  const now = new Date().toISOString()
  const { data, error } = await sb
    .from('landing_config')
    .upsert({ ...DEFAULT_LANDING_CONFIG, ...updates, app_id: app.id, updated_at: now }, { onConflict: 'app_id' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as LandingConfig
}

// ── Delete account config ─────────────────────────────────────────────────────

export async function getDeleteAccountConfig(): Promise<DeleteAccountConfig | null> {
  if (useSupabase) {
    const app = await getApp()
    const sb = await createServerClient()
    const { data } = await sb
      .from('delete_account_config')
      .select('*')
      .eq('app_id', app.id)
      .single()
    return (data as DeleteAccountConfig) ?? null
  }
  return null
}

export async function upsertDeleteAccountConfig(
  updates: Partial<Omit<DeleteAccountConfig, 'id' | 'created_at'>>
): Promise<DeleteAccountConfig> {
  if (!useSupabase) throw new Error('Delete account config requires Supabase')
  const app = await getApp()
  const sb = await createServerClient()
  const now = new Date().toISOString()
  const { data, error } = await sb
    .from('delete_account_config')
    .upsert({ ...updates, app_id: app.id, updated_at: now }, { onConflict: 'app_id' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as DeleteAccountConfig
}
