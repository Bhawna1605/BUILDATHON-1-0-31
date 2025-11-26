"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  CheckCircle,
  Globe,
  Phone,
  QrCode,
  MessageCircle,
  Loader2,
  RotateCcw,
  Mail,
  Camera,
  Upload,
} from "lucide-react"

interface CheckResult {
  checkType: string
  inputValue: string
  fraudScore: number
  riskLevel: "safe" | "low" | "medium" | "high" | "critical"
  indicators: string[]
  aiAnalysis: string
}

interface HistoryItem {
  id: string
  check_type: string
  input_value: string
  fraud_score: number
  risk_level: string
  indicators: string[]
  ai_analysis: string
  created_at: string
}

export function FraudCheckerPanel({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("url")
  const [urlInput, setUrlInput] = useState("")
  const [phoneInput, setPhoneInput] = useState("")
  const [qrInput, setQrInput] = useState("")
  const [whatsappInput, setWhatsappInput] = useState("")
  const [messageInput, setMessageInput] = useState("")
  const [messageSenderInput, setMessageSenderInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<CheckResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [activeHistoryTab, setActiveHistoryTab] = useState("all")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadHistory()
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.js"
    document.head.appendChild(script)
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

  const loadHistory = async () => {
    try {
      setHistoryLoading(true)
      const response = await fetch(
        `/api/fraud-checker/history?checkType=${activeHistoryTab === "all" ? "all" : activeHistoryTab}`,
      )
      const data = await response.json()
      setHistory(data.checks || [])
    } catch (error) {
      console.error("Error loading history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        scanQRFromCamera()
      }
    } catch (err) {
      alert("Camera access denied or not available")
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  const scanQRFromCamera = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const ctx = canvas.getContext("2d")

    const scan = setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

        if (typeof (window as any).jsQR === "function") {
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
          if (imageData) {
            const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height)
            if (code) {
              setQrInput(code.data)
              clearInterval(scan)
              stopCamera()
            }
          }
        }
      }
    }, 100)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvasRef.current) return

    setIsScanning(true)
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0)

        if (typeof (window as any).jsQR === "function") {
          const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
          if (imageData) {
            const code = (window as any).jsQR(imageData.data, imageData.width, imageData.height)
            if (code) {
              setQrInput(code.data)
            }
          }
        }
        setIsScanning(false)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const handleCheck = async () => {
    let inputValue = ""
    let checkType = ""

    switch (activeTab) {
      case "url":
        inputValue = urlInput
        checkType = "url"
        break
      case "phone":
        inputValue = phoneInput
        checkType = "phone"
        break
      case "qr":
        inputValue = qrInput
        checkType = "qr"
        break
      case "whatsapp":
        inputValue = whatsappInput
        checkType = "whatsapp"
        break
      case "message":
        inputValue = `${messageSenderInput}|||${messageInput}`
        checkType = "message"
        break
    }

    if (!inputValue.trim()) {
      alert("Please enter a value to check")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/fraud-checker/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkType, inputValue }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const result = await response.json()
      setResults(result)
      loadHistory()
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to analyze input")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "safe":
        return "text-green-400 bg-green-500/10 border-green-500/30"
      case "low":
        return "text-blue-400 bg-blue-500/10 border-blue-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      case "high":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30"
      case "critical":
        return "text-red-400 bg-red-500/10 border-red-500/30"
      default:
        return "text-slate-400"
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "safe":
        return <CheckCircle className="w-4 h-4" />
      case "critical":
      case "high":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <Tabs defaultValue="checker" className="w-full space-y-6">
      <TabsList className="bg-slate-800/50 border border-slate-700">
        <TabsTrigger value="checker" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
          Fraud Checker
        </TabsTrigger>
        <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
          Check History
        </TabsTrigger>
      </TabsList>

      <TabsContent value="checker" className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Check for Fraud</CardTitle>
            <CardDescription>
              Analyze URLs, phone numbers, QR codes, WhatsApp links, and messages for fraud indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-slate-800/50 overflow-x-auto">
                <TabsTrigger value="url" className="gap-2 whitespace-nowrap">
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">URL</span>
                </TabsTrigger>
                <TabsTrigger value="phone" className="gap-2 whitespace-nowrap">
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Phone</span>
                </TabsTrigger>
                <TabsTrigger value="qr" className="gap-2 whitespace-nowrap">
                  <QrCode className="w-4 h-4" />
                  <span className="hidden sm:inline">QR</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="gap-2 whitespace-nowrap">
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </TabsTrigger>
                <TabsTrigger value="message" className="gap-2 whitespace-nowrap">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Message</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Website URL</label>
                  <Input
                    placeholder="https://example.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="bg-slate-800 border-slate-700"
                    onKeyPress={(e) => e.key === "Enter" && handleCheck()}
                  />
                </div>
              </TabsContent>

              <TabsContent value="phone" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Phone Number</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="bg-slate-800 border-slate-700"
                    onKeyPress={(e) => e.key === "Enter" && handleCheck()}
                  />
                </div>
              </TabsContent>

              <TabsContent value="qr" className="space-y-4 mt-4">
                <div className="space-y-4">
                  {!isCameraActive ? (
                    <Button onClick={startCamera} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                      <Camera className="w-4 h-4" />
                      Start Camera Scan
                    </Button>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border border-slate-700"
                        style={{ maxHeight: "300px" }}
                      />
                      <Button onClick={stopCamera} className="w-full bg-red-600 hover:bg-red-700 text-white">
                        Stop Camera
                      </Button>
                    </>
                  )}
                  <canvas ref={canvasRef} className="hidden" />

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-slate-900 text-slate-400">Or</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Upload QR Image</label>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 gap-2"
                      disabled={isScanning}
                    >
                      {isScanning ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Or Enter QR Code Content</label>
                    <Input
                      placeholder="Paste QR code decoded content or URL"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      className="bg-slate-800 border-slate-700"
                      onKeyPress={(e) => e.key === "Enter" && handleCheck()}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="whatsapp" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">WhatsApp URL</label>
                  <Input
                    placeholder="https://wa.me/1234567890 or https://chat.whatsapp.com/..."
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    className="bg-slate-800 border-slate-700"
                    onKeyPress={(e) => e.key === "Enter" && handleCheck()}
                  />
                </div>
              </TabsContent>

              <TabsContent value="message" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Sender (Email, Phone, WhatsApp Name)</label>
                  <Input
                    placeholder="sender@example.com or +1234567890"
                    value={messageSenderInput}
                    onChange={(e) => setMessageSenderInput(e.target.value)}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Message Content</label>
                  <textarea
                    placeholder="Paste the full message, email, or SMS content here..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="w-full p-3 bg-slate-800 border border-slate-700 rounded-md text-slate-300 text-sm"
                    rows={4}
                    onKeyPress={(e) => e.key === "Enter" && e.ctrlKey && handleCheck()}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <Button
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Check for Fraud"
              )}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`p-4 rounded-lg border ${getRiskColor(results.riskLevel)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getRiskIcon(results.riskLevel)}
                    <span className="font-semibold capitalize">{results.riskLevel.toUpperCase()}</span>
                  </div>
                  <span className="text-lg font-bold">{(results.fraudScore * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      results.fraudScore < 0.2
                        ? "bg-green-500"
                        : results.fraudScore < 0.4
                          ? "bg-blue-500"
                          : results.fraudScore < 0.6
                            ? "bg-yellow-500"
                            : results.fraudScore < 0.8
                              ? "bg-orange-500"
                              : "bg-red-500"
                    }`}
                    style={{ width: `${results.fraudScore * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Checked Value</label>
                <div className="p-3 bg-slate-800/50 rounded-lg text-slate-200 text-sm break-all">
                  {results.checkType === "message" ? results.inputValue.split("|||")[1] : results.inputValue}
                </div>
              </div>

              {results.indicators.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Risk Indicators</label>
                  <ul className="space-y-2">
                    {results.indicators.map((indicator, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.aiAnalysis && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">AI Security Assessment</label>
                  <div className="p-3 bg-slate-800/50 rounded-lg text-slate-200 text-sm border border-slate-700">
                    {results.aiAnalysis}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Fraud Check History</CardTitle>
                <CardDescription>View all your previous fraud checks and analyses</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadHistory()}
                className="gap-2 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs
              value={activeHistoryTab}
              onValueChange={(v) => {
                setActiveHistoryTab(v)
              }}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 overflow-x-auto">
                <TabsTrigger value="all" onClick={() => loadHistory()}>
                  All
                </TabsTrigger>
                <TabsTrigger value="url" onClick={() => loadHistory()}>
                  URLs
                </TabsTrigger>
                <TabsTrigger value="phone" onClick={() => loadHistory()}>
                  Phones
                </TabsTrigger>
                <TabsTrigger value="qr" onClick={() => loadHistory()}>
                  QR
                </TabsTrigger>
                <TabsTrigger value="whatsapp" onClick={() => loadHistory()}>
                  WhatsApp
                </TabsTrigger>
                <TabsTrigger value="message" onClick={() => loadHistory()}>
                  Messages
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No fraud checks found</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <div key={item.id} className={`p-4 rounded-lg border ${getRiskColor(item.risk_level)} space-y-2`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs font-mono">
                            {item.check_type.toUpperCase()}
                          </span>
                          <span className="capitalize font-semibold">{item.risk_level}</span>
                          <span className="text-sm text-slate-400 ml-auto">{(item.fraud_score * 100).toFixed(0)}%</span>
                        </div>
                        <p className="text-sm break-all text-slate-200 mt-2">{item.input_value}</p>
                        {item.ai_analysis && (
                          <p className="text-xs text-slate-300 mt-2">{item.ai_analysis.substring(0, 150)}...</p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{new Date(item.created_at).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
