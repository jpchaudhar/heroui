import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { supabaseAdmin } from "@/lib/supabase"
import { openai } from "@/lib/openai"

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: documents, error } = await supabaseAdmin
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
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ documents })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { templateId, title, formData } = await request.json()

    // Get template
    const { data: template, error: templateError } = await supabaseAdmin
      .from("document_templates")
      .select("*")
      .eq("id", templateId)
      .single()

    if (templateError || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    // Generate document content using OpenAI
    const prompt = `Generate a professional legal document based on this template and the provided information:

Template: ${template.template}

User Information:
${Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join('\n')}

Please generate a complete, professional legal document that replaces all placeholders with the provided information. Ensure the document is properly formatted and legally sound.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional legal document generator. Create accurate, well-formatted legal documents based on templates and user input."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    })

    const generatedContent = completion.choices[0]?.message?.content || ""

    // Save document to database
    const { data: document, error: documentError } = await supabaseAdmin
      .from("documents")
      .insert({
        user_id: userId,
        template_id: templateId,
        title,
        content: generatedContent,
        status: "completed"
      })
      .select()
      .single()

    if (documentError) {
      return NextResponse.json({ error: documentError.message }, { status: 500 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error("Error generating document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}