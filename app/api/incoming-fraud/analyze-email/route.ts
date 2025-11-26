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

    // Analyze email using threat detection
    const analysis = analyzeEmail(content, sender)

    // Use AI to generate detailed phishing analysis
    const { text: aiAnalysis } = await generateText({
      model: "openai/gpt-5-mini",
      prompt: `Analyze this email for phishing and fraud:
From: ${sender}
Content: ${content.substring(0, 500)}
Risk Level: ${analysis.severity}
Threat Indicators: ${analysis.indicators.join(", ")}

Provide a brief one-sentence assessment of the email's legitimacy:`,
    })

    // Store alert
    const { data: alert } = await supabase.from("fraud_alerts").insert({
      user_id: user.id,
      alert_type: "email",
      sender,
      content: content.substring(0, 1000),
      risk_level: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
      indicators: analysis.indicators,
      ai_analysis: aiAnalysis.trim(),
    })

    // Create notification for dangerous emails
    if (analysis.severity === "critical" || analysis.severity === "high") {
      await supabase.from("notifications").insert({
        user_id: user.id,
        notification_type: "fraud-alert",
        title: "Phishing Email Detected",
        message: `Suspicious email from ${sender}: ${aiAnalysis.trim().substring(0, 100)}...`,
        priority: analysis.severity,
      })
    }

    return NextResponse.json({
      success: true,
      alert: {
        id: alert?.[0]?.id || Date.now().toString(),
        type: "email",
        sender,
        content: content.substring(0, 200),
        timestamp: new Date().toLocaleString(),
        riskLevel: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
        reason: analysis.indicators,
        aiAnalysis: aiAnalysis.trim(),
      },
    })
  } catch (error) {
    console.error("Email analysis error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
