'use server'

import { revalidatePath } from 'next/cache'
import {
  createRule as dbCreateRule,
  updateRule as dbUpdateRule,
  deleteRule as dbDeleteRule,
  reorderRules as dbReorderRules,
  upsertApp as dbUpsertApp,
} from '@/lib/db'
import type { App, Rule } from '@/lib/types'

function revalidate() {
  revalidatePath('/dashboard')
  revalidatePath('/privacy-policy')
}

export async function createRule(
  data: Omit<Rule, 'id' | 'app_id' | 'order' | 'created_at' | 'updated_at'>
): Promise<Rule> {
  const rule = await dbCreateRule(data)
  revalidate()
  return rule
}

export async function updateRule(
  id: string,
  data: Partial<Omit<Rule, 'id' | 'app_id' | 'created_at'>>
): Promise<Rule> {
  const rule = await dbUpdateRule(id, data)
  revalidate()
  return rule
}

export async function deleteRule(id: string): Promise<void> {
  await dbDeleteRule(id)
  revalidate()
}

export async function reorderRules(orderedIds: string[]): Promise<void> {
  await dbReorderRules(orderedIds)
  revalidate()
}

export async function upsertApp(
  data: Partial<Omit<App, 'id' | 'created_at'>>
): Promise<App> {
  const app = await dbUpsertApp(data)
  revalidate()
  return app
}
