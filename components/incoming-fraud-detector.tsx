"use client"

import { useState, useEffect } from "react"
import { Phone, MessageSquare, Mail, AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface IncomingFraudDetectorProps {
  userId: string
}

interface FraudAlert {
  id: string
  type: "call" | "message" | "email"
  sender: string
  content: string
  timestamp: string
  riskLevel: "safe" | "warning" | "dangerous"
  reason: string[]
  aiAnalysis: string
}

export function IncomingFraudDetector({ userId }: IncomingFraudDetectorProps) {
  const [alerts, setAlerts] = useState<FraudAlert[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [callInput, setCallInput] = useState("")
  const [emailInput, setEmailInput] = useState("")
  const [emailSender, setEmailSender] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [messageSender, setMessageSender] = useState("")

  // Load past alerts
  useEffect(() => {
    loadAlerts()
    // Poll for new alerts every 10 seconds
    const interval = setInterval(loadAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadAlerts = async () => {
    try {
      const response = await fetch("/api/incoming-fraud/alerts")
      const data = await response.json()
      if (data.alerts) setAlerts(data.alerts)
    } catch (err) {
      console.error("Error loading alerts:", err)
    }
  }

  const analyzeCall = async () => {
    if (!callInput.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch("/api/incoming-fraud/analyze-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: callInput, transcript: callInput }),
      })

      const data = await response.json()
      if (data.alert) {
        setAlerts([data.alert, ...alerts])
      }
      setCallInput("")
    } catch (err) {
      console.error("Error analyzing call:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeEmail = async () => {
    if (!emailInput.trim() || !emailSender.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch("/api/incoming-fraud/analyze-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: emailSender, content: emailInput }),
      })

      const data = await response.json()
      if (data.alert) {
        setAlerts([data.alert, ...alerts])
      }
      setEmailInput("")
      setEmailSender("")
    } catch (err) {
      console.error("Error analyzing email:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const analyzeMessage = async () => {
    if (!messageInput.trim() || !messageSender.trim()) return
    setIsLoading(true)

    try {
      const response = await fetch("/api/incoming-fraud/analyze-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender: messageSender, content: messageInput }),
      })

      const data = await response.json()
      if (data.alert) {
        setAlerts([data.alert, ...alerts])
      }
      setMessageInput("")
      setMessageSender("")
    } catch (err) {
      console.error("Error analyzing message:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskIcon = (level: string) => {
    if (level === "dangerous") return <AlertTriangle className="w-5 h-5 text-red-400" />
    if (level === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    return <CheckCircle className="w-5 h-5 text-green-400" />
  }

  const getRiskBg = (level: string) => {
    if (level === "dangerous") return "bg-red-500/20 border-red-500/30"
    if (level === "warning") return "bg-yellow-500/20 border-yellow-500/30"
    return "bg-green-500/20 border-green-500/30"
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="incoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="incoming">Incoming Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Recent Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="space-y-4">
          {/* Call Fraud Analyzer */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Analyze Incoming Call</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm font-medium">Phone Number or Transcript</label>
                <Input
                  placeholder="Enter phone number or call transcript"
                  value={callInput}
                  onChange={(e) => setCallInput(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <Button
                onClick={analyzeCall}
                disabled={!callInput || isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 mr-2" />
                    Analyze Call
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Email Fraud Analyzer */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Analyze Email</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm font-medium">Sender Email</label>
                <Input
                  placeholder="sender@example.com"
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium">Email Content</label>
                <textarea
                  placeholder="Paste email content"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 mt-1"
                  rows={4}
                />
              </div>
              <Button
                onClick={analyzeEmail}
                disabled={!emailInput || !emailSender || isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Analyze Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* SMS/Message Fraud Analyzer */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Analyze Message</h2>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-sm font-medium">Sender Number/ID</label>
                <Input
                  placeholder="+1-555-0123 or contact name"
                  value={messageSender}
                  onChange={(e) => setMessageSender(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium">Message Content</label>
                <textarea
                  placeholder="Paste SMS or message content"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded p-2 mt-1"
                  rows={3}
                />
              </div>
              <Button
                onClick={analyzeMessage}
                disabled={!messageInput || !messageSender || isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Analyze Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          {alerts.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400">No fraud alerts yet</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 space-y-3 ${getRiskBg(alert.riskLevel)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-700/50 rounded">
                      {alert.type === "call" && <Phone className="w-5 h-5 text-blue-400" />}
                      {alert.type === "email" && <Mail className="w-5 h-5 text-purple-400" />}
                      {alert.type === "message" && <MessageSquare className="w-5 h-5 text-orange-400" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-white capitalize">{alert.type}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded font-bold ${
                            alert.riskLevel === "dangerous"
                              ? "bg-red-500/30 text-red-300"
                              : alert.riskLevel === "warning"
                                ? "bg-yellow-500/30 text-yellow-300"
                                : "bg-green-500/30 text-green-300"
                          }`}
                        >
                          {alert.riskLevel.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm">From: {alert.sender}</p>
                      <p className="text-slate-400 text-xs mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  {getRiskIcon(alert.riskLevel)}
                </div>

                {alert.reason.length > 0 && (
                  <div className="bg-slate-900/50 rounded p-3 space-y-2">
                    <p className="text-slate-300 text-sm font-medium">Fraud Indicators:</p>
                    <div className="flex flex-wrap gap-2">
                      {alert.reason.map((r, idx) => (
                        <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-slate-900/30 rounded p-3 border border-slate-700/50">
                  <p className="text-slate-400 text-sm">
                    <strong>AI Analysis:</strong> {alert.aiAnalysis}
                  </p>
                </div>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
