"use client"

import { useState } from "react"
import { QrCode, CheckCircle, AlertTriangle, XCircle, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface QRScannerPanelProps {
  userId: string
}

export function QRScannerPanel({ userId }: QRScannerPanelProps) {
  const [qrInput, setQrInput] = useState("")

  const qrScans = [
    {
      id: 1,
      content: "https://secure-bank-payment.com/verify",
      decodedUrl: "https://malicious-redirector.ru/phishing",
      timestamp: "1 hour ago",
      riskLevel: "dangerous",
      mascrowStatus: "failed",
      mascrowHash: "hash_mismatch_detected",
      threats: ["URL Redirection to Phishing Site", "Mascrow Validation Failed"],
    },
    {
      id: 2,
      content: "https://pizza-delivery.app/order",
      decodedUrl: "https://pizzadelivery.com/order/12345",
      timestamp: "3 hours ago",
      riskLevel: "safe",
      mascrowStatus: "verified",
      mascrowHash: "validated_e8f9a2c",
      threats: [],
    },
    {
      id: 3,
      content: "WIFI:T:WPA;S:HotelGuest;P:password123",
      decodedUrl: "WiFi Configuration",
      timestamp: "5 hours ago",
      riskLevel: "warning",
      mascrowStatus: "partial",
      mascrowHash: "unverified_network",
      threats: ["Unverified WiFi Network", "Potential MITM Attack"],
    },
    {
      id: 4,
      content: "https://official-vendor-store.com",
      decodedUrl: "https://official-vendor-store.com",
      timestamp: "1 day ago",
      riskLevel: "safe",
      mascrowStatus: "verified",
      mascrowHash: "validated_b4c2d9e",
      threats: [],
    },
  ]

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
      {/* Scanner Input */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Scan QR Code</h2>
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
            <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600">
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </div>
        </div>
        <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900">
          <QrCode className="w-4 h-4 mr-2" />
          Scan & Verify
        </Button>
      </div>

      {/* Scan History */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Scan History</h2>
        {qrScans.map((scan) => (
          <div
            key={scan.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-slate-700/50 rounded-lg">{getRiskIcon(scan.riskLevel)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-mono text-sm truncate">{scan.content.substring(0, 50)}...</h3>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded border capitalize ${getRiskColor(scan.riskLevel)}`}
                    >
                      {scan.riskLevel === "dangerous" ? "Dangerous" : scan.riskLevel === "warning" ? "Warning" : "Safe"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">Scanned: {scan.timestamp}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3 p-3 bg-slate-900/30 rounded border border-slate-700/50">
              <div>
                <p className="text-slate-500 text-xs">Decoded URL</p>
                <p className="text-slate-300 text-sm truncate font-mono">{scan.decodedUrl}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Mascrow Validation</p>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      scan.mascrowStatus === "verified"
                        ? "bg-green-400"
                        : scan.mascrowStatus === "partial"
                          ? "bg-yellow-400"
                          : "bg-red-400"
                    }`}
                  ></div>
                  <span className="text-slate-300 text-sm capitalize">{scan.mascrowStatus}</span>
                </div>
              </div>
            </div>

            {scan.threats.length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 font-semibold text-sm">Security Threats:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {scan.threats.map((threat, idx) => (
                    <span key={idx} className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                      {threat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {scan.riskLevel !== "safe" && (
                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                  Report
                </Button>
              )}
              <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
