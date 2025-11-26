"use client"

import { Card } from "@/components/ui/card"
import { QrCode, AlertTriangle } from "lucide-react"

export default function QREvidencePage() {
  const indicators = [
    { name: "URL Shortener Detection", score: 0.3, description: "bit.ly, tinyurl, short.url - destination unclear" },
    { name: "Credential Embedding in URL", score: 0.25, description: "URLs with @ symbol: http://user:pass@fake.com" },
    {
      name: "Payment/Crypto Keywords",
      score: 0.2,
      description: "Keywords: payment, transfer, UPI, bitcoin, crypto, wallet",
    },
    {
      name: "Tracking/Redirect Parameters",
      score: 0.2,
      description: "UTM parameters, redirect parameters, session tokens",
    },
    {
      name: "Mascrow Hash Validation Failure",
      score: 0.4,
      description: "QR code hash does not match - content modified",
    },
    { name: "Missing Mascrow Authentication", score: 0.3, description: "No verification hash provided for validation" },
    { name: "IP Address URLs", score: 0.25, description: "URLs pointing to direct IP addresses instead of domains" },
    { name: "Non-HTTPS Protocol", score: 0.15, description: "Missing SSL/TLS encryption in QR destination" },
    { name: "Unusual Domain Pattern", score: 0.2, description: "Misspelled famous brands or suspicious TLDs" },
    { name: "Phishing Keywords in QR", score: 0.15, description: "Verify, confirm, update, urgent keywords" },
  ]

  const example = {
    qrContent: "https://bit.ly/abc123?utm_campaign=verify_account&redirect=https://195.154.32.145/secure",
    mascrowHash: "invalid_hash",
    breakdown: [
      "URL shortener (bit.ly): +0.3",
      "Redirect parameter: +0.2",
      "Direct IP address: +0.25",
      "Mascrow hash validation failed: +0.4",
      "Total Risk Score: 1.15 → Capped at 1.0 (CRITICAL)",
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
              <QrCode className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">QR Code Fraud Detection Methodology</h1>
          </div>
          <p className="text-slate-400">QR code analysis, Mascrow hash validation, and payment fraud detection</p>
        </div>

        {/* Overview */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
          <p className="text-slate-300">
            QR codes are scanned and decoded to extract URLs. PhishNet Sentinel analyzes the destination URL, checks for
            payment scams, validates Mascrow authentication hash, and identifies redirect patterns. This protects
            against QR code phishing and payment fraud.
          </p>
        </Card>

        {/* Mascrow Hash Explanation */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8 border-amber-500/30">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Mascrow Hash Validation (Blockchain-Inspired)
          </h2>
          <p className="text-slate-300 text-sm mb-4">
            Mascrow is a blockchain-inspired verification system that creates a unique cryptographic hash of QR code
            content. This proves the QR code hasn't been modified or replaced since verification.
          </p>
          <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm font-mono text-slate-400">
            <div>Original QR: hash_a1b2c3d4e5f6</div>
            <div>Provided hash: hash_a1b2c3d4e5f6 ✓ VALID</div>
            <div className="text-red-400">Modified QR: hash_x9y8z7w6v5u4 ✗ INVALID</div>
          </div>
        </Card>

        {/* Fraud Indicators */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">10 Fraud Detection Indicators</h2>
          <div className="space-y-3">
            {indicators.map((indicator, idx) => (
              <Card
                key={idx}
                className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-amber-500/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-500/20 border border-amber-500/30">
                      <span className="text-sm font-semibold text-amber-400">
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
              <div className="text-sm text-slate-400 mb-1">QR Code Content (Decoded):</div>
              <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-slate-300 break-all">
                {example.qrContent}
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">Mascrow Hash:</div>
              <div className="bg-slate-900/50 rounded-lg p-3 font-mono text-sm text-red-400">{example.mascrowHash}</div>
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
            <div className="text-xs text-red-300 mt-1">Do not scan QR codes from unknown or suspicious sources</div>
          </div>
        </Card>
      </div>
    </div>
  )
}
