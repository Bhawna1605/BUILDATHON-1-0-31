"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import {
  Shield,
  BarChart3,
  Phone,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  AlertTriangle,
  Smartphone,
  Activity,
} from "lucide-react"

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      title: "Threat Detection",
      href: "/dashboard/threats",
      icon: AlertTriangle,
    },
    {
      title: "Call Fraud",
      href: "/dashboard/call-fraud",
      icon: Phone,
    },
    {
      title: "QR Scanner",
      href: "/dashboard/qr-scanner",
      icon: QrCode,
    },
    {
      title: "Browser Extension",
      href: "/dashboard/extension",
      icon: Smartphone,
    },
    {
      title: "Activity Log",
      href: "/dashboard/activity",
      icon: Activity,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg bg-slate-800 border border-slate-700">
          {isOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative z-40 w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 transition-transform duration-300 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-lg font-bold text-white">PhishNet</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
