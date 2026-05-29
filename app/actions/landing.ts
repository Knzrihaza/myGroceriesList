'use server'

import { revalidatePath } from 'next/cache'
import {
  getLandingConfig as dbGetLanding,
  upsertLandingConfig as dbUpsertLanding,
  getDeleteAccountConfig as dbGetDeleteAccount,
  upsertDeleteAccountConfig as dbUpsertDeleteAccount,
} from '@/lib/db'
import { uploadAsset } from '@/lib/storage'
import type { LandingConfig, DeleteAccountConfig, SectionKey } from '@/lib/types'

function revalidateLanding() {
  revalidatePath('/')
  revalidatePath('/dashboard/landing')
}

function revalidateDeleteAccount() {
  revalidatePath('/delete-account')
  revalidatePath('/dashboard/delete-account')
}

export async function getLandingConfig(): Promise<LandingConfig | null> {
  return dbGetLanding()
}

export async function saveLandingConfig(
  data: Partial<Omit<LandingConfig, 'id' | 'app_id' | 'created_at'>>
): Promise<LandingConfig> {
  const config = await dbUpsertLanding(data)
  revalidateLanding()
  return config
}

export async function toggleSection(
  section: SectionKey,
  enabled: boolean
): Promise<void> {
  await dbUpsertLanding({ [section]: enabled })
  revalidateLanding()
}

export async function getDeleteAccountConfig(): Promise<DeleteAccountConfig | null> {
  return dbGetDeleteAccount()
}

export async function saveDeleteAccountConfig(
  data: Partial<Omit<DeleteAccountConfig, 'id' | 'app_id' | 'created_at'>>
): Promise<DeleteAccountConfig> {
  const config = await dbUpsertDeleteAccount(data)
  revalidateDeleteAccount()
  return config
}

export async function uploadLandingAsset(formData: FormData): Promise<string> {
  const file = formData.get('file') as File
  const storagePath = formData.get('path') as string
  return uploadAsset(file, storagePath)
}
