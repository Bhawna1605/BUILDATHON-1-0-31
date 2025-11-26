"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { QrCode, CheckCircle, AlertTriangle, XCircle, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QRScannerPanelProps {
  userId: string
}

export function QRScannerPanel({ userId }: QRScannerPanelProps) {
  const [qrInput, setQrInput] = useState("")
  const [scans, setScans] = useState<any[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jsQR/1.4.0/jsQR.js"
    document.head.appendChild(script)
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [])

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
      setError("Camera access denied or not available")
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
              processQRScan(code.data)
            }
          }
        }
      }
    }, 100)
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !canvasRef.current) return

    setIsScanning(true)
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
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
              processQRScan(code.data)
            } else {
              setError("No QR code found in image")
            }
          }
        }
        setIsScanning(false)
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  const processQRScan = async (content: string) => {
    setIsScanning(true)
    try {
      const response = await fetch("/api/qr/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrContent: content }),
      })

      const data = await response.json()
      if (data.success) {
        setScans([
          {
            id: Date.now(),
            content,
            ...data.analysis,
            timestamp: new Date().toLocaleString(),
            mascrowStatus: data.isValidMascrow ? "verified" : "failed",
          },
          ...scans,
        ])
        setError("")
      }
    } catch (err) {
      setError("Error scanning QR code")
    } finally {
      setIsScanning(false)
    }
  }

  const handleManualScan = () => {
    if (qrInput) {
      processQRScan(qrInput)
      setQrInput("")
    }
  }

  const getRiskIcon = (level: string) => {
    if (level === "dangerous") return <XCircle className="w-5 h-5 text-red-400" />
    if (level === "warning") return <AlertTriangle className="w-5 h-5 text-yellow-400" />
    return <CheckCircle className="w-5 h-5 text-green-400" />
  }

  const getRiskColor = (level: string) => {
    if (level === "dangerous") return "bg-red-500/20 text-red-400 border-red-500/30"
    if (level === "warning") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
    return "bg-green-500/20 text-green-400 border-green-500/30"
  }

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-red-400">{error}</div>}

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Live Camera Scanner</h2>
        {!isCameraActive ? (
          <Button onClick={startCamera} className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900">
            <QrCode className="w-4 h-4 mr-2" />
            Start Camera Scan
          </Button>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg border border-slate-700"
              style={{ maxHeight: "400px" }}
            />
            <Button onClick={stopCamera} className="w-full bg-red-500 hover:bg-red-600">
              Stop Camera
            </Button>
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Manual Input</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">QR Code Content</label>
            <Input
              placeholder="Paste QR decoded content or URL"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-300 text-sm font-medium">Or Upload QR Image</label>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
              disabled={isScanning}
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>
        <Button
          onClick={handleManualScan}
          disabled={!qrInput || isScanning}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <QrCode className="w-4 h-4 mr-2" />
              Scan & Verify
            </>
          )}
        </Button>
      </div>

      {/* Scan History */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Scan History ({scans.length})</h2>
        {scans.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No scans yet. Start by scanning a QR code.</div>
        ) : (
          scans.map((scan) => (
            <div
              key={scan.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="p-2 bg-slate-700/50 rounded-lg">{getRiskIcon(scan.severity)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-white font-mono text-sm truncate">{scan.content.substring(0, 50)}...</h3>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border capitalize ${getRiskColor(scan.severity)}`}
                      >
                        {scan.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">Scanned: {scan.timestamp}</p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-3 p-3 bg-slate-900/30 rounded border border-slate-700/50">
                <div>
                  <p className="text-slate-500 text-xs">Risk Score</p>
                  <p className="text-slate-300 text-sm">
                    {(scan.riskScore * 100).toFixed(0)}% - {scan.threatType}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Indicators</p>
                  <p className="text-slate-300 text-sm">{scan.indicators.length} threat indicator(s)</p>
                </div>
              </div>

              {scan.indicators.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 font-semibold text-sm">Security Threats:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scan.indicators.map((threat: string, idx: number) => (
                      <span key={idx} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-slate-500 p-2 bg-slate-900/30 rounded">
                {scan.recommendations?.join(" • ")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
