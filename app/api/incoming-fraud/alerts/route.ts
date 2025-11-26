import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get recent fraud alerts
    const { data: alerts, error } = await supabase
      .from("fraud_alerts")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)

    if (error) throw error

    // Format alerts
    const formattedAlerts = (alerts || []).map((alert: any) => ({
      id: alert.id,
      type: alert.alert_type,
      sender: alert.sender,
      content: alert.content,
      timestamp: new Date(alert.created_at).toLocaleString(),
      riskLevel: alert.risk_level,
      reason: alert.indicators || [],
      aiAnalysis: alert.ai_analysis,
    }))

    return NextResponse.json({ alerts: formattedAlerts })
  } catch (error) {
    console.error("Error fetching alerts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
