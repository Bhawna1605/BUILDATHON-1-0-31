"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Save, Key, Bell, Lock, Users } from "lucide-react"

interface SettingsPanelProps {
  user: any
}

export function SettingsPanel({ user }: SettingsPanelProps) {
  const [email, setEmail] = useState(user?.email || "")

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm font-medium">Email Address</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 bg-slate-700 border-slate-600 text-white"
            />
          </div>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-slate-700 bg-transparent">
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button variant="outline" className="w-full justify-start border-slate-700 bg-transparent">
            <Lock className="w-4 h-4 mr-2" />
            Two-Factor Authentication
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 bg-slate-900/30 rounded border border-slate-700/50 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-slate-300">Email notifications for threats</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-slate-900/30 rounded border border-slate-700/50 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span className="text-slate-300">Desktop notifications</span>
          </label>
          <label className="flex items-center gap-3 p-3 bg-slate-900/30 rounded border border-slate-700/50 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-slate-300">Weekly security report</span>
          </label>
        </div>
      </div>

      {/* Linked Devices */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">Linked Devices</h2>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-slate-900/30 rounded border border-slate-700/50">
            <p className="text-slate-300 font-medium">MacBook Pro</p>
            <p className="text-slate-500 text-sm">Chrome Extension v2.1.0 • Last active 2 hours ago</p>
          </div>
          <div className="p-3 bg-slate-900/30 rounded border border-slate-700/50">
            <p className="text-slate-300 font-medium">Windows Desktop</p>
            <p className="text-slate-500 text-sm">Firefox Add-on v2.1.0 • Last active 1 day ago</p>
          </div>
        </div>
      </div>
    </div>
  )
}
