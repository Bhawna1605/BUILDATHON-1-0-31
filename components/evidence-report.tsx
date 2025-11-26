"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Copy, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"

interface EvidenceReportProps {
  checkType: string
  inputValue: string
  fraudScore: number
  riskLevel: string
  indicators: string[]
  aiAnalysis: string
  methodology: string
}

export function EvidenceReport({
  checkType,
  inputValue,
  fraudScore,
  riskLevel,
  indicators,
  aiAnalysis,
  methodology,
}: EvidenceReportProps) {
  const [copied, setCopied] = useState(false)

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-400 bg-red-500/10"
      case "high":
        return "text-orange-400 bg-orange-500/10"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10"
      case "low":
        return "text-blue-400 bg-blue-500/10"
      default:
        return "text-green-400 bg-green-500/10"
    }
  }

  const exportAsJSON = () => {
    const report = {
      timestamp: new Date().toISOString(),
      checkType,
      inputValue,
      fraudScore,
      riskLevel,
      indicators,
      methodology,
      aiAnalysis,
    }
    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `fraud-evidence-${Date.now()}.json`
    link.click()
  }

  const copyToClipboard = async () => {
    const text = `
Fraud Detection Report
======================
Type: ${checkType}
Value: ${inputValue}
Score: ${fraudScore.toFixed(2)} / 1.00
Risk Level: ${riskLevel.toUpperCase()}
Indicators: ${indicators.join(", ")}
AI Analysis: ${aiAnalysis}
Methodology: ${methodology}
Generated: ${new Date().toLocaleString()}
    `
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50 p-6 space-y-6">
      {/* Risk Level Badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Evidence Report</h3>
        <div className={`px-4 py-2 rounded-lg font-semibold ${getRiskColor(riskLevel)}`}>{riskLevel.toUpperCase()}</div>
      </div>

      {/* Fraud Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Fraud Score</div>
          <div className="text-3xl font-bold text-cyan-400">{(fraudScore * 100).toFixed(1)}%</div>
          <div className="text-xs text-slate-500 mt-1">Scale: 0-100</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-2">Check Type</div>
          <div className="text-lg font-semibold text-white capitalize">{checkType}</div>
          <div className="text-xs text-slate-500 mt-1">{inputValue.substring(0, 30)}...</div>
        </div>
      </div>

      {/* Detected Indicators */}
      <div>
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Detected Fraud Indicators ({indicators.length})
        </h4>
        <div className="space-y-2">
          {indicators.map((indicator, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-slate-300">{indicator}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology */}
      <div>
        <h4 className="font-semibold text-white mb-2">Detection Methodology</h4>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{methodology}</p>
        </div>
      </div>

      {/* AI Analysis */}
      <div>
        <h4 className="font-semibold text-white mb-2">AI Analysis</h4>
        <div className="bg-slate-900/50 rounded-lg p-4 border-l-2 border-cyan-500">
          <p className="text-sm text-slate-300">{aiAnalysis}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button onClick={copyToClipboard} variant="outline" className="flex-1 bg-transparent">
          <Copy className="w-4 h-4 mr-2" />
          {copied ? "Copied!" : "Copy Report"}
        </Button>
        <Button onClick={exportAsJSON} variant="outline" className="flex-1 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export JSON
        </Button>
      </div>

      {/* Timestamp */}
      <div className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700">
        Generated: {new Date().toLocaleString()} • PhishNet Sentinel Evidence Report
      </div>
    </Card>
  )
}
