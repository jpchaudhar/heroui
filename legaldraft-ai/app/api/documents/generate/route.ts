import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase, supabaseAdmin } from '@/lib/supabase/client';
import { generateDocument } from '@/lib/openai/client';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, fields } = await request.json();

    // Fetch user and check subscription limits
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('subscription_tier, documents_count')
      .eq('id', userId)
      .single();

    // If user doesn't exist, create them
    if (userError && userError.code === 'PGRST116') {
      const { data: clerkUser } = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }).then((res) => res.json());

      await supabaseAdmin.from('users').insert({
        id: userId,
        email: clerkUser?.email_addresses?.[0]?.email_address || '',
        name: `${clerkUser?.first_name || ''} ${clerkUser?.last_name || ''}`.trim() || 'User',
        subscription_tier: 'free',
        documents_count: 0,
      });
    }

    // Check document limit for free tier
    if (user?.subscription_tier === 'free') {
      const { data: documents } = await supabase
        .from('documents')
        .select('created_at')
        .eq('user_id', userId);

      const thisMonth = documents?.filter((doc) => {
        const docDate = new Date(doc.created_at);
        const now = new Date();
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
      }).length || 0;

      if (thisMonth >= 3) {
        return NextResponse.json(
          { error: 'Document limit reached. Please upgrade to continue.' },
          { status: 403 }
        );
      }
    }

    // Fetch template
    const { data: template, error: templateError } = await supabase
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) throw templateError;

    // Generate document content using AI
    const content = await generateDocument(template.base_template, fields, template.name);

    // Save document
    const { data: document, error: docError } = await supabaseAdmin
      .from('documents')
      .insert({
        user_id: userId,
        template_id: templateId,
        title: `${template.name} - ${new Date().toLocaleDateString()}`,
        content,
        status: 'completed',
      })
      .select()
      .single();

    if (docError) throw docError;

    // Update user's document count
    await supabaseAdmin
      .from('users')
      .update({ documents_count: (user?.documents_count || 0) + 1 })
      .eq('id', userId);

    return NextResponse.json({ documentId: document.id, content });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}
