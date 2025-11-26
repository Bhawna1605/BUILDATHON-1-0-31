import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { CallFraudPanel } from "@/components/call-fraud-panel"

export default async function CallFraudPage() {
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
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Call Fraud Detection</h1>
              <p className="text-slate-400 mt-2">Monitor and authorize incoming calls</p>
            </div>
            <CallFraudPanel userId={data.user.id} />
          </div>
        </main>
      </div>
    </div>
  )
}
