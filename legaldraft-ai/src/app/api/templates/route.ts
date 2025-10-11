import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    let query = supabaseAdmin
      .from("document_templates")
      .select("*")
      .eq("is_custom", false)
      .order("name")

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    const { data: templates, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}