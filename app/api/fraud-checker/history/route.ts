import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const checkType = searchParams.get("checkType")

    let query = supabase
      .from("fraud_checker_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (checkType && checkType !== "all") {
      query = query.eq("check_type", checkType)
    }

    const { data, error } = await query.range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching history:", error)
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }

    return NextResponse.json({ checks: data || [] })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
