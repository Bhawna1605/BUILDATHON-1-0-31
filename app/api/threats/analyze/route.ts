import { createClient } from "@/lib/supabase/server"
import { analyzeEmail, analyzeUrl, analyzePhoneNumber, analyzeQRCode } from "@/lib/threat-detection"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, content, metadata } = body

    let analysis

    switch (type) {
      case "email":
        analysis = analyzeEmail(content.body, content.sender)
        break
      case "url":
        analysis = analyzeUrl(content)
        break
      case "phone":
        analysis = analyzePhoneNumber(content, metadata)
        break
      case "qr":
        analysis = analyzeQRCode(content, metadata?.mascrowHash)
        break
      default:
        return NextResponse.json({ error: "Invalid threat type" }, { status: 400 })
    }

    // Store threat log in database
    const { data: threatLog, error: insertError } = await supabase.from("threat_logs").insert({
      user_id: user.id,
      threat_type: analysis.threatType,
      severity_level: analysis.severity,
      description: analysis.indicators.join(", "),
      detected_url: type === "url" ? content : null,
      detected_email: type === "email" ? content.sender : null,
      source: "api-call",
      status: "pending",
    })

    if (insertError) {
      console.error("Error storing threat log:", insertError)
    }

    // Create notification if threat is medium or higher
    if (analysis.severity !== "low") {
      await supabase.from("notifications").insert({
        user_id: user.id,
        notification_type: "threat-alert",
        title: `${analysis.threatType.charAt(0).toUpperCase() + analysis.threatType.slice(1)} Detected`,
        message: analysis.indicators.join(", "),
        threat_log_id: threatLog?.[0]?.id,
        priority: analysis.severity,
      })
    }

    return NextResponse.json({
      success: true,
      analysis,
      threatLogId: threatLog?.[0]?.id,
    })
  } catch (error) {
    console.error("Threat analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
