import { createClient } from "@/lib/supabase/server"
import { analyzeQRCode, generateMascrowHash } from "@/lib/threat-detection"
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
    const { qrContent, mascrowHash } = body

    // Generate or validate mascrow hash
    const generatedHash = generateMascrowHash(qrContent)
    const isValid = mascrowHash === generatedHash

    // Analyze QR code
    const analysis = analyzeQRCode(qrContent, mascrowHash)

    // Store QR scan in database
    const { data: qrScan, error: insertError } = await supabase.from("qr_scans").insert({
      user_id: user.id,
      qr_content: qrContent,
      decoded_url: extractUrl(qrContent),
      mascrow_hash: generatedHash,
      is_verified: isValid,
      risk_level: analysis.severity === "critical" ? "dangerous" : analysis.severity === "high" ? "warning" : "safe",
      threat_detected: analysis.indicators.join(", "),
    })

    if (insertError) {
      console.error("Error storing QR scan:", insertError)
    }

    // Create notification for dangerous QR codes
    if (analysis.severity === "critical" || analysis.severity === "high") {
      await supabase.from("notifications").insert({
        user_id: user.id,
        notification_type: "threat-alert",
        title: "Dangerous QR Code Detected",
        message: `QR code risk level: ${analysis.severity}. ${analysis.indicators.join(", ")}`,
        threat_log_id: null,
        priority: analysis.severity,
      })
    }

    return NextResponse.json({
      success: true,
      analysis,
      isValidMascrow: isValid,
      qrScanId: qrScan?.[0]?.id,
    })
  } catch (error) {
    console.error("QR validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function extractUrl(content: string): string {
  try {
    if (content.startsWith("http")) {
      return content.split(/\s/)[0]
    }
    return content
  } catch {
    return content
  }
}
