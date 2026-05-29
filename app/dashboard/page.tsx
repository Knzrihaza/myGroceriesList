import { AppSidebar } from "@/components/app-sidebar"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getRules } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const [supabase, rules] = await Promise.all([createClient(), getRules()])
  const { data: { user } } = await supabase.auth.getUser()

  const navUser = {
    name: user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Admin",
    email: user?.email ?? "",
    avatar: user?.user_metadata?.avatar_url ?? "",
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={navUser} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards rules={rules} />
              <DataTable data={rules} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
