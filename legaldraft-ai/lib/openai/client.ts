import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateDocument(
  templateContent: string,
  fields: Record<string, string | number | boolean>,
  documentType: string
): Promise<string> {
  try {
    // Replace placeholders in template
    let document = templateContent;
    Object.entries(fields).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const stringValue = value !== null && value !== undefined ? String(value) : '';
      document = document.replace(new RegExp(placeholder, 'g'), stringValue);
    });

    // Use AI to enhance and format the document
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a legal document expert. Your task is to review and enhance legal documents, ensuring proper formatting, professional language, and completeness. Maintain all existing content but improve readability and professionalism.`,
        },
        {
          role: 'user',
          content: `Please review and enhance this ${documentType} document. Ensure it follows proper legal formatting, has clear section headers, and uses professional legal language. Do not add new clauses or change the substance, just improve formatting and clarity:\n\n${document}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    return completion.choices[0].message.content || document;
  } catch (error) {
    console.error('Error generating document with OpenAI:', error);
    // Fallback to template with replacements if AI fails
    let document = templateContent;
    Object.entries(fields).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const stringValue = value !== null && value !== undefined ? String(value) : '';
      document = document.replace(new RegExp(placeholder, 'g'), stringValue);
    });
    return document;
  }
}
