import { getLandingConfig, DEFAULT_LANDING_CONFIG, getApp } from "@/lib/db"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { LandingCmsEditor } from "@/components/cms/LandingCmsEditor"
import type { LandingConfig } from "@/lib/types"

export default async function LandingDashboardPage() {
  const [supabase, app, rawConfig] = await Promise.all([
    createClient(),
    getApp(),
    getLandingConfig(),
  ])
  const { data: { user } } = await supabase.auth.getUser()

  const navUser = {
    name: user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Admin",
    email: user?.email ?? "",
    avatar: user?.user_metadata?.avatar_url ?? "",
  }

  const config: LandingConfig = rawConfig ?? {
    ...DEFAULT_LANDING_CONFIG,
    id: 'new',
    app_id: app.id,
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" user={navUser} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden">
          <LandingCmsEditor initial={config} appName={app.name} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
