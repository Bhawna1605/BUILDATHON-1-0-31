import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { analyzeEmail } from "@/lib/threat-detection"
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
    const { sender, content } = body

    // Analyze message (reuse email analyzer)
    const analysis = analyzeEmail(content, sender)

    // Use AI for SMS fraud analysis
    const { text: aiAnalysis } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Analyze this SMS/message for fraud and scams:
From: ${sender}
Message: ${content}
Risk Level: ${analysis.severity}
Threat Indicators: ${analysis.indicators.join(", ")}

Provide a brief one-sentence assessment of the message's legitimacy:`,
    })

    // Store alert
    const { data: alert } = await supabase.from("fraud_alerts").insert({
      user_id: user.id,
      alert_type: "message",
      sender,
      content,
      risk_level: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
      indicators: analysis.indicators,
      ai_analysis: aiAnalysis.trim(),
    })

    // Create notification
    if (analysis.severity === "critical" || analysis.severity === "high") {
      await supabase.from("notifications").insert({
        user_id: user.id,
        notification_type: "fraud-alert",
        title: "Suspicious Message Detected",
        message: `Scam message from ${sender}: ${aiAnalysis.trim().substring(0, 100)}...`,
        priority: analysis.severity,
      })
    }

    return NextResponse.json({
      success: true,
      alert: {
        id: alert?.[0]?.id || Date.now().toString(),
        type: "message",
        sender,
        content,
        timestamp: new Date().toLocaleString(),
        riskLevel: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
        reason: analysis.indicators,
        aiAnalysis: aiAnalysis.trim(),
      },
    })
  } catch (error) {
    console.error("Message analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
