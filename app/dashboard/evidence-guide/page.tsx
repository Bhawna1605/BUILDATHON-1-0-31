"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, AlertTriangle, Phone, QrCode, MessageSquare, Globe, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function EvidenceGuidePage() {
  const guides = [
    {
      title: "URL Fraud Detection",
      description: "Learn how PhishNet Sentinel identifies fraudulent and malicious URLs",
      icon: Globe,
      href: "/dashboard/evidence-guide/url",
      color: "bg-blue-500/10 border-blue-500/30",
      indicators: 15,
    },
    {
      title: "Phone Number Analysis",
      description: "Understanding phone spoofing patterns and call fraud detection",
      icon: Phone,
      href: "/dashboard/evidence-guide/phone",
      color: "bg-purple-500/10 border-purple-500/30",
      indicators: 12,
    },
    {
      title: "QR Code Verification",
      description: "QR code security analysis and Mascrow hash validation methodology",
      icon: QrCode,
      href: "/dashboard/evidence-guide/qr",
      color: "bg-amber-500/10 border-amber-500/30",
      indicators: 10,
    },
    {
      title: "WhatsApp URL Safety",
      description: "WhatsApp domain validation and phishing URL detection",
      icon: MessageSquare,
      href: "/dashboard/evidence-guide/whatsapp",
      color: "bg-green-500/10 border-green-500/30",
      indicators: 8,
    },
    {
      title: "Message Analysis",
      description: "SMS, email, and message content fraud detection patterns",
      icon: MessageSquare,
      href: "/dashboard/evidence-guide/message",
      color: "bg-red-500/10 border-red-500/30",
      indicators: 18,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Evidence & Methodology Guide</h1>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl">
            Complete documentation of PhishNet Sentinel's fraud detection methodology. Use this guide when presenting
            evidence to judges, cyber police, or legal authorities.
          </p>
        </div>

        {/* Key Information Card */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700/50 p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-white font-semibold mb-2">Legal & Court Presentation</h2>
              <p className="text-slate-300 text-sm">
                This guide provides scientific, pattern-based evidence for fraud determination. Each detection includes
                specific indicators, scoring methodology, and AI-powered analysis that can be presented in legal
                proceedings. All data is timestamped and user-authenticated through Supabase.
              </p>
            </div>
          </div>
        </Card>

        {/* Scoring System Overview */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Risk Scoring System</h2>
          <div className="grid grid-cols-5 gap-3">
            {[
              {
                range: "< 0.2",
                level: "Safe",
                color: "bg-green-500/20 border-green-500/30",
                textColor: "text-green-400",
              },
              {
                range: "0.2-0.4",
                level: "Low",
                color: "bg-blue-500/20 border-blue-500/30",
                textColor: "text-blue-400",
              },
              {
                range: "0.4-0.6",
                level: "Medium",
                color: "bg-yellow-500/20 border-yellow-500/30",
                textColor: "text-yellow-400",
              },
              {
                range: "0.6-0.8",
                level: "High",
                color: "bg-orange-500/20 border-orange-500/30",
                textColor: "text-orange-400",
              },
              {
                range: "≥ 0.8",
                level: "Critical",
                color: "bg-red-500/20 border-red-500/30",
                textColor: "text-red-400",
              },
            ].map((item) => (
              <div key={item.level} className={`${item.color} border rounded-lg p-3 text-center`}>
                <div className={`text-sm font-semibold ${item.textColor}`}>{item.level}</div>
                <div className="text-xs text-slate-400 mt-1">{item.range}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Evidence Guides Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Link key={guide.href} href={guide.href}>
                <Card
                  className={`${guide.color} border backdrop-blur-sm hover:border-cyan-500/50 transition-all cursor-pointer h-full p-6 flex flex-col`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-8 h-8 text-cyan-400" />
                    <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30">
                      {guide.indicators} indicators
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-slate-400 text-sm flex-1 mb-4">{guide.description}</p>
                  <Button variant="ghost" className="text-cyan-400 hover:text-cyan-300 p-0 h-auto justify-start">
                    Learn More <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Download Evidence Report Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Generate Evidence Reports</h2>
          <p className="text-slate-300 text-sm mb-4">
            Export detailed fraud detection reports with all methodology and AI analysis for court presentations or
            cyber police filings.
          </p>
          <Link href="/dashboard/fraud-checker">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">View Fraud Checker History</Button>
          </Link>
        </Card>
      </div>
    </div>
  )
}
