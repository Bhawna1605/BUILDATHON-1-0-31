"use client"

import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ActivityPanelProps {
  userId: string
}

export function ActivityPanel({ userId }: ActivityPanelProps) {
  const activities = [
    {
      id: 1,
      type: "threat-detected",
      activity: "Phishing Email Detected",
      details: "Email from suspicious-bank@example.com blocked",
      timestamp: "2 hours ago",
      status: "success",
      icon: "🚨",
    },
    {
      id: 2,
      type: "extension-sync",
      activity: "Browser Extension Synced",
      details: "Chrome extension synchronized with cloud settings",
      timestamp: "4 hours ago",
      status: "success",
      icon: "🔄",
    },
    {
      id: 3,
      type: "call-blocked",
      activity: "Fraudulent Call Blocked",
      details: "Incoming call from +1-555-0123 marked as high fraud risk",
      timestamp: "6 hours ago",
      status: "success",
      icon: "☎️",
    },
    {
      id: 4,
      type: "qr-scan",
      activity: "QR Code Scanned",
      details: "Dangerous QR code detected with mascrow mismatch",
      timestamp: "1 day ago",
      status: "warning",
      icon: "⚠️",
    },
    {
      id: 5,
      type: "login",
      activity: "User Login",
      details: "Logged in from IP: 192.168.1.1 (Chrome on macOS)",
      timestamp: "1 day ago",
      status: "success",
      icon: "✓",
    },
    {
      id: 6,
      type: "settings-updated",
      activity: "Security Settings Updated",
      details: "Auto-scan enabled, Block suspicious sites enabled",
      timestamp: "2 days ago",
      status: "success",
      icon: "⚙️",
    },
  ]

  const statusColors = {
    success: "bg-green-500/10 text-green-400 border-green-500/30",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    error: "bg-red-500/10 text-red-400 border-red-500/30",
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search activities..." className="flex-1 bg-slate-800 border-slate-700 text-white" />
        <Button variant="outline" className="border-slate-700 bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" className="border-slate-700 bg-transparent">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`border rounded-lg p-4 hover:border-slate-600 transition-colors ${statusColors[activity.status as keyof typeof statusColors]}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl pt-1">{activity.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{activity.activity}</h3>
                  <span className="text-xs text-slate-400">{activity.timestamp}</span>
                </div>
                <p className="text-sm opacity-90">{activity.details}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
