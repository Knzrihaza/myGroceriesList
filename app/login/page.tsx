import { createClient } from '@/lib/supabase/server'
import { LoginForm } from "@/components/login-form"
import { SetupForm } from "@/components/setup-form"
import { GalleryVerticalEndIcon } from "lucide-react"

async function isSetupComplete(): Promise<boolean> {
  try {
    const sb = await createClient()
    const { data } = await sb
      .from('apps')
      .select('setup_complete')
      .limit(1)
      .single()
    return data?.setup_complete === true
  } catch {
    // Table doesn't exist yet or query failed — show setup form
    return false
  }
}

export default async function LoginPage() {
  const setupDone = await isSetupComplete()

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/dashboard" className="flex items-center gap-2 font-medium">
            <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEndIcon className="size-4" />
            </div>
            Privacy Manager
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {setupDone ? <LoginForm /> : <SetupForm />}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
