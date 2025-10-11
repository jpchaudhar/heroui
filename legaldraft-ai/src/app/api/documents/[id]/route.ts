import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: document, error } = await supabaseAdmin
      .from("documents")
      .select(`
        *,
        document_templates (
          id,
          name,
          category,
          description
        )
      `)
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabaseAdmin
      .from("documents")
      .delete()
      .eq("id", params.id)
      .eq("user_id", userId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}