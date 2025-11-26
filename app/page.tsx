import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, Zap, Lock, AlertTriangle, QrCode, Phone, BarChart3 } from "lucide-react"

export default function HomePage() {
  const features = [
    {
      title: "Advanced Threat Detection",
      description: "AI-powered detection for phishing, malware, and social engineering attacks",
      icon: AlertTriangle,
    },
    {
      title: "Browser Extension Protection",
      description: "Real-time scanning and blocking of fraudulent websites and malicious links",
      icon: Shield,
    },
    {
      title: "Call Fraud Prevention",
      description: "Smart detection and authorization system for protecting against phone scams",
      icon: Phone,
    },
    {
      title: "QR Code Scanner",
      description: "Safe QR code validation with Mascrow technology for scam detection",
      icon: QrCode,
    },
    {
      title: "Real-time Analytics",
      description: "Comprehensive threat dashboard with detailed attack analytics",
      icon: BarChart3,
    },
    {
      title: "Activity Tracking",
      description: "Complete history and logs of all security events and user activities",
      icon: Lock,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <Shield className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-xl font-bold text-white">PhishNet Sentinel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" className="border-slate-700 text-slate-200 bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white text-balance">Protect Against Cyber Threats</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto text-balance">
            Advanced AI-powered cybersecurity platform detecting phishing, fraud, and malware in real-time
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/auth/sign-up">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-8 py-6 text-lg">
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Button variant="outline" className="border-slate-700 text-slate-200 px-8 py-6 text-lg bg-transparent">
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="group bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 py-12 border-y border-slate-800">
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">99.8%</p>
            <p className="text-slate-400 mt-2">Detection Accuracy</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">10M+</p>
            <p className="text-slate-400 mt-2">Threats Blocked</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-cyan-400">50K+</p>
            <p className="text-slate-400 mt-2">Active Users</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-lg p-8 text-center space-y-4">
          <h3 className="text-3xl font-bold text-white">Start Protecting Your Business Today</h3>
          <p className="text-slate-300">Join thousands of users protecting against cybersecurity threats</p>
          <Link href="/auth/sign-up">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-8 py-6 text-lg mt-4">
              <Shield className="w-5 h-5 mr-2" />
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400">
          <p>&copy; 2025 PhishNet Sentinel. Protecting the digital world.</p>
        </div>
      </footer>
    </div>
  )
}
