import { Router } from 'express';
import { z } from 'zod';
import { generateDocument } from '../services/generation.js';
import { exportDocument } from '../utils/export.js';

export const router = Router();

const GenerateBody = z.object({
  templateId: z.string(),
  inputs: z.record(z.string(), z.string()),
  model: z.string().default('gpt-4o-mini'),
});

router.post('/generate', async (req, res) => {
  const parsed = GenerateBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { templateId, inputs, model } = parsed.data;

  try {
    const result = await generateDocument({ templateId, inputs, model });
    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? 'Generation failed' });
  }
});

const ExportBody = z.object({ text: z.string(), format: z.enum(['pdf', 'docx']).default('pdf') });

router.post('/export', async (req, res) => {
  const parsed = ExportBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const { buffer, filename } = await exportDocument(parsed.data);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', parsed.data.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
