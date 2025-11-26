"use client"

import { Card } from "@/components/ui/card"
import { MessageSquare, AlertTriangle } from "lucide-react"

export default function MessageEvidencePage() {
  const indicators = [
    {
      name: "Phishing Keywords",
      score: 0.1,
      description: "Verify, confirm, urgent, immediate, limited time, expire, act now",
    },
    { name: "Credential Requests", score: 0.2, description: "Asking for password, PIN, CVV, SSN, OTP, security codes" },
    { name: "URL Shorteners", score: 0.15, description: "Shortened URLs hiding true destination" },
    { name: "IP Address URLs", score: 0.15, description: "Direct IP addresses instead of domain names" },
    { name: "Urgency Language", score: 0.1, description: "Urgent, immediate, today, now, hurry, expired, act now" },
    { name: "Financial Keywords", score: 0.15, description: "Transfer, payment, crypto, wire, bank account, money" },
    { name: "Auto-Generated Sender", score: 0.1, description: "no-reply, noreply email addresses" },
    {
      name: "Company Impersonation",
      score: 0.1,
      description: "Claiming to be Apple, Amazon, Microsoft, Google, PayPal",
    },
    { name: "Suspicious Short Message", score: 0.1, description: "Very short message with suspicious link" },
    { name: "Grammar & Spelling Errors", score: 0.1, description: "Professional services rarely have poor grammar" },
  ]

  const examples = [
    {
      sender: "noreply@app1e-verify.com",
      content: "Your Apple account has been suspended. URGENT: Verify your identity NOW at bit.ly/verify-apple",
      score: 0.85,
      breakdown: [
        "Auto-generated sender (noreply): +0.1",
        "Company impersonation (Apple): +0.1",
        "Phishing keywords (suspended, URGENT, NOW): +0.3",
        "Urgency language: +0.1",
        "URL shortener: +0.15",
        "Total: 0.75 (HIGH)",
      ],
    },
    {
      sender: "support@amaz0n-secure.co",
      content: "Please verify your account now. We need your password and CVV for security verification.",
      score: 0.95,
      breakdown: [
        "Company impersonation (Amazon): +0.1",
        "Phishing keywords (verify, now): +0.2",
        "Credential requests (password, CVV): +0.2",
        "Urgency language: +0.1",
        "Direct credential request: +0.2",
        "Total: 0.80 (HIGH to CRITICAL)",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg border border-red-500/30">
              <MessageSquare className="w-6 h-6 text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Message Fraud Detection Methodology</h1>
          </div>
          <p className="text-slate-400">SMS, Email, and Chat Message fraud detection and phishing analysis</p>
        </div>

        {/* Overview */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
          <p className="text-slate-300">
            Message fraud detection analyzes sender information, content keywords, urgency tactics, and credential
            requests. It identifies phishing emails, scam SMS, and fraudulent chat messages by detecting social
            engineering patterns and impersonation attempts.
          </p>
        </Card>

        {/* Fraud Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">10 Fraud Detection Indicators</h2>
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-red-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-500/20 border border-red-500/30">
                      <span className="text-sm font-semibold text-red-400">+{(indicator.score * 100).toFixed(0)}</span>
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

        {/* Example Analyses */}
        <div className="space-y-6">
          {examples.map((example, idx) => (
            <Card key={idx} className="bg-slate-800/50 border-slate-700/50 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Example {idx + 1}: Real-World Fraud</h2>
              <div className="space-y-4 mb-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">From:</div>
                  <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300">
                    {example.sender}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400 mb-1">Message:</div>
                  <div className="bg-slate-900/50 rounded-lg p-3 text-sm text-slate-300 italic">{example.content}</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                {example.breakdown.map((line, bidx) => (
                  <div key={bidx} className="flex items-center gap-3 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="text-slate-300">{line}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <div className="text-sm font-semibold text-red-400">Verdict: CRITICAL FRAUD</div>
                <div className="text-xs text-red-300 mt-1">
                  Delete this message immediately, never click links or provide information
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
