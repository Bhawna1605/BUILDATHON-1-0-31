"use client"

import { Card } from "@/components/ui/card"
import { Globe, AlertTriangle } from "lucide-react"

export default function URLEvidencePage() {
  const indicators = [
    {
      name: "IP Address Instead of Domain",
      score: 0.25,
      description: "Direct IP addresses (192.168.1.1) indicate suspicious hosting",
    },
    {
      name: "@ Symbol (Credential Embedding)",
      score: 0.2,
      description: "URLs with @ can hide credentials: http://fake@real.com",
    },
    {
      name: "Suspicious Domain Length",
      score: 0.15,
      description: "Unusually long domains (>50 chars) often used for obfuscation",
    },
    { name: "URL Shorteners (bit.ly, tinyurl)", score: 0.25, description: "Hidden destination URLs mask final target" },
    {
      name: "Phishing Keywords in Domain",
      score: 0.15,
      description: 'Domains containing "secure", "verify", "update", "alert"',
    },
    { name: "No HTTPS Encryption", score: 0.1, description: "Missing SSL/TLS certificate protection" },
    {
      name: "Redirect/Forwarding Parameters",
      score: 0.2,
      description: "Query parameters like ?redirect= or ?url=' lead elsewhere",
    },
    {
      name: "Excessive Query Parameters",
      score: 0.15,
      description: "Complex parameters (>100 chars) often tracking or obfuscation",
    },
    { name: "Suspicious Domain Patterns", score: 0.2, description: "Numbers mimicking letters: amaz0n.com (0 not o)" },
    {
      name: "Dynamic/Encoded Content",
      score: 0.2,
      description: "URL encoding or JavaScript encoding hides true destination",
    },
  ]

  const example = {
    url: "http://195.154.32.145/secure-verify-update/?redirect=https://bit.ly/xyz123&utm_source=trusted",
    breakdown: [
      "Uses HTTP instead of HTTPS: +0.1",
      "Direct IP address: +0.25",
      'Contains "secure-verify-update" keywords: +0.15',
      "Has redirect parameter: +0.2",
      "Uses URL shortener: +0.25",
      "Total Risk Score: 0.95 (CRITICAL)",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">URL Fraud Detection Methodology</h1>
          </div>
          <p className="text-slate-400">Complete guide to URL analysis, phishing indicators, and fraud scoring</p>
        </div>

        {/* Overview */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
          <p className="text-slate-300">
            URLs are analyzed for phishing, malware, and social engineering patterns. PhishNet Sentinel examines domain
            reputation, URL structure, protocol security, and destination clarity. Each suspicious pattern adds points
            to the fraud score.
          </p>
        </Card>

        {/* Fraud Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">15 Fraud Detection Indicators</h2>
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-blue-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <span className="text-sm font-semibold text-blue-400">+{(indicator.score * 100).toFixed(0)}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{indicator.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{indicator.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Example Analysis */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Example: Real-World Fraud Detection</h2>
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 font-mono text-sm text-slate-300 break-all">
            {example.url}
          </div>
          <div className="space-y-2">
            {example.breakdown.map((line, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300">{line}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-sm font-semibold text-red-400">Verdict: CRITICAL FRAUD</div>
            <div className="text-xs text-red-300 mt-1">This URL should never be clicked or visited</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
