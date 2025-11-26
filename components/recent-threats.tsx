"use client"

import { AlertTriangle, Check, X } from "lucide-react"

export function RecentThreats() {
  const threats = [
    {
      type: "Phishing Email",
      severity: "high",
      time: "2 hours ago",
      status: "blocked",
    },
    {
      type: "Malware Link",
      severity: "critical",
      time: "4 hours ago",
      status: "reported",
    },
    {
      type: "Social Engineering",
      severity: "medium",
      time: "1 day ago",
      status: "resolved",
    },
    {
      type: "QR Code Scam",
      severity: "high",
      time: "2 days ago",
      status: "blocked",
    },
  ]

  const severityColor = {
    low: "text-blue-400",
    medium: "text-yellow-400",
    high: "text-orange-400",
    critical: "text-red-400",
  }

  const statusIcon = {
    blocked: <X className="w-4 h-4 text-red-400" />,
    reported: <AlertTriangle className="w-4 h-4 text-orange-400" />,
    resolved: <Check className="w-4 h-4 text-green-400" />,
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-white font-semibold mb-4">Recent Threats</h3>
      <div className="space-y-4">
        {threats.map((threat, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-slate-900/30 rounded border border-slate-700/50"
          >
            <div className="flex items-start gap-3 flex-1">
              <AlertTriangle className="w-4 h-4 mt-1 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-slate-200 text-sm font-medium">{threat.type}</p>
                <p className="text-slate-500 text-xs mt-1">{threat.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded capitalize ${severityColor[threat.severity as keyof typeof severityColor]}`}
              >
                {threat.severity}
              </span>
              {statusIcon[threat.status as keyof typeof statusIcon]}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
