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

    const { error: upsertError } = await supabase.from("extension_settings").upsert(
      {
        user_id: user.id,
        extension_enabled: true,
        auto_scan: true,
        block_suspicious: true,
        notifications: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )

    if (upsertError) throw upsertError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
