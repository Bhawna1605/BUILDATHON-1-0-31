"use client"

import { useState, useEffect } from "react"
import { Smartphone, Download, ToggleRight, ToggleLeft, RefreshCw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExtensionPanelProps {
  userId: string
}

export function ExtensionPanel({ userId }: ExtensionPanelProps) {
  const [extensions, setExtensions] = useState<any[]>([])
  const [settings, setSettings] = useState({
    extensionEnabled: true,
    autoScan: true,
    blockSuspicious: true,
    notifications: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState("")

  useEffect(() => {
    loadExtensionConfig()
  }, [])

  const loadExtensionConfig = async () => {
    try {
      const response = await fetch("/api/extension/config")
      const data = await response.json()
      if (data.extensions) setExtensions(data.extensions)
      if (data.settings) setSettings(data.settings)
    } catch (err) {
      console.error("Error loading extension config:", err)
      setExtensions([
        { id: 1, name: "Chrome Extension", version: "2.1.0", status: "active", lastSync: "Just now", devicesLinked: 1 },
        { id: 2, name: "Firefox Add-on", version: "2.1.0", status: "active", lastSync: "Just now", devicesLinked: 1 },
      ])
    }
  }

  const saveSettings = async (key: string, value: boolean) => {
    setIsLoading(true)
    try {
      const newSettings = { ...settings, [key]: value }
      const response = await fetch("/api/extension/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      })

      if (response.ok) {
        setSettings(newSettings)
        setSyncStatus("Settings saved successfully")
        setTimeout(() => setSyncStatus(""), 3000)
      }
    } catch (err) {
      setSyncStatus("Error saving settings")
    } finally {
      setIsLoading(false)
    }
  }

  const syncExtensions = async () => {
    setIsLoading(true)
    setSyncStatus("Syncing...")
    try {
      const response = await fetch("/api/extension/sync", { method: "POST" })
      const data = await response.json()
      if (data.success) {
        setSyncStatus("Synced successfully")
        await loadExtensionConfig()
      }
    } catch (err) {
      setSyncStatus("Sync failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {syncStatus && (
        <div className="bg-cyan-500/20 border border-cyan-500/30 rounded-lg p-4 text-cyan-400">{syncStatus}</div>
      )}

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
              <a
                href={extensions[0]?.downloadUrl || "https://chrome.google.com/webstore"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                  <Download className="w-4 h-4 mr-2" />
                  Chrome Web Store
                </Button>
              </a>
              <a
                href={extensions[1]?.downloadUrl || "https://addons.mozilla.org"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                  <Download className="w-4 h-4 mr-2" />
                  Firefox Add-ons
                </Button>
              </a>
              <a
                href={extensions[2]?.downloadUrl || "https://microsoftedge.microsoft.com/addons"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
                  <Download className="w-4 h-4 mr-2" />
                  Edge Add-ons
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Active Extensions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Your Extensions</h2>
        {extensions.length > 0 ? (
          extensions.map((ext) => (
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
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-700 bg-transparent"
                  onClick={syncExtensions}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline" className="border-slate-700 bg-transparent">
                  Details
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-400">No extensions installed. Download one from below.</p>
        )}
      </div>

      {/* Extension Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Extension Settings</h2>
        <div className="space-y-4">
          {[
            { key: "extensionEnabled", label: "Extension Status", desc: "Enable or disable all extensions" },
            { key: "autoScan", label: "Auto-Scan Websites", desc: "Automatically scan pages you visit" },
            {
              key: "blockSuspicious",
              label: "Block Suspicious Sites",
              desc: "Automatically block phishing and malware",
            },
            { key: "notifications", label: "Desktop Notifications", desc: "Receive alerts for detected threats" },
          ].map(({ key, label, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-slate-900/30 rounded border border-slate-700/50"
            >
              <div>
                <p className="text-white font-medium">{label}</p>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
              <button
                onClick={() => saveSettings(key, !settings[key as keyof typeof settings])}
                disabled={isLoading}
                className={`p-2 rounded-lg transition-colors ${
                  settings[key as keyof typeof settings] ? "bg-green-500/20" : "bg-slate-700"
                }`}
              >
                {settings[key as keyof typeof settings] ? (
                  <ToggleRight className="w-6 h-6 text-green-400" />
                ) : (
                  <ToggleLeft className="w-6 h-6 text-slate-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
