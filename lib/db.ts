import fs from 'fs/promises'
import path from 'path'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { App, Rule } from '@/lib/types'

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
