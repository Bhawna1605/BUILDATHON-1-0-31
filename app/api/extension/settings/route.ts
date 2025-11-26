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

    // Save or update extension settings
    const { error: updateError } = await supabase.from("extension_settings").upsert({
      user_id: user.id,
      extension_enabled: body.extensionEnabled,
      auto_scan: body.autoScan,
      block_suspicious: body.blockSuspicious,
      notifications: body.notifications,
      updated_at: new Date().toISOString(),
    })

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Settings save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
