"use client"

import { Trash2, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NotificationsPanelProps {
  userId: string
}

export function NotificationsPanel({ userId }: NotificationsPanelProps) {
  const [unread, setUnread] = useState(true)

  const notifications = [
    {
      id: 1,
      type: "critical",
      title: "Critical: Phishing Email Detected",
      message: "A high-risk phishing email was detected and automatically quarantined",
      timestamp: "5 minutes ago",
      read: false,
      icon: "🚨",
    },
    {
      id: 2,
      type: "alert",
      title: "Call Fraud Attempt Blocked",
      message: "Incoming call from spoofed bank number was blocked (fraud score: 0.92)",
      timestamp: "1 hour ago",
      read: false,
      icon: "☎️",
    },
    {
      id: 3,
      type: "warning",
      title: "Suspicious QR Code",
      message: "A dangerous QR code with mascrow validation failure was detected",
      timestamp: "3 hours ago",
      read: false,
      icon: "⚠️",
    },
    {
      id: 4,
      type: "info",
      title: "Extension Update Available",
      message: "PhishNet Sentinel browser extension v2.2.0 is now available",
      timestamp: "1 day ago",
      read: true,
      icon: "ℹ️",
    },
    {
      id: 5,
      type: "success",
      title: "Security Report Generated",
      message: "Your weekly security report is ready for download",
      timestamp: "2 days ago",
      read: true,
      icon: "✓",
    },
  ]

  const typeColors = {
    critical: "bg-red-500/10 text-red-400 border-red-500/30",
    alert: "bg-orange-500/10 text-orange-400 border-orange-500/30",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    success: "bg-green-500/10 text-green-400 border-green-500/30",
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {unread ? `Unread Notifications (${unreadCount})` : "All Notifications"}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={unread ? "default" : "outline"}
            onClick={() => setUnread(!unread)}
            className={unread ? "bg-cyan-500 text-slate-900" : "border-slate-700"}
          >
            {unread ? "Unread" : "All"}
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {(unread ? notifications.filter((n) => !n.read) : notifications).map((notif) => (
          <div
            key={notif.id}
            className={`border rounded-lg p-4 hover:border-slate-600 transition-colors ${
              typeColors[notif.type as keyof typeof typeColors]
            } ${!notif.read ? "border-opacity-100" : "opacity-75"}`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl pt-1">{notif.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{notif.title}</h3>
                  <span className="text-xs text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-sm opacity-90 mb-3">{notif.message}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-slate-700/50 bg-transparent">
                    View
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-slate-300">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
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
