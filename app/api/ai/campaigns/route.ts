import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are a performance marketing strategist. Generate 1 campaign concept with: name, target audience, core message, channels, creative ideas, budget split, success metrics. Keep it concise and skimmable.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { audience = 'returning customers', offer = 'bundle 10% off', brand = 'teal hydration brand' } = body ?? {};

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        concept: {
          name: 'Stay Cool in Teal',
          audience,
          message: 'Hydrate smarter. Save more with our teal essentials bundle.',
          channels: ['Paid Social', 'Email', 'Onsite Banner'],
          creative: ['UGC Reels before/after', 'Carousel benefits', 'Teal-to-blue gradient hero'],
          budget: { paid_social: 55, search: 20, email: 10, creators: 15 },
          metrics: { ctr: '+18%', aov: '+7%', cac: '-10%' },
        },
        source: 'demo',
      });
    }

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Audience: ${audience}\nOffer: ${offer}\nBrand: ${brand}` },
      ],
      temperature: 0.3,
      max_tokens: 400,
    });

    const text = completion.choices?.[0]?.message?.content ?? '';
    return NextResponse.json({ raw: text, source: 'openai' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to generate campaign' }, { status: 500 });
  }
}