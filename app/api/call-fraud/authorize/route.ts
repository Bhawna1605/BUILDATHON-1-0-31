import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { phoneNumber } = body

    // Generate authorization code
    const authCode = crypto.randomInt(100000, 999999).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    // Store authorization token
    const { data: tokenData, error: tokenError } = await supabase.from("auth_tokens").insert({
      user_id: user.id,
      token_type: "call-authorization",
      token_value: authCode,
      phone_number: phoneNumber,
      is_active: true,
      expires_at: expiresAt.toISOString(),
    })

    if (tokenError) {
      console.error("Error creating authorization token:", tokenError)
      return NextResponse.json({ error: "Failed to generate code" }, { status: 500 })
    }

    // Log activity
    await supabase.from("user_activity").insert({
      user_id: user.id,
      activity_type: "authorize-call",
      activity_details: { phoneNumber, authCode },
      status: "success",
    })

    return NextResponse.json({
      success: true,
      authCode,
      expiresIn: 900, // seconds
      message: "Authorization code generated. Valid for 15 minutes.",
    })
  } catch (error) {
    console.error("Authorization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    // Get active authorization tokens
    const { data: tokens, error: tokensError } = await supabase
      .from("auth_tokens")
      .select("*")
      .eq("user_id", user.id)
      .eq("token_type", "call-authorization")
      .eq("is_active", true)
      .gt("expires_at", new Date().toISOString())

    if (tokensError) {
      return NextResponse.json({ error: "Failed to fetch tokens" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      activeTokens: tokens,
    })
  } catch (error) {
    console.error("Fetch tokens error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
