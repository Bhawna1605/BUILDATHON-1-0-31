import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("cyber_police_contacts").select("*").order("country, state_city")

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch cyber police contacts" }, { status: 500 })
    }

    return NextResponse.json({ contacts: data || [] })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
