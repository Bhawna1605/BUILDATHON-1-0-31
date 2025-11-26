// Threat Detection Engine - Classification and Risk Scoring

export type ThreatType = "phishing" | "malware" | "social-engineering" | "qr-scam" | "call-fraud" | "credential-theft"
export type SeverityLevel = "low" | "medium" | "high" | "critical"

export interface ThreatAnalysis {
  threatType: ThreatType
  severity: SeverityLevel
  riskScore: number // 0-1
  indicators: string[]
  recommendations: string[]
}

// Phishing detection indicators
const phishingIndicators = {
  commonDomains: ["secure", "verify", "confirm", "update", "alert", "urgent"],
  suspiciousPatterns: [
    /click here immediately/i,
    /verify your account/i,
    /confirm your identity/i,
    /unusual activity detected/i,
    /update payment method/i,
  ],
  requestsCredetials: /password|login|verify|confirm/i,
}

// Malware detection patterns
const malwareIndicators = {
  suspiciousExtensions: [".exe", ".dll", ".scr", ".vbs", ".bat", ".cmd"],
  dangerousDomains: ["malware", "trojan", "virus", "exploit", "payload"],
  suspiciousUrls: /download.*\.(exe|zip|rar)|drive-by|exploit|shellcode/i,
}

// Social engineering patterns
const socialEngineering = {
  urgencyKeywords: ["urgent", "immediate", "asap", "expire", "suspended", "limited time"],
  impersonation: /ceo|manager|director|hr|support|admin|bank/i,
  requestsAction: /click|download|open|enable|authorize|approve/i,
}

export function analyzeEmail(content: string, sender: string): ThreatAnalysis {
  let riskScore = 0
  const indicators: string[] = []

  // Check for phishing indicators
  if (phishingIndicators.suspiciousPatterns.some((p) => p.test(content))) {
    riskScore += 0.3
    indicators.push("Suspicious phishing language detected")
  }

  if (phishingIndicators.requestsCredetials.test(content)) {
    riskScore += 0.25
    indicators.push("Credential request detected")
  }

  // Check domain reputation
  phishingIndicators.commonDomains.forEach((domain) => {
    if (sender.includes(domain) && !sender.includes("@" + domain)) {
      riskScore += 0.2
      indicators.push(`Suspicious domain pattern: ${domain}`)
    }
  })

  // Check for social engineering
  if (socialEngineering.urgencyKeywords.some((kw) => content.includes(kw))) {
    riskScore += 0.15
    indicators.push("Urgency language patterns detected")
  }

  if (socialEngineering.impersonation.test(sender)) {
    riskScore += 0.1
    indicators.push("Potential impersonation attempt")
  }

  // Determine threat type and severity
  const threatType: ThreatType = "phishing"
  let severity: SeverityLevel

  if (riskScore >= 0.8) {
    severity = "critical"
    indicators.push("Multiple threat indicators present")
  } else if (riskScore >= 0.6) {
    severity = "high"
  } else if (riskScore >= 0.4) {
    severity = "medium"
  } else {
    severity = "low"
  }

  return {
    threatType,
    severity,
    riskScore: Math.min(1, riskScore),
    indicators,
    recommendations: [
      "Do not click links or download attachments",
      "Do not provide personal or financial information",
      "Report the email to your organization",
      "Delete the email",
    ],
  }
}

export function analyzeUrl(url: string): ThreatAnalysis {
  let riskScore = 0
  const indicators: string[] = []
  let threatType: ThreatType = "phishing"

  // Check for malware indicators
  if (malwareIndicators.suspiciousUrls.test(url)) {
    riskScore += 0.4
    indicators.push("Suspicious download or exploit detected")
    threatType = "malware"
  }

  // Check for encoded URLs
  if (url.includes("%") || url.includes("&#")) {
    riskScore += 0.2
    indicators.push("URL encoding detected")
  }

  // Check for IP addresses instead of domains
  if (/http:\/\/\d+\.\d+\.\d+\.\d+/.test(url)) {
    riskScore += 0.3
    indicators.push("Direct IP address used instead of domain")
  }

  // Check domain length (suspicious if very long)
  const domain = url.split("/")[2]
  if (domain && domain.length > 50) {
    riskScore += 0.15
    indicators.push("Unusually long domain name")
  }

  // Determine severity
  let severity: SeverityLevel
  if (riskScore >= 0.7) {
    severity = "critical"
  } else if (riskScore >= 0.5) {
    severity = "high"
  } else if (riskScore >= 0.3) {
    severity = "medium"
  } else {
    severity = "low"
  }

  return {
    threatType,
    severity,
    riskScore: Math.min(1, riskScore),
    indicators,
    recommendations: [
      "Do not visit this website",
      "Do not download files from this URL",
      "Report the URL to security team",
      "Clear browser cache if already visited",
    ],
  }
}

