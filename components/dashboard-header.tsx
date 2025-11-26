"use client"

import type { User } from "@supabase/supabase-js"
import { Bell, Clock } from "lucide-react"
import { useState, useEffect } from "react"

interface DashboardHeaderProps {
  user: User
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString())
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="bg-slate-900/50 border-b border-slate-800 px-6 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-white font-semibold">Welcome back</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-mono">{time}</span>
        </div>
        <button className="relative p-2 text-slate-400 hover:text-cyan-400 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </header>
  )
}
