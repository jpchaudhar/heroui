import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json, urlencoded } from 'express';
import { router as templatesRouter } from './routes/templates.js';
import { router as documentsRouter } from './routes/documents.js';
import { router as billingRouter } from './routes/billing.js';

const app = express();

app.use(cors());
app.use(json({ limit: '2mb' }));
app.use(urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'legaldraft-server' });
});

app.use('/api/templates', templatesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/billing', billingRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
