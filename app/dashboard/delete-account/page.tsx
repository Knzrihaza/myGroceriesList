import { getDeleteAccountConfig } from "@/lib/db"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import { DeleteAccountEditor } from "@/components/cms/DeleteAccountEditor"

export default async function DeleteAccountDashboardPage() {
  const [supabase, config] = await Promise.all([
    createClient(),
    getDeleteAccountConfig(),
  ])
  const { data: { user } } = await supabase.auth.getUser()

  const navUser = {
    name: user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Admin",
    email: user?.email ?? "",
    avatar: user?.user_metadata?.avatar_url ?? "",
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
        <div className="flex flex-1 overflow-auto">
          <DeleteAccountEditor initial={config} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