export function analyzePhoneNumber(phoneNumber: string, metadata?: any): ThreatAnalysis {
  let riskScore = 0
  const indicators: string[] = []
  const threatType: ThreatType = "call-fraud"

  // Check for known spoofing patterns
  if (phoneNumber.startsWith("+1-555")) {
    riskScore += 0.3
    indicators.push("Known test/spoofing number pattern")
  }

  // Check for pattern repetition (common spoofing)
  if (/(\d)\1{3,}/.test(phoneNumber)) {
    riskScore += 0.2
    indicators.push("Repetitive number pattern detected")
  }

  // Check metadata for red flags
  if (metadata?.callerName === "Unknown" && metadata?.callDuration === 0) {
    riskScore += 0.25
    indicators.push("Unanswered call from unknown number")
  }

  if (metadata?.transcript) {
    if (/verify|confirm|update|urgent|limited time/i.test(metadata.transcript)) {
      riskScore += 0.2
      indicators.push("Social engineering language in transcript")
    }
    if (/account|password|ssn|credit card/i.test(metadata.transcript)) {
      riskScore += 0.25
      indicators.push("Credential request detected in call")
    }
  }

  let severity: SeverityLevel
  if (riskScore >= 0.8) {
    severity = "critical"
  } else if (riskScore >= 0.6) {
    severity = "high"
  } else if (riskScore >= 0.4) {
    severity = "medium"
  } else {
    severity = "low"
  }

  return {
    threatType,
    severity,
    riskScore: Math.min(1, riskScore),
    indicators,
    recommendations: [
      "Do not answer calls from unknown numbers",
      "Hang up if asked for personal information",
      "Never provide account numbers or passwords over phone",
      "Report suspicious calls to authorities",
    ],
  }
}

export function analyzeQRCode(content: string, mascrowHash?: string): ThreatAnalysis {
  let riskScore = 0
  const indicators: string[] = []
  let threatType: ThreatType = "qr-scam"

  // Check for suspicious URL patterns
  if (content.includes("bit.ly") || content.includes("tinyurl")) {
    riskScore += 0.25
    indicators.push("URL shortener detected - actual destination unclear")
  }

  if (/https:\/\/.+\..+\/.*[?#].*=/.test(content)) {
    riskScore += 0.2
    indicators.push("URL contains tracking or redirect parameters")
  }

  // Check mascrow validation (blockchain-like verification)
  if (mascrowHash === undefined) {
    riskScore += 0.3
    indicators.push("Mascrow hash not provided - cannot verify authenticity")
  } else if (!isValidMascrowHash(mascrowHash, content)) {
    riskScore += 0.4
    indicators.push("Mascrow validation failed - QR code may be modified")
    threatType = "qr-scam"
  }

  // Check for payment-related QR codes (higher risk)
  if (/payment|transfer|send|crypto|wallet/i.test(content)) {
    riskScore += 0.2
    indicators.push("Financial transaction detected")
  }

  let severity: SeverityLevel
  if (riskScore >= 0.8) {
    severity = "critical"
  } else if (riskScore >= 0.6) {
    severity = "high"
  } else if (riskScore >= 0.4) {
    severity = "medium"
  } else {
    severity = "low"
  }

  return {
    threatType,
    severity,
    riskScore: Math.min(1, riskScore),
    indicators,
    recommendations: [
      "Do not scan QR codes from untrusted sources",
      "Verify the source of QR code before scanning",
      "Check the destination URL before clicking",
      "Use browser security features for additional protection",
    ],
  }
}

// Mascrow Hash Validation - Simple blockchain-inspired verification
export function generateMascrowHash(content: string, salt = ""): string {
  // In production, this would use actual cryptographic hashing
  const combined = content + salt
  let hash = 0
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return "hash_" + Math.abs(hash).toString(16)
}

export function isValidMascrowHash(providedHash: string, content: string): boolean {
  const calculatedHash = generateMascrowHash(content)
  return providedHash === calculatedHash
}

export function calculateOverallRiskScore(analyses: ThreatAnalysis[]): number {
  if (analyses.length === 0) return 0
  const total = analyses.reduce((sum, analysis) => sum + analysis.riskScore, 0)
  return Math.min(1, total / analyses.length)
}
