import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { z } from "zod";
import OpenAI from "openai";
import Stripe from "stripe";
import PDFDocument from "pdfkit";
import { Document, Packer, Paragraph, TextRun } from "docx";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.get("/templates", (_req: Request, res: Response) => {
  const list = Object.entries(templates).map(([slug, t]) => ({ slug, title: t.title }));
  res.json({ templates: list });
});

// Simple in-memory templates to start
const templates: Record<string, { title: string; prompt: (inputs: any) => string }> = {
  nda: {
    title: "NDA",
    prompt: (i) =>
      `Draft a Non-Disclosure Agreement between ${i.party1} and ${i.party2} on ${i.date} for company ${i.company ??
        "N/A"}. Include clauses for ${i.details}. Format in professional legal style with section titles.`,
  },
  lease: {
    title: "Lease",
    prompt: (i) =>
      `Draft a Residential Lease Agreement between ${i.party1} and ${i.party2} dated ${i.date}. Include clauses for ${i.details}. Use formal legal formatting with numbered sections.`,
  },
  "offer-letter": {
    title: "Offer Letter",
    prompt: (i) =>
      `Draft an Employment Offer Letter from ${i.company ?? "the Company"} to ${i.party1} dated ${i.date}. Include details: ${i.details}. Use professional formatting.`,
  },
};

const generateSchema = z.object({
  templateSlug: z.string().min(1),
  inputs: z.object({
    party1: z.string().min(1),
    party2: z.string().min(1),
    company: z.string().optional(),
    date: z.string().min(1),
    details: z.string().min(1),
  }),
});

app.post("/documents/generate", async (req: Request, res: Response) => {
  const parse = generateSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Invalid input", issues: parse.error.issues });
  }
  const { templateSlug, inputs } = parse.data;
  const t = templates[templateSlug];
  if (!t) {
    return res.status(404).json({ error: "Template not found" });
  }

  const prompt = t.prompt(inputs);

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a senior attorney drafting clear, enforceable legal documents." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });
    const content = completion.choices[0]?.message?.content ?? "";
    return res.json({ content, template: t.title });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

// Export as PDF
const exportSchema = z.object({
  content: z.string().min(1),
  title: z.string().optional(),
});

app.post("/documents/export/pdf", (req: Request, res: Response) => {
  const parse = exportSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });
  const { content, title } = parse.data;
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=\"${(title || "document").replace(/[^a-z0-9_-]/gi, "_")}.pdf\"`);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);
  if (title) {
    doc.fontSize(18).text(title, { align: "center" }).moveDown();
  }
  doc.fontSize(12).text(content, { align: "left" });
  doc.end();
});

// Export as DOCX
app.post("/documents/export/docx", async (req: Request, res: Response) => {
  const parse = exportSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: "Invalid input" });
  const { content, title } = parse.data;

  const paragraphs = content.split(/\n{2,}/).map((block) => new Paragraph({ children: [new TextRun(block)] }));
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: title ? [new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 32 })] })].concat(paragraphs) : paragraphs,
      },
    ],
  });
  const buffer = await Packer.toBuffer(doc);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  res.setHeader("Content-Disposition", `attachment; filename=\"${(title || "document").replace(/[^a-z0-9_-]/gi, "_")}.docx\"`);
  res.send(Buffer.from(buffer));
});

// Stripe billing
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

app.post("/billing/create-checkout", async (req: Request, res: Response) => {
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  const body = z.object({ plan: z.enum(["pro", "firm"]) }).safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: "Invalid plan" });

  try {
    const priceMap: Record<string, string | undefined> = {
      pro: process.env.STRIPE_PRICE_PRO,
      firm: process.env.STRIPE_PRICE_FIRM,
    };
    const priceId = priceMap[body.data.plan];
    if (!priceId) return res.status(500).json({ error: "Missing Stripe price IDs" });
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.APP_URL || "http://localhost:3000"}/dashboard/billing?success=1`,
      cancel_url: `${process.env.APP_URL || "http://localhost:3000"}/dashboard/billing?canceled=1`,
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create checkout" });
  }
});

app.post("/billing/portal", async (_req: Request, res: Response) => {
  if (!stripe) return res.status(500).json({ error: "Stripe not configured" });
  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: String(process.env.STRIPE_CUSTOMER_TEST || ""),
      return_url: `${process.env.APP_URL || "http://localhost:3000"}/dashboard/billing`,
    });
    res.json({ url: portal.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create portal session" });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
