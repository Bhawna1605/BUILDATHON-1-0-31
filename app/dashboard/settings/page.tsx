import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SettingsPanel } from "@/components/settings-panel"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen bg-slate-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader user={data.user} />
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400 mt-2">Manage your account and security preferences</p>
            </div>
            <SettingsPanel user={data.user} />
          </div>
        </main>
      </div>
    </div>
  )
}
