import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: config, error } = await supabase
      .from("extension_settings")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    // Default settings if none exist
    const defaultSettings = {
      extensionEnabled: true,
      autoScan: true,
      blockSuspicious: true,
      notifications: true,
    }

    return NextResponse.json({
      extensions: [
        { id: 1, name: "Chrome Extension", version: "2.1.0", status: "active", lastSync: "Just now", devicesLinked: 1 },
        { id: 2, name: "Firefox Add-on", version: "2.1.0", status: "active", lastSync: "Just now", devicesLinked: 1 },
      ],
      settings: config
        ? {
            extensionEnabled: config.extension_enabled,
            autoScan: config.auto_scan,
            blockSuspicious: config.block_suspicious,
            notifications: config.notifications,
          }
        : defaultSettings,
    })
  } catch (error) {
    console.error("Config fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
