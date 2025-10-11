import OpenAI from 'openai';
import { z } from 'zod';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const GenerateParams = z.object({
  templateId: z.string(),
  inputs: z.record(z.string(), z.string()),
  model: z.string().default('gpt-4o-mini'),
});

const templates: Record<string, { name: string; content: string; placeholders: string[] }> = {
  'nda-basic': {
    name: 'NDA (Mutual)',
    placeholders: ['party1', 'party2', 'effective_date', 'term_years', 'jurisdiction'],
    content:
      'NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement ("Agreement") is made effective as of {{effective_date}} by and between {{party1}} and {{party2}}...\n\n1. Purpose...\n2. Confidential Information...\n3. Term: {{term_years}} years...\n4. Governing Law: {{jurisdiction}}...'
  },
};

function fillTemplate(content: string, inputs: Record<string, string>): string {
  return content.replace(/{{(.*?)}}/g, (_, key) => inputs[key.trim()] ?? `{{${key}}}`);
}

export async function generateDocument(params: z.infer<typeof GenerateParams>) {
  const { templateId, inputs, model } = GenerateParams.parse(params);
  const base = templates[templateId];
  if (!base) throw new Error('Unknown template');

  const filled = fillTemplate(base.content, inputs);

  const system = 'You are a senior attorney drafting professional legal documents with clear sections.';
  const user = `Refine and expand the following ${base.name} into a professionally formatted legal document with proper sections, headings, and definitions. Maintain neutrality and ensure completeness.\n\nCONTENT:\n${filled}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ],
    temperature: 0.2,
  });

  const text = response.choices[0]?.message?.content ?? '';
  return { text };
}
