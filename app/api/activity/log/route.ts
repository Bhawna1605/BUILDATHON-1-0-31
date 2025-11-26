import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { activityType, activityDetails } = body

    // Get client IP
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Store activity log
    const { data: activity, error: insertError } = await supabase.from("user_activity").insert({
      user_id: user.id,
      activity_type: activityType,
      activity_details: activityDetails,
      ip_address: ip,
      user_agent: userAgent,
      status: "success",
    })

    if (insertError) {
      console.error("Error logging activity:", insertError)
      return NextResponse.json({ error: "Failed to log activity" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      activityId: activity?.[0]?.id,
    })
  } catch (error) {
    console.error("Activity logging error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
