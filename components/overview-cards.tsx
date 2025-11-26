"use client"

import { AlertTriangle, Shield, Phone, QrCode } from "lucide-react"

export function OverviewCards() {
  const stats = [
    {
      title: "Threats Detected",
      value: "23",
      change: "+5 this week",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
    },
    {
      title: "Protected Devices",
      value: "4",
      change: "2 extensions active",
      icon: Shield,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      title: "Call Fraud Blocked",
      value: "8",
      change: "+2 this month",
      icon: Phone,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      title: "QR Scans",
      value: "12",
      change: "0 dangerous detected",
      icon: QrCode,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.title}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                <p className="text-slate-500 text-xs mt-2">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
