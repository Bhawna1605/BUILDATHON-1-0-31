import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      complaintType,
      description,
      incidentDate,
      fraudsterContact,
      fraudsterDetails,
      evidenceUrl,
      checkHistoryId,
      cyberPoliceName,
      cyberPoliceEmail,
      cyberPolicePhone,
      cyberPoliceWebsite,
    } = body

    if (!complaintType || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("cyber_fraud_fir")
      .insert({
        user_id: user.id,
        complaint_type: complaintType,
        description,
        incident_date: incidentDate || new Date().toISOString(),
        fraudster_contact: fraudsterContact,
        fraudster_details: fraudsterDetails,
        evidence_url: evidenceUrl,
        check_history_id: checkHistoryId,
        cyber_police_name: cyberPoliceName,
        cyber_police_email: cyberPoliceEmail,
        cyber_police_phone: cyberPolicePhone,
        cyber_police_website: cyberPoliceWebsite,
        fir_status: "submitted",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to submit FIR" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      fir: data,
      message: "FIR submitted successfully. Please save the reference number for your records.",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
