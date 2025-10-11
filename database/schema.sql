-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Clerk user data)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'firm')),
  documents_used_this_month INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document templates table
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('business', 'employment', 'property', 'litigation')),
  description TEXT,
  template_content TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES document_templates(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT,
  field_values JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'firm')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table (for firm plans)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  member_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_owner_id, member_user_id)
);

-- Indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_template_id ON documents(template_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_team_members_owner ON team_members(team_owner_id);

-- Insert default document templates
INSERT INTO document_templates (name, category, description, template_content, fields) VALUES
(
  'Non-Disclosure Agreement (NDA)',
  'business',
  'Standard mutual non-disclosure agreement for business discussions',
  'NON-DISCLOSURE AGREEMENT

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
Date                              Date',
  '[
    {"name": "date", "type": "date", "label": "Agreement Date", "required": true},
    {"name": "party1_name", "type": "text", "label": "First Party Name", "required": true},
    {"name": "party1_type", "type": "select", "label": "First Party Type", "required": true, "options": ["corporation", "LLC", "individual", "partnership"]},
    {"name": "party2_name", "type": "text", "label": "Second Party Name", "required": true},
    {"name": "party2_type", "type": "select", "label": "Second Party Type", "required": true, "options": ["corporation", "LLC", "individual", "partnership"]},
    {"name": "confidential_info_definition", "type": "textarea", "label": "Definition of Confidential Information", "required": true, "placeholder": "Define what constitutes confidential information..."},
    {"name": "purpose", "type": "textarea", "label": "Purpose of Disclosure", "required": true, "placeholder": "Describe the purpose for sharing confidential information..."},
    {"name": "duration", "type": "select", "label": "Agreement Duration", "required": true, "options": ["1 year", "2 years", "3 years", "5 years", "indefinitely"]},
    {"name": "governing_law", "type": "text", "label": "Governing Law (State/Country)", "required": true, "placeholder": "e.g., State of California"}
  ]'
),
(
  'Employment Offer Letter',
  'employment',
  'Standard job offer letter template',
  'EMPLOYMENT OFFER LETTER

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
{{#if bonus_eligible}}- Bonus Eligible: {{bonus_details}}{{/if}}

BENEFITS:
{{benefits_list}}

EMPLOYMENT TERMS:
- Employment Type: {{employment_type}}
- Work Schedule: {{work_schedule}}
{{#if probation_period}}- Probationary Period: {{probation_period}}{{/if}}

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
Signature                          Date',
  '[
    {"name": "date", "type": "date", "label": "Offer Date", "required": true},
    {"name": "candidate_name", "type": "text", "label": "Candidate Name", "required": true},
    {"name": "candidate_address", "type": "textarea", "label": "Candidate Address", "required": true},
    {"name": "job_title", "type": "text", "label": "Job Title", "required": true},
    {"name": "company_name", "type": "text", "label": "Company Name", "required": true},
    {"name": "department", "type": "text", "label": "Department", "required": true},
    {"name": "start_date", "type": "date", "label": "Start Date", "required": true},
    {"name": "manager_name", "type": "text", "label": "Reporting Manager", "required": true},
    {"name": "salary", "type": "text", "label": "Annual Salary", "required": true, "placeholder": "$75,000"},
    {"name": "payment_schedule", "type": "select", "label": "Payment Schedule", "required": true, "options": ["Bi-weekly", "Monthly", "Semi-monthly"]},
    {"name": "benefits_list", "type": "textarea", "label": "Benefits Package", "required": true, "placeholder": "List all benefits..."},
    {"name": "employment_type", "type": "select", "label": "Employment Type", "required": true, "options": ["Full-time", "Part-time", "Contract", "Temporary"]},
    {"name": "work_schedule", "type": "text", "label": "Work Schedule", "required": true, "placeholder": "Monday-Friday, 9 AM - 5 PM"},
    {"name": "contingencies", "type": "textarea", "label": "Offer Contingencies", "required": true, "placeholder": "background check, reference verification, etc."},
    {"name": "response_deadline", "type": "date", "label": "Response Deadline", "required": true},
    {"name": "hiring_manager_name", "type": "text", "label": "Hiring Manager Name", "required": true},
    {"name": "hiring_manager_title", "type": "text", "label": "Hiring Manager Title", "required": true}
  ]'
),
(
  'Residential Lease Agreement',
  'property',
  'Standard residential lease agreement template',
  'RESIDENTIAL LEASE AGREEMENT

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
- {{additional_tenant_responsibilities}}

LANDLORD RESPONSIBILITIES:
- Provide habitable living conditions
- Maintain structural integrity
- {{additional_landlord_responsibilities}}

ADDITIONAL TERMS:
{{additional_terms}}

GOVERNING LAW:
This lease is governed by the laws of {{governing_state}}.

SIGNATURES:

Landlord: _________________     Date: _________
{{landlord_name}}

Tenant: _________________       Date: _________
{{tenant_name}}',
  '[
    {"name": "lease_date", "type": "date", "label": "Lease Agreement Date", "required": true},
    {"name": "landlord_name", "type": "text", "label": "Landlord Name", "required": true},
    {"name": "tenant_name", "type": "text", "label": "Tenant Name", "required": true},
    {"name": "property_address", "type": "textarea", "label": "Property Address", "required": true},
    {"name": "lease_duration", "type": "select", "label": "Lease Duration", "required": true, "options": ["6 months", "1 year", "2 years", "Month-to-month"]},
    {"name": "start_date", "type": "date", "label": "Lease Start Date", "required": true},
    {"name": "end_date", "type": "date", "label": "Lease End Date", "required": true},
    {"name": "monthly_rent", "type": "text", "label": "Monthly Rent Amount", "required": true, "placeholder": "$2,500"},
    {"name": "security_deposit", "type": "text", "label": "Security Deposit", "required": true, "placeholder": "$2,500"},
    {"name": "rent_due_date", "type": "select", "label": "Rent Due Date", "required": true, "options": ["1st", "5th", "15th", "Last day"]},
    {"name": "property_description", "type": "textarea", "label": "Property Description", "required": true, "placeholder": "Describe the property, number of bedrooms, bathrooms, etc."},
    {"name": "additional_tenant_responsibilities", "type": "textarea", "label": "Additional Tenant Responsibilities", "required": false},
    {"name": "additional_landlord_responsibilities", "type": "textarea", "label": "Additional Landlord Responsibilities", "required": false},
    {"name": "additional_terms", "type": "textarea", "label": "Additional Terms and Conditions", "required": false},
    {"name": "governing_state", "type": "text", "label": "Governing State/Province", "required": true, "placeholder": "California"}
  ]'
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();