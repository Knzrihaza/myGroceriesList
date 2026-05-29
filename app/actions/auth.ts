'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function createAdmin(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirm = formData.get('confirm') as string

  if (password !== confirm) return { error: 'Passwords do not match' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters' }

  const supabase = await createClient()

  // Guard: block if setup is already done
  const { data: appRow } = await supabase.from('apps').select('setup_complete').limit(1).single()
  if (appRow?.setup_complete) {
    return { error: 'Admin already exists. Please log in.' }
  }

  // Standard signUp — no service role key needed
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${siteUrl}/auth/callback` },
  })
  if (signUpError) return { error: signUpError.message }

  // Try immediate sign-in (works when email confirmation is disabled in Supabase)
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    // Email confirmation is required — user must confirm before logging in
    return { error: 'Check your email and click the confirmation link, then log in here.' }
  }

  // Authenticated — mark setup complete (RLS allows authenticated UPDATE)
  await supabase.from('apps').update({ setup_complete: true }).neq('id', '')

  redirect('/dashboard')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
