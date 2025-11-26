"use client"

import { useState } from "react"
import { Phone, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CallFraudPanelProps {
  userId: string
}

export function CallFraudPanel({ userId }: CallFraudPanelProps) {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [authCode, setAuthCode] = useState("")

  const callLogs = [
    {
      id: 1,
      callerNumber: "+1-555-0123",
      callerName: "Suspicious Caller",
      timestamp: "15 minutes ago",
      duration: 0,
      fraudScore: 0.92,
      status: "blocked",
      threats: ["Spoofed Number", "Known Phishing Network", "Social Engineering Pattern"],
    },
    {
      id: 2,
      callerNumber: "+1-555-0456",
      callerName: "Bank Support",
      timestamp: "2 hours ago",
      duration: 145,
      fraudScore: 0.15,
      status: "verified",
      threats: [],
    },
    {
      id: 3,
      callerNumber: "+1-555-0789",
      callerName: "Unknown",
      timestamp: "5 hours ago",
      duration: 0,
      fraudScore: 0.78,
      status: "blocked",
      threats: ["Vishing Attack", "Credential Theft Attempt"],
    },
    {
      id: 4,
      callerNumber: "+1-555-0321",
      callerName: "Colleague",
      timestamp: "1 day ago",
      duration: 289,
      fraudScore: 0.05,
      status: "verified",
      threats: [],
    },
  ]

  const getStatusIcon = (status: string) => {
    if (status === "verified") return <CheckCircle className="w-5 h-5 text-green-400" />
    if (status === "blocked") return <XCircle className="w-5 h-5 text-red-400" />
    return <Clock className="w-5 h-5 text-yellow-400" />
  }

  const getRiskLevel = (score: number) => {
    if (score >= 0.8) return { level: "Critical", color: "text-red-400" }
    if (score >= 0.6) return { level: "High", color: "text-orange-400" }
    if (score >= 0.4) return { level: "Medium", color: "text-yellow-400" }
    return { level: "Low", color: "text-green-400" }
  }

  return (
    <div className="space-y-6">
      {/* Quick Authorization */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogTrigger asChild>
          <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 py-6">
            <Phone className="w-5 h-5 mr-2" />
            Generate Authorization Code for Incoming Call
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Call Authorization</DialogTitle>
            <DialogDescription>Generate a unique authorization code to verify incoming calls</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Enter phone number" className="bg-slate-700 border-slate-600 text-white" />
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <p className="text-slate-400 text-sm mb-2">Your Authorization Code:</p>
              <p className="text-2xl font-mono font-bold text-cyan-400">729148</p>
              <p className="text-slate-500 text-xs mt-2">Valid for 15 minutes</p>
            </div>
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900">Copy Code</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Call Logs */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Recent Calls</h2>
        {callLogs.map((call) => {
          const riskLevel = getRiskLevel(call.fraudScore)
          return (
            <div
              key={call.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-2 bg-slate-700/50 rounded-lg">{getStatusIcon(call.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{call.callerName}</h3>
                      <span className="text-slate-500 text-sm">{call.callerNumber}</span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{call.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${riskLevel.color}`}>
                    {(call.fraudScore * 100).toFixed(0)}% Fraud Risk
                  </div>
                  <p className={`text-xs ${riskLevel.color}`}>{riskLevel.level}</p>
                </div>
              </div>

              {call.threats.length > 0 && (
                <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 font-semibold text-sm">Detected Threats:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {call.threats.map((threat, idx) => (
                      <span key={idx} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">
                  {call.status === "verified"
                    ? `Duration: ${Math.floor(call.duration / 60)}m ${call.duration % 60}s`
                    : call.status === "blocked"
                      ? "Call Blocked"
                      : "Pending"}
                </span>
                {call.status === "blocked" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-700 bg-transparent"
                    onClick={() => setShowAuthDialog(true)}
                  >
                    Allow Call
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
