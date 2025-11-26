import { createClient } from "@/lib/supabase/server"
import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

// Fraud pattern detection functions
function analyzeUrl(url: string): { score: number; indicators: string[] } {
  let score = 0
  const indicators: string[] = []

  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname

    // Check for suspicious patterns
    if (url.includes("@")) {
      score += 0.2
      indicators.push("URL contains @ symbol (credential embedding)")
    }

    if (/(\d+\.\d+\.\d+\.\d+)/.test(domain)) {
      score += 0.25
      indicators.push("Direct IP address instead of domain name")
    }

    if (domain.length > 50) {
      score += 0.15
      indicators.push("Unusually long domain name")
    }

    if (domain.includes("-") && domain.split("-").some((part) => /^\d+$/.test(part))) {
      score += 0.2
      indicators.push("Suspicious domain with number patterns")
    }

    if (/\d{1,3}\.\d{1,3}/.test(domain)) {
      score += 0.25
      indicators.push("Domain contains numeric sequences")
    }

    if (domain.includes("secure") || domain.includes("verify") || domain.includes("update")) {
      score += 0.15
      indicators.push("Common phishing keywords in domain")
    }

    // Check for HTTPS
    if (urlObj.protocol !== "https:") {
      score += 0.1
      indicators.push("Not using HTTPS encryption")
    }

    // Check for suspicious query parameters
    if (urlObj.search.length > 100) {
      score += 0.15
      indicators.push("Excessive query parameters detected")
    }

    if (urlObj.search.includes("redirect") || urlObj.search.includes("url=")) {
      score += 0.2
      indicators.push("Redirect or forwarding parameters detected")
    }
  } catch {
    score += 0.3
    indicators.push("Invalid URL format detected")
  }

  return { score: Math.min(1, score), indicators }
}

function analyzePhoneNumber(phone: string): { score: number; indicators: string[] } {
  let score = 0
  const indicators: string[] = []

  // Remove formatting
  const cleanPhone = phone.replace(/\D/g, "")

  if (cleanPhone.length < 10) {
    score += 0.2
    indicators.push("Phone number too short")
  }

  // Check for spoofing patterns
  if (cleanPhone.startsWith("555")) {
    score += 0.4
    indicators.push("Known test/spoofing number (555 prefix)")
  }

  if (/(.)\\1{3,}/.test(cleanPhone)) {
    score += 0.25
    indicators.push("Repetitive number pattern detected")
  }

  if (/000|111|222|333|444|555|666|777|888|999/.test(cleanPhone)) {
    score += 0.2
    indicators.push("Sequential number pattern detected")
  }

  return { score: Math.min(1, score), indicators }
}

function analyzeQRCode(content: string): { score: number; indicators: string[] } {
  let score = 0
  const indicators: string[] = []

  // Check for URL shorteners
  if (content.includes("bit.ly") || content.includes("tinyurl") || content.includes("short.url")) {
    score += 0.3
    indicators.push("URL shortener detected - destination unclear")
  }

  // Check for suspicious URLs
  if (/https:\/\/.+@/.test(content)) {
    score += 0.25
    indicators.push("Credential embedding in URL")
  }

  // Check for payment QR codes
  if (/payment|transfer|upi|bitcoin|crypto|wallet/.test(content.toLowerCase())) {
    score += 0.2
    indicators.push("Financial transaction detected")
  }

  // Check for redirect patterns
  if (/redirect|forward|utm_|tracking/.test(content.toLowerCase())) {
    score += 0.2
    indicators.push("Redirect or tracking parameters detected")
  }

  return { score: Math.min(1, score), indicators }
}

function analyzeWhatsAppUrl(url: string): { score: number; indicators: string[] } {
  let score = 0
  const indicators: string[] = []

  // Valid WhatsApp URL formats
  if (!url.includes("wa.me") && !url.includes("whatsapp.com") && !url.includes("chat.whatsapp.com")) {
    score += 0.3
    indicators.push("Not a valid WhatsApp URL format")
  }

  // Check for modified URLs
  if (url.includes(".tk") || url.includes(".ml") || url.includes(".ga")) {
    score += 0.25
    indicators.push("Suspicious TLD detected (known for abuse)")
  }

  // Check for phishing keywords
  if (/verify|confirm|update|urgent/.test(url.toLowerCase())) {
    score += 0.2
    indicators.push("Phishing keywords detected in URL")
  }

  // Check for legitimate WhatsApp domains
  if (url.includes("whatsapp.com") || url.includes("wa.me")) {
    score -= 0.1 // Reduce score for legitimate domains
  }

  return { score: Math.max(0, Math.min(1, score)), indicators }
}

