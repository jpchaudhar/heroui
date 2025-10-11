import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

// Document templates with placeholders
const documentTemplates = {
  nda: {
    name: 'Non-Disclosure Agreement (NDA)',
    template: `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on {{date}} by and between {{party1_name}}, a {{party1_type}} ("Disclosing Party"), and {{party2_name}}, a {{party2_type}} ("Receiving Party").

WHEREAS, the parties wish to explore a business relationship and may need to disclose confidential information;

NOW, THEREFORE, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" means {{confidential_info_definition}}.

2. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
- Hold all Confidential Information in strict confidence
- Not disclose Confidential Information to third parties without written consent
- Use Confidential Information solely for {{purpose}}

3. TERM
This Agreement shall remain in effect for {{duration}} from the date first written above.

4. GOVERNING LAW
This Agreement shall be governed by the laws of {{governing_law}}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{{party1_name}}                    {{party2_name}}
_________________                   _________________
Signature                          Signature

_________________                   _________________
Print Name                         Print Name

_________________                   _________________
Date                              Date`
  },
  employment: {
    name: 'Employment Offer Letter',
    template: `EMPLOYMENT OFFER LETTER

{{date}}

{{candidate_name}}
{{candidate_address}}

Dear {{candidate_name}},

We are pleased to offer you the position of {{job_title}} at {{company_name}}. We believe your skills and experience will be a valuable addition to our team.

POSITION DETAILS:
- Job Title: {{job_title}}
- Department: {{department}}
- Start Date: {{start_date}}
- Reporting Manager: {{manager_name}}

COMPENSATION:
- Annual Salary: {{salary}}
- Payment Schedule: {{payment_schedule}}

BENEFITS:
{{benefits_list}}

EMPLOYMENT TERMS:
- Employment Type: {{employment_type}}
- Work Schedule: {{work_schedule}}

This offer is contingent upon {{contingencies}}.

Please confirm your acceptance of this offer by signing and returning this letter by {{response_deadline}}.

We look forward to welcoming you to the {{company_name}} team!

Sincerely,

{{hiring_manager_name}}
{{hiring_manager_title}}
{{company_name}}

ACCEPTANCE:
I accept the terms of this employment offer.

_________________                   _________________
Signature                          Date`
  },
  lease: {
    name: 'Residential Lease Agreement',
    template: `RESIDENTIAL LEASE AGREEMENT

This Lease Agreement is entered into on {{lease_date}} between {{landlord_name}} ("Landlord") and {{tenant_name}} ("Tenant") for the rental property located at:

{{property_address}}

LEASE TERMS:
- Lease Term: {{lease_duration}}
- Start Date: {{start_date}}
- End Date: {{end_date}}
- Monthly Rent: {{monthly_rent}}
- Security Deposit: {{security_deposit}}
- Due Date: {{rent_due_date}} of each month

PROPERTY DESCRIPTION:
{{property_description}}

TENANT RESPONSIBILITIES:
- Pay rent on time
- Maintain property in good condition
{{#if additional_tenant_responsibilities}}- {{additional_tenant_responsibilities}}{{/if}}

LANDLORD RESPONSIBILITIES:
- Provide habitable living conditions
- Maintain structural integrity
{{#if additional_landlord_responsibilities}}- {{additional_landlord_responsibilities}}{{/if}}

{{#if additional_terms}}
ADDITIONAL TERMS:
{{additional_terms}}
{{/if}}

GOVERNING LAW:
This lease is governed by the laws of {{governing_state}}.

SIGNATURES:

Landlord: _________________     Date: _________
{{landlord_name}}

Tenant: _________________       Date: _________
{{tenant_name}}`
  }
};

function replacePlaceholders(template: string, values: Record<string, any>): string {
  let result = template;
  
  // Replace simple placeholders
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value || '');
  });
  
  // Handle conditional blocks (simplified)
  result = result.replace(/{{#if\s+(\w+)}}(.*?){{\/if}}/gs, (match, condition, content) => {
    return values[condition] ? content : '';
  });
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId, fieldValues } = await request.json();
    
    const template = documentTemplates[templateId as keyof typeof documentTemplates];
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // First, replace placeholders with user input
    let documentContent = replacePlaceholders(template.template, fieldValues);

    // Then enhance with AI
    const aiPrompt = `Please review and enhance the following ${template.name} document. Make it more professional, legally sound, and comprehensive while maintaining all the provided information. Ensure proper legal formatting and add any standard clauses that might be missing:

${documentContent}

Please return only the enhanced document content, properly formatted for legal use.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal document expert. Your job is to enhance legal documents to make them more professional, comprehensive, and legally sound while preserving all provided information. Format documents properly with clear sections and professional language."
        },
        {
          role: "user",
          content: aiPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const enhancedContent = completion.choices[0]?.message?.content || documentContent;

    // TODO: Save document to database
    // const savedDocument = await saveDocumentToDatabase(user.id, templateId, fieldValues, enhancedContent);

    return NextResponse.json({
      success: true,
      content: enhancedContent,
      templateName: template.name
    });

  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}