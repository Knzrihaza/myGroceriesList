import { createClient } from '@/lib/supabase/server'

const BUCKET = 'landing-assets'

export async function uploadAsset(file: File, storagePath: string): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error('File too large (max 5 MB)')
  const sb = await createClient()
  const { error } = await sb.storage
    .from(BUCKET)
    .upload(storagePath, file, { upsert: true, contentType: file.type })
  if (error) throw new Error(error.message)
  const { data } = sb.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}
