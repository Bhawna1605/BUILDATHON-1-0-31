"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Loader2, FileText, ExternalLink } from "lucide-react"

interface CyberPoliceContact {
  id: string
  country: string
  state_city: string
  organization_name: string
  email: string
  phone: string
  website: string
  complaint_url: string
}

interface FIRRecord {
  id: string
  complaint_type: string
  description: string
  incident_date: string
  fraudster_contact: string
  fir_status: string
  cyber_police_reference: string
  cyber_police_name: string
  created_at: string
}

export function CyberFIRReporter({ userId }: { userId: string }) {
  const [activeTab, setActiveTab] = useState("submit")
  const [contacts, setContacts] = useState<CyberPoliceContact[]>([])
  const [firHistory, setFirHistory] = useState<FIRRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    complaintType: "phishing",
    description: "",
    incidentDate: new Date().toISOString().split("T")[0],
    fraudsterContact: "",
    fraudsterDetails: "",
    evidenceUrl: "",
    selectedContact: "",
  })

  useEffect(() => {
    loadContacts()
    loadHistory()
  }, [])

  const loadContacts = async () => {
    try {
      const response = await fetch("/api/cyber-fir/contacts")
      const data = await response.json()
      setContacts(data.contacts || [])
    } catch (error) {
      console.error("Error loading contacts:", error)
    }
  }

  const loadHistory = async () => {
    try {
      setHistoryLoading(true)
      const response = await fetch("/api/cyber-fir/history")
      const data = await response.json()
      setFirHistory(data.firs || [])
    } catch (error) {
      console.error("Error loading history:", error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const selectedContactData = contacts.find((c) => c.id === formData.selectedContact)

      const response = await fetch("/api/cyber-fir/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintType: formData.complaintType,
          description: formData.description,
          incidentDate: formData.incidentDate,
          fraudsterContact: formData.fraudsterContact,
          fraudsterDetails: formData.fraudsterDetails,
          evidenceUrl: formData.evidenceUrl,
          cyberPoliceName: selectedContactData?.organization_name,
          cyberPoliceEmail: selectedContactData?.email,
          cyberPolicePhone: selectedContactData?.phone,
          cyberPoliceWebsite: selectedContactData?.website,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
        setFormData({
          complaintType: "phishing",
          description: "",
          incidentDate: new Date().toISOString().split("T")[0],
          fraudsterContact: "",
          fraudsterDetails: "",
          evidenceUrl: "",
          selectedContact: "",
        })
        loadHistory()
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      alert("Error submitting FIR")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
      <TabsList className="bg-slate-800/50 border border-slate-700">
        <TabsTrigger value="submit" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
          Submit FIR
        </TabsTrigger>
        <TabsTrigger value="history" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
          FIR History
        </TabsTrigger>
        <TabsTrigger value="contacts" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
          Cyber Police
        </TabsTrigger>
      </TabsList>

      <TabsContent value="submit" className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Submit Cyber Fraud FIR</CardTitle>
            <CardDescription>
              File a First Information Report (FIR) with cyber police for fraud investigations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {submitted && (
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-green-400 text-sm">
                    <p className="font-semibold">FIR Submitted Successfully!</p>
                    <p className="text-xs mt-1">Your complaint has been submitted. Save your reference number.</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Select Cyber Police Authority</label>
                <select
                  value={formData.selectedContact}
                  onChange={(e) => setFormData({ ...formData, selectedContact: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300"
                  required
                >
                  <option value="">Choose cyber police authority...</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.organization_name} - {contact.state_city}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Complaint Type</label>
                <select
                  value={formData.complaintType}
                  onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300"
                >
                  <option value="phishing">Phishing</option>
                  <option value="malware">Malware</option>
                  <option value="call_fraud">Call Fraud</option>
                  <option value="qr_scam">QR Code Scam</option>
                  <option value="identity_theft">Identity Theft</option>
                  <option value="financial_fraud">Financial Fraud</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Incident Date</label>
                <Input
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Fraudster Contact (Phone/Email)</label>
                <Input
                  placeholder="e.g., +1234567890 or fraud@example.com"
                  value={formData.fraudsterContact}
                  onChange={(e) => setFormData({ ...formData, fraudsterContact: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Fraudster Details</label>
                <Input
                  placeholder="Names, account numbers, addresses, or other identifying information"
                  value={formData.fraudsterDetails}
                  onChange={(e) => setFormData({ ...formData, fraudsterDetails: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Complaint Description</label>
                <textarea
                  placeholder="Provide detailed description of the fraud incident..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm"
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Evidence URL or Reference</label>
                <Input
                  placeholder="Link to phishing site, malware, etc."
                  value={formData.evidenceUrl}
                  onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.selectedContact || !formData.description}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Submit FIR
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="history" className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Your FIR Reports</CardTitle>
            <CardDescription>History of all submitted FIR complaints</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              </div>
            ) : firHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No FIR reports submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {firHistory.map((fir) => (
                  <div key={fir.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-white capitalize">{fir.complaint_type.replace("_", " ")}</h3>
                        <p className="text-sm text-slate-400">{new Date(fir.created_at).toLocaleDateString()}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          fir.fir_status === "submitted"
                            ? "bg-blue-500/20 text-blue-400"
                            : fir.fir_status === "acknowledged"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : fir.fir_status === "investigating"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {fir.fir_status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300">{fir.description.substring(0, 150)}...</p>
                    {fir.cyber_police_reference && (
                      <div className="p-2 bg-slate-900/50 rounded border border-slate-700">
                        <p className="text-xs text-slate-400">Reference #</p>
                        <p className="text-sm font-mono text-cyan-400">{fir.cyber_police_reference}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="contacts" className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Cyber Police Contacts</CardTitle>
            <CardDescription>Direct contact information for cyber crime reporting authorities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{contact.organization_name}</h3>
                      <p className="text-sm text-slate-400">{contact.state_city}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Email</p>
                      <p className="text-slate-300">{contact.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Phone</p>
                      <p className="text-slate-300">{contact.phone}</p>
                    </div>
                  </div>

                  {contact.complaint_url && (
                    <Button
                      onClick={() => window.open(contact.complaint_url, "_blank")}
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      File Complaint Online
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
