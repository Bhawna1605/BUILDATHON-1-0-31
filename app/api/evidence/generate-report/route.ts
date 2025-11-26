import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { checkType, inputValue, fraudScore, riskLevel, indicators, aiAnalysis } = body

    if (!checkType || !inputValue || fraudScore === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get methodology based on check type
    const methodologies: Record<string, string> = {
      url: `URL Fraud Detection Methodology:
- IP Address Analysis: Direct IP addresses instead of domain names indicate suspicious hosting (+0.25)
- Credential Embedding: URLs with @ symbol can hide credentials like user:pass@fake.com (+0.2)
- URL Shorteners: Services like bit.ly hide the actual destination URL (+0.25)
- Phishing Keywords: Domains containing "secure", "verify", "update", "alert" (+0.15)
- Protocol Security: Missing HTTPS/SSL encryption leaves data vulnerable (+0.1)
- Redirect Parameters: Query parameters like ?redirect= lead to different destinations (+0.2)
- Domain Length: Unusually long domains (>50 chars) used for obfuscation (+0.15)
- Suspicious Patterns: Numbers mimicking letters like amaz0n.com instead of amazon.com (+0.2)

Risk Score: ${(fraudScore * 100).toFixed(1)}% - ${riskLevel.toUpperCase()}`,

      phone: `Phone Fraud Detection Methodology:
- Spoofing Patterns: 555 prefix numbers are reserved test numbers (+0.4)
- Repetitive Digits: Numbers like 1111111111 indicate spoofing attempts (+0.25)
- Sequential Patterns: Numbers like 123456789 are fraudulent (+0.2)
- Unanswered Calls: Missed calls from unknown numbers often social engineering (+0.25)
- Social Engineering Language: Keywords like "urgent", "verify", "confirm" (+0.2)
- Credential Requests: Asking for passwords, PINs, SSN, credit cards (+0.25)
- Impersonation Patterns: Claiming to be bank, IRS, tech support (+0.15)
- Urgency Tactics: "Limited time", "suspended", "immediate action" (+0.15)

Risk Score: ${(fraudScore * 100).toFixed(1)}% - ${riskLevel.toUpperCase()}`,

      qr: `QR Code Fraud Detection Methodology:
- URL Shorteners: bit.ly, tinyurl hide destination URLs (+0.3)
- Mascrow Hash Validation: Blockchain-inspired verification of QR authenticity (+0.4)
- Credential Embedding: URLs with credentials hidden in URLs (+0.25)
- Payment Scams: Keywords like "payment", "crypto", "wallet" (+0.2)
- Tracking Parameters: UTM and redirect parameters for phishing (+0.2)
- IP Address URLs: Direct IPs instead of domains (+0.25)
- Missing Encryption: No HTTPS protocol protection (+0.15)
- Phishing Keywords: "verify", "confirm", "update" in QR content (+0.15)

Risk Score: ${(fraudScore * 100).toFixed(1)}% - ${riskLevel.toUpperCase()}`,

      whatsapp: `WhatsApp URL Fraud Detection Methodology:
- Domain Validation: Legitimate WhatsApp domains are wa.me, whatsapp.com, chat.whatsapp.com
- Suspicious TLDs: .tk, .ml, .ga are known for abuse and scams
- Phishing Keywords: URLs containing "verify", "confirm", "update", "urgent"
- URL Structure: Proper WhatsApp URL format validation
- Credential Requests: Hidden credential stealing parameters

Risk Score: ${(fraudScore * 100).toFixed(1)}% - ${riskLevel.toUpperCase()}`,

      message: `Message Fraud Detection Methodology:
- Phishing Keywords: "verify", "confirm", "urgent", "immediate", "limited time" (+0.1 each)
- Credential Requests: Password, PIN, CVV, SSN, OTP requests (+0.2)
- URL Shorteners: Shortened URLs hiding true destinations (+0.15)
- IP Address URLs: Direct IP addresses in messages (+0.15)
- Urgency Language: "Hurry", "expire", "act now", "suspended" (+0.1)
- Financial Keywords: "transfer", "payment", "crypto", "wire", "bank account" (+0.15)
- Auto-Generated Senders: no-reply, noreply email addresses (+0.1)
- Company Impersonation: Claiming to be Apple, Amazon, Microsoft, Google, PayPal (+0.1)
- Grammar Errors: Professional services rarely have poor grammar (+0.1)

Risk Score: ${(fraudScore * 100).toFixed(1)}% - ${riskLevel.toUpperCase()}`,
    }

    const methodology = methodologies[checkType] || "General Fraud Analysis Methodology"

    // Save evidence report
    const { data: report, error: insertError } = await supabase
      .from("evidence_reports")
      .insert({
        user_id: user.id,
        evidence_type: checkType,
        input_value: inputValue.substring(0, 500),
        fraud_score: fraudScore,
        risk_level: riskLevel,
        detected_indicators: indicators,
        methodology_explanation: methodology,
        ai_analysis: aiAnalysis,
      })
      .select()

    if (insertError) {
      console.error("Error saving evidence report:", insertError)
      return NextResponse.json({ error: "Failed to save report" }, { status: 500 })
    }

    // Generate exportable text format
    const textReport = `
================================================================================
                    PHISHNET SENTINEL EVIDENCE REPORT
================================================================================

Generated: ${new Date().toLocaleString()}
Report ID: ${report[0]?.id}
User: ${user.email}

================================================================================
FRAUD DETECTION SUMMARY
================================================================================

Check Type: ${checkType.toUpperCase()}
Input: ${inputValue.substring(0, 100)}...
Fraud Score: ${(fraudScore * 100).toFixed(1)}/100
Risk Level: ${riskLevel.toUpperCase()}

================================================================================
DETECTED INDICATORS (${indicators.length})
================================================================================
${indicators.map((ind: string, idx: number) => `${idx + 1}. ${ind}`).join("\n")}

================================================================================
DETECTION METHODOLOGY
================================================================================
${methodology}

================================================================================
AI ANALYSIS
================================================================================
${aiAnalysis}

================================================================================
VERIFICATION DETAILS
================================================================================
System: PhishNet Sentinel v1.0
Authentication: Supabase User ID
Timestamp: ${new Date().toISOString()}
Report Valid For: Legal and law enforcement proceedings

DISCLAIMER: This report is generated based on pattern analysis and AI assessment.
It is intended for informational purposes and fraud prevention. Users should 
cross-reference with official databases and consult with cybersecurity experts
when filing legal complaints.

================================================================================
`

    return NextResponse.json({
      success: true,
      reportId: report[0]?.id,
      textReport,
      data: {
        checkType,
        inputValue,
        fraudScore,
        riskLevel,
        indicators,
        methodology,
        aiAnalysis,
      },
    })
  } catch (error) {
    console.error("Error generating evidence report:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
