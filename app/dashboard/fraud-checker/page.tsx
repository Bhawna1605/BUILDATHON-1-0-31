import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { FraudCheckerPanel } from "@/components/fraud-checker-panel"

export default async function FraudCheckerPage() {
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
              <h1 className="text-3xl font-bold text-white">Fraud Checker</h1>
              <p className="text-slate-400 mt-2">
                Check URLs, phone numbers, QR codes, and WhatsApp links for fraud and phishing indicators
              </p>
            </div>
            <FraudCheckerPanel userId={data.user.id} />
          </div>
        </main>
      </div>
    </div>
  )
}
