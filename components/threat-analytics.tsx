"use client"

import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"

export function ThreatAnalytics() {
  const threatData = [
    { date: "Mon", phishing: 4, malware: 2, social: 1, qr: 0 },
    { date: "Tue", phishing: 3, malware: 1, social: 2, qr: 1 },
    { date: "Wed", phishing: 2, malware: 3, social: 1, qr: 0 },
    { date: "Thu", phishing: 5, malware: 2, social: 3, qr: 2 },
    { date: "Fri", phishing: 3, malware: 1, social: 2, qr: 1 },
    { date: "Sat", phishing: 2, malware: 0, social: 0, qr: 0 },
    { date: "Sun", phishing: 4, malware: 2, social: 1, qr: 1 },
  ]

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-white font-semibold mb-4">Threat Trends (7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={threatData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #475569",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f1f5f9" }}
          />
          <Legend />
          <Bar dataKey="phishing" fill="#ef4444" name="Phishing" />
          <Bar dataKey="malware" fill="#f97316" name="Malware" />
          <Bar dataKey="social" fill="#eab308" name="Social Eng." />
          <Bar dataKey="qr" fill="#3b82f6" name="QR Scams" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
