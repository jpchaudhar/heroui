import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are an e-commerce optimization expert. Generate 3 concise, high-impact suggestions across: listing optimization, pricing/promo, and inventory/operations. Keep each under 280 chars, data-driven tone, actionable. Brand colors teal/dark-blue/light-gray.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { product = 'generic product', goals = 'increase revenue and conversion' } = body ?? {};

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        suggestions: [
          'Listing: Add lifestyle hero with teal accent; title: "+24oz insulated bottle, leakproof, BPA-free"; add comparison table. +CTR expected.',
          'Pricing: A/B test 5% markdown + coupon in off-peak; aim for price elasticity sweet spot; monitor CVR and margin daily.',
          'Ops: Reorder 1,200 units for 30-day cover; bundle slow SKUs; enable low-stock alerts to avoid stockouts.',
        ],
        source: 'demo',
      });
    }

    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Product: ${product}\nGoals: ${goals}` },
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    const text = completion.choices?.[0]?.message?.content ?? '';
    const suggestions = text
      .split(/\n+/)
      .map((s) => s.replace(/^[-*]\s*/, '').trim())
      .filter((s) => s.length > 0)
      .slice(0, 3);

    return NextResponse.json({ suggestions, source: 'openai' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}