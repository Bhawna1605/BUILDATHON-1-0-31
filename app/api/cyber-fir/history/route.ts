import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const complaintType = searchParams.get("complaintType")

    let query = supabase
      .from("cyber_fraud_fir")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (complaintType && complaintType !== "all") {
      query = query.eq("complaint_type", complaintType)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch FIR history" }, { status: 500 })
    }

    return NextResponse.json({ firs: data || [] })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
