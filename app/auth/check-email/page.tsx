"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Shield } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-6">
          {/* Header with Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500 rounded-lg">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <h1 className="text-2xl font-bold text-white">PhishNet Sentinel</h1>
            </div>
          </div>

          <Card className="bg-slate-800 border-slate-700 w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription>We&apos;ve sent you a confirmation link to activate your account</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-slate-300">
                Click the link in your email to confirm your account and get started with PhishNet Sentinel.
              </p>
              <div className="pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400 mb-4">
                  Already confirmed?{" "}
                  <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 underline">
                    Go to login
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
