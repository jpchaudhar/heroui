import { Router } from 'express';
import { z } from 'zod';

export const router = Router();

const Template = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['Business', 'Employment', 'Property', 'Litigation']),
  description: z.string().optional(),
  placeholders: z.array(z.string()),
  content: z.string(),
});

const templates: z.infer<typeof Template>[] = [
  {
    id: 'nda-basic',
    name: 'NDA (Mutual)',
    category: 'Business',
    description: 'Mutual non-disclosure agreement for early-stage discussions.',
    placeholders: ['party1', 'party2', 'effective_date', 'term_years', 'jurisdiction'],
    content:
      'NON-DISCLOSURE AGREEMENT between {{party1}} and {{party2}} effective {{effective_date}} for a term of {{term_years}} years under {{jurisdiction}} law...'
  },
];

router.get('/', (_req, res) => {
  res.json({ templates });
});

router.get('/:id', (req, res) => {
  const template = templates.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json({ template });
});
