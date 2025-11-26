import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { analyzePhoneNumber } from "@/lib/threat-detection"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { phoneNumber, transcript } = body

    // Analyze call using threat detection
    const analysis = analyzePhoneNumber(phoneNumber, { transcript })

    const { text: aiAnalysis } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Analyze this incoming call for fraud:
Phone: ${phoneNumber}
Transcript: ${transcript}
Risk Level: ${analysis.severity}
Threat Indicators: ${analysis.indicators.join(", ")}

Provide a brief one-sentence fraud assessment:`,
    })

    // Store alert in database
    const { data: alert } = await supabase.from("fraud_alerts").insert({
      user_id: user.id,
      alert_type: "call",
      sender: phoneNumber,
      content: transcript,
      risk_level: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
      indicators: analysis.indicators,
      ai_analysis: aiAnalysis.trim(),
    })

    if (analysis.severity === "critical" || analysis.severity === "high") {
      await supabase.from("notifications").insert({
        user_id: user.id,
        notification_type: "fraud-alert",
        title: "Potential Call Fraud Detected",
        message: `Suspicious call from ${phoneNumber}: ${aiAnalysis.trim().substring(0, 100)}...`,
        priority: analysis.severity,
      })
    }

    return NextResponse.json({
      success: true,
      alert: {
        id: alert?.[0]?.id || Date.now().toString(),
        type: "call",
        sender: phoneNumber,
        content: transcript,
        timestamp: new Date().toLocaleString(),
        riskLevel: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
        reason: analysis.indicators,
        aiAnalysis: aiAnalysis.trim(),
      },
    })
  } catch (error) {
    console.error("Call analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
