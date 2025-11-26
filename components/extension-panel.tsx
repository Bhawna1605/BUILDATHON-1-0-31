"use client"

import { useState } from "react"
import { Smartphone, Download, ToggleRight, ToggleLeft, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExtensionPanelProps {
  userId: string
}

export function ExtensionPanel({ userId }: ExtensionPanelProps) {
  const [extensionEnabled, setExtensionEnabled] = useState(true)
  const [autoScan, setAutoScan] = useState(true)
  const [blockSuspicious, setBlockSuspicious] = useState(true)
  const [notifications, setNotifications] = useState(true)

  const extensions = [
    {
      id: 1,
      name: "Chrome Extension",
      version: "2.1.0",
      status: "active",
      lastSync: "2 minutes ago",
      devicesLinked: 2,
    },
    {
      id: 2,
      name: "Firefox Add-on",
      version: "2.1.0",
      status: "active",
      lastSync: "15 minutes ago",
      devicesLinked: 1,
    },
    {
      id: 3,
      name: "Edge Extension",
      version: "2.0.9",
      status: "inactive",
      lastSync: "3 days ago",
      devicesLinked: 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Installation Guide */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg p-6 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-white font-semibold mb-2">Get Started with Browser Protection</h3>
            <p className="text-slate-400 text-sm mb-4">
              Download and install the PhishNet Sentinel browser extension to get real-time threat protection across all
              your browsing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                <Download className="w-4 h-4 mr-2" />
                Chrome Web Store
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                <Download className="w-4 h-4 mr-2" />
                Firefox Add-ons
              </Button>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                <Download className="w-4 h-4 mr-2" />
                Edge Add-ons
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Extensions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Your Extensions</h2>
        {extensions.map((ext) => (
          <div
            key={ext.id}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-white font-semibold">{ext.name}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        ext.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-700 text-slate-400"
                      }`}
                    >
                      {ext.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">v{ext.version}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className={ext.status === "active" ? "border-green-500/30" : "border-slate-700"}
              >
                {ext.status === "active" ? (
                  <>
                    <ToggleRight className="w-4 h-4 mr-2 text-green-400" />
                    Disable
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-3 p-3 bg-slate-900/30 rounded border border-slate-700/50 text-sm">
              <div>
                <p className="text-slate-500 text-xs">Last Synced</p>
                <p className="text-slate-300">{ext.lastSync}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Devices Linked</p>
                <p className="text-slate-300">{ext.devicesLinked}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs">Version</p>
                <p className="text-slate-300">v{ext.version}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
              <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Extension Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Extension Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded border border-slate-700/50">
            <div>
              <p className="text-white font-medium">Extension Status</p>
              <p className="text-slate-400 text-sm">Enable or disable all extensions</p>
            </div>
            <button
              onClick={() => setExtensionEnabled(!extensionEnabled)}
              className={`p-2 rounded-lg transition-colors ${extensionEnabled ? "bg-green-500/20" : "bg-slate-700"}`}
            >
              {extensionEnabled ? (
                <ToggleRight className="w-6 h-6 text-green-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded border border-slate-700/50">
            <div>
              <p className="text-white font-medium">Auto-Scan Websites</p>
              <p className="text-slate-400 text-sm">Automatically scan pages you visit</p>
            </div>
            <button
              onClick={() => setAutoScan(!autoScan)}
              className={`p-2 rounded-lg transition-colors ${autoScan ? "bg-green-500/20" : "bg-slate-700"}`}
            >
              {autoScan ? (
                <ToggleRight className="w-6 h-6 text-green-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded border border-slate-700/50">
            <div>
              <p className="text-white font-medium">Block Suspicious Sites</p>
              <p className="text-slate-400 text-sm">Automatically block phishing and malware sites</p>
            </div>
            <button
              onClick={() => setBlockSuspicious(!blockSuspicious)}
              className={`p-2 rounded-lg transition-colors ${blockSuspicious ? "bg-green-500/20" : "bg-slate-700"}`}
            >
              {blockSuspicious ? (
                <ToggleRight className="w-6 h-6 text-green-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded border border-slate-700/50">
            <div>
              <p className="text-white font-medium">Desktop Notifications</p>
              <p className="text-slate-400 text-sm">Receive alerts for detected threats</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`p-2 rounded-lg transition-colors ${notifications ? "bg-green-500/20" : "bg-slate-700"}`}
            >
              {notifications ? (
                <ToggleRight className="w-6 h-6 text-green-400" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-slate-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
