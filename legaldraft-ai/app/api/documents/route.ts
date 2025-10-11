import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch documents
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (docsError) throw docsError;

    // Fetch user subscription info
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('subscription_tier, documents_count')
      .eq('id', userId)
      .single();

    if (userError && userError.code !== 'PGRST116') throw userError;

    // Calculate stats
    const thisMonth = documents?.filter((doc) => {
      const docDate = new Date(doc.created_at);
      const now = new Date();
      return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
    }).length || 0;

    const tier = user?.subscription_tier || 'free';
    const remaining = tier === 'free' ? Math.max(0, 3 - thisMonth) : null;

    return NextResponse.json({
      documents: documents || [],
      stats: {
        total: documents?.length || 0,
        thisMonth,
        remaining,
        tier,
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}
