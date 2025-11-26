import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { OverviewCards } from "@/components/overview-cards"
import { RecentThreats } from "@/components/recent-threats"
import { ThreatAnalytics } from "@/components/threat-analytics"

export default async function DashboardPage() {
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
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
              <p className="text-slate-400 mt-2">Monitor and manage your cybersecurity threats</p>
            </div>

            {/* Overview Cards */}
            <OverviewCards />

            {/* Analytics and Recent Threats */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ThreatAnalytics />
              </div>
              <div>
                <RecentThreats />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
