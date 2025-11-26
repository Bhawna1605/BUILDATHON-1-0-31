"use client"

import { Card } from "@/components/ui/card"
import { Phone, AlertTriangle } from "lucide-react"

export default function PhoneEvidencePage() {
  const indicators = [
    {
      name: "Spoofing Pattern (555 Prefix)",
      score: 0.4,
      description: "555 numbers are reserved test numbers, never used for real calls",
    },
    {
      name: "Repetitive Digit Pattern",
      score: 0.25,
      description: "Numbers like 1111111111 or 2222222222 indicate spoofing",
    },
    { name: "Sequential Patterns", score: 0.2, description: "Patterns like 123456789 or 000-111-2222" },
    {
      name: "Unanswered Call from Unknown",
      score: 0.25,
      description: "Missed calls from unknown numbers often social engineering",
    },
    {
      name: "Social Engineering Language",
      score: 0.2,
      description: "Urgent, verify, confirm, act now, update account",
    },
    { name: "Credential Requests", score: 0.25, description: "Asking for passwords, PINs, SSN, credit cards" },
    { name: "Impersonation Patterns", score: 0.15, description: "Claiming to be bank, IRS, tech support" },
    {
      name: "Urgency & Pressure Tactics",
      score: 0.15,
      description: "Limited time offer, account suspended, immediate action",
    },
    {
      name: "Silent or Robocall Characteristics",
      score: 0.2,
      description: "Background noise, automated voice, silence",
    },
    { name: "Invalid Phone Format", score: 0.2, description: "Incomplete or malformed phone numbers" },
  ]

  const example = {
    phone: "+1-555-123-4567",
    transcript: "Your account has been suspended. Verify your identity now by providing your SSN.",
    breakdown: [
      "Starts with 555 (test number): +0.4",
      'Social engineering language ("suspended", "now"): +0.2',
      "Credential request (SSN): +0.25",
      "Urgency language: +0.15",
      "Total Risk Score: 1.0 (CRITICAL)",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
              <Phone className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Phone Fraud Detection Methodology</h1>
          </div>
          <p className="text-slate-400">Call fraud, spoofing detection, and social engineering pattern analysis</p>
        </div>

        {/* Overview */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
          <p className="text-slate-300">
            Phone fraud detection analyzes caller patterns, number format, transcript content, and pressure tactics.
            Reserved test numbers (555 prefix), repetitive patterns, and social engineering language are key indicators
            of fraud calls.
          </p>
        </Card>

        {/* Fraud Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">10 Fraud Detection Indicators</h2>
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-purple-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-purple-500/20 border border-purple-500/30">
                      <span className="text-sm font-semibold text-purple-400">
                        +{(indicator.score * 100).toFixed(0)}
                      </span>
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
          <div className="space-y-4 mb-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">Phone Number:</div>
              <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">{example.phone}</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Call Transcript:</div>
              <div className="bg-slate-900/50 rounded-lg p-3 text-sm text-slate-300 italic">"{example.transcript}"</div>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {example.breakdown.map((line, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300">{line}</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-sm font-semibold text-red-400">Verdict: CRITICAL FRAUD</div>
            <div className="text-xs text-red-300 mt-1">
              Hang up immediately, do not provide any personal information
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
