"use client"

import { useState } from "react"
import { AlertTriangle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ThreatDetectionPanelProps {
  userId: string
}

export function ThreatDetectionPanel({ userId }: ThreatDetectionPanelProps) {
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")

  const threats = [
    {
      id: 1,
      type: "Phishing Email",
      severity: "critical",
      description: "Suspicious email from noreply@secure-banking.com",
      detectedAt: "2 hours ago",
      source: "Email Scanner",
      action: "Auto-quarantined",
      url: "secure-banking.com (fake)",
    },
    {
      id: 2,
      type: "Malware Link",
      severity: "high",
      description: "Executable download from compromised website",
      detectedAt: "4 hours ago",
      source: "Browser Extension",
      action: "Blocked",
      url: "malicious-site.ru/payload.exe",
    },
    {
      id: 3,
      type: "QR Code Scam",
      severity: "high",
      description: "Suspicious QR code detected with mascrow mismatch",
      detectedAt: "6 hours ago",
      source: "QR Scanner",
      action: "Reported",
      url: "Malicious payment redirect",
    },
    {
      id: 4,
      type: "Social Engineering",
      severity: "medium",
      description: "Impersonation attempt requesting account credentials",
      detectedAt: "1 day ago",
      source: "Email Scanner",
      action: "Quarantined",
      url: "attacker@spoofed-domain.com",
    },
    {
      id: 5,
      type: "Credential Theft",
      severity: "critical",
      description: "Keylogger malware detected on system",
      detectedAt: "2 days ago",
      source: "System Scan",
      action: "Quarantined",
      url: "Trojan.Win32.Generic",
    },
  ]

  const severityColors = {
    critical: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  }

  const filteredThreats = selectedSeverity === "all" ? threats : threats.filter((t) => t.severity === selectedSeverity)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input placeholder="Search threats..." className="pl-10 bg-slate-800 border-slate-700 text-white" />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedSeverity === "all" ? "default" : "outline"}
            onClick={() => setSelectedSeverity("all")}
            className={selectedSeverity === "all" ? "bg-cyan-500 text-slate-900" : "border-slate-700"}
          >
            All
          </Button>
          {["critical", "high", "medium", "low"].map((sev) => (
            <Button
              key={sev}
              variant={selectedSeverity === sev ? "default" : "outline"}
              onClick={() => setSelectedSeverity(sev)}
              className={selectedSeverity === sev ? "bg-cyan-500 text-slate-900" : "border-slate-700 capitalize"}
            >
              {sev}
            </Button>
          ))}
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-3">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-semibold">{threat.type}</h3>
                    <p className="text-slate-400 text-sm mt-1">{threat.description}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold border capitalize ${severityColors[threat.severity as keyof typeof severityColors]}`}
                  >
                    {threat.severity}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Source</p>
                    <p className="text-slate-300">{threat.source}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Detected</p>
                    <p className="text-slate-300">{threat.detectedAt}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Action</p>
                    <p className="text-slate-300">{threat.action}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">URL/Details</p>
                    <p className="text-slate-300 truncate">{threat.url}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                    Report
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
