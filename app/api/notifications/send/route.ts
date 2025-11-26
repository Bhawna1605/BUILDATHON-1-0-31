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
    const { notificationType, title, message, priority = "normal" } = body

    // Store notification
    const { data: notification, error: insertError } = await supabase.from("notifications").insert({
      user_id: user.id,
      notification_type: notificationType,
      title,
      message,
      priority,
      is_read: false,
    })

    if (insertError) {
      console.error("Error creating notification:", insertError)
      return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
    }

    // In production, would send email/SMS/push notification here

    return NextResponse.json({
      success: true,
      notificationId: notification?.[0]?.id,
    })
  } catch (error) {
    console.error("Notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