function analyzeMessage(senderInput: string, messageContent: string): { score: number; indicators: string[] } {
  let score = 0
  const indicators: string[] = []

  // Check for phishing indicators in message content
  const phishingKeywords = [
    "verify",
    "confirm",
    "urgent",
    "immediate",
    "account suspended",
    "update payment",
    "click here",
    "limited time",
    "act now",
    "expire",
  ]

  phishingKeywords.forEach((keyword) => {
    if (messageContent.toLowerCase().includes(keyword)) {
      score += 0.1
      indicators.push(`Phishing keyword detected: "${keyword}"`)
    }
  })

  // Check for credential requests
  if (/password|pin|cvv|ssn|otp|code|token|secret|auth/i.test(messageContent)) {
    score += 0.2
    indicators.push("Credential request detected")
  }

  // Check for suspicious URLs in message
  const urlPattern = /(https?:\/\/[^\s]+)/g
  const urlMatches = messageContent.match(urlPattern) || []
  if (urlMatches.length > 0) {
    urlMatches.forEach((url) => {
      if (url.includes("bit.ly") || url.includes("tinyurl") || url.includes("short")) {
        score += 0.15
        indicators.push(`URL shortener in message: ${url.substring(0, 30)}...`)
      }
      if (/https?:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
        score += 0.15
        indicators.push("IP address URL detected")
      }
    })
  }

  // Check for urgency language
  const urgencyPattern = /(urgent|asap|immediate|today|now|hurry|expired|suspend|close|act now|limited time|rush)/i
  if (urgencyPattern.test(messageContent)) {
    score += 0.1
    indicators.push("Urgency language detected")
  }

  // Check for financial keywords
  if (/transfer|payment|crypto|bitcoin|wire|bank account|money|send cash|gift card/i.test(messageContent)) {
    score += 0.15
    indicators.push("Financial transaction requested")
  }

  // Check sender for red flags
  if (senderInput.toLowerCase().includes("no-reply") || senderInput.toLowerCase().includes("noreply")) {
    score += 0.1
    indicators.push("Auto-generated sender address")
  }

  // Check for impersonation patterns
  if (/your bank|apple|amazon|microsoft|google|paypal|ibm/i.test(messageContent)) {
    score += 0.1
    indicators.push("Company impersonation detected")
  }

  // Check message length (very short messages sometimes phishing)
  if (messageContent.trim().length < 20 && messageContent.includes("http")) {
    score += 0.1
    indicators.push("Suspicious short message with link")
  }

  return { score: Math.min(1, score), indicators }
}

function getRiskLevel(score: number): "safe" | "low" | "medium" | "high" | "critical" {
  if (score < 0.2) return "safe"
  if (score < 0.4) return "low"
  if (score < 0.6) return "medium"
  if (score < 0.8) return "high"
  return "critical"
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { checkType, inputValue } = await request.json()

    if (!checkType || !inputValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    let analysisResult: { score: number; indicators: string[] }
    let aiPrompt = ""
    let displayValue = inputValue

    // Analyze based on type
    switch (checkType) {
      case "url":
        analysisResult = analyzeUrl(inputValue)
        aiPrompt = `Analyze this URL for fraud/phishing risks: "${inputValue}". Risk score: ${analysisResult.score}. Indicators: ${analysisResult.indicators.join(", ")}. Provide a brief security assessment and recommendation.`
        break
      case "phone":
        analysisResult = analyzePhoneNumber(inputValue)
        aiPrompt = `Analyze this phone number for spoofing/fraud: "${inputValue}". Risk score: ${analysisResult.score}. Indicators: ${analysisResult.indicators.join(", ")}. Provide a brief assessment.`
        break
      case "qr":
        analysisResult = analyzeQRCode(inputValue)
        aiPrompt = `Analyze this QR code content for fraud: "${inputValue}". Risk score: ${analysisResult.score}. Indicators: ${analysisResult.indicators.join(", ")}. Provide recommendations.`
        break
      case "whatsapp":
        analysisResult = analyzeWhatsAppUrl(inputValue)
        aiPrompt = `Analyze this WhatsApp URL for fraud: "${inputValue}". Risk score: ${analysisResult.score}. Indicators: ${analysisResult.indicators.join(", ")}. Is it safe?`
        break
      case "message":
        const [sender, content] = inputValue.split("|||")
        analysisResult = analyzeMessage(sender, content)
        displayValue = content
        aiPrompt = `Analyze this message for scams and fraud:\nFrom: ${sender}\nContent: ${content}\n\nRisk score: ${analysisResult.score}. Indicators: ${analysisResult.indicators.join(", ")}. Provide a brief assessment and safety recommendation.`
        break
      default:
        return NextResponse.json({ error: "Invalid check type" }, { status: 400 })
    }

    // Get AI analysis
    let aiAnalysis = ""
    try {
      const { text } = await generateText({
        model: "openai/gpt-4o-mini",
        prompt: aiPrompt,
      })
      aiAnalysis = text
    } catch (error) {
      console.log("[v0] AI analysis error:", error)
      aiAnalysis =
        "AI analysis temporarily unavailable. Pattern-based analysis: " + analysisResult.indicators.join("; ")
    }

    const riskLevel = getRiskLevel(analysisResult.score)

    // Save to database
    const { error: insertError } = await supabase.from("fraud_checker_history").insert({
      user_id: user.id,
      check_type: checkType,
      input_value: displayValue,
      fraud_score: analysisResult.score,
      risk_level: riskLevel,
      indicators: analysisResult.indicators,
      ai_analysis: aiAnalysis,
    })

    if (insertError) {
      console.error("Error saving fraud check:", insertError)
    }

    return NextResponse.json({
      checkType,
      inputValue: displayValue,
      fraudScore: analysisResult.score,
      riskLevel,
      indicators: analysisResult.indicators,
      aiAnalysis,
    })
  } catch (error) {
    console.error("Error analyzing fraud:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
