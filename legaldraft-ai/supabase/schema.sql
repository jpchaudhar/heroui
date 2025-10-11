-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  subscription VARCHAR(20) DEFAULT 'free' CHECK (subscription IN ('free', 'pro', 'firm')),
  subscription_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document templates table
CREATE TABLE document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('business', 'employment', 'property', 'litigation')),
  description TEXT,
  template TEXT NOT NULL,
  fields JSONB NOT NULL DEFAULT '[]',
  is_custom BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES document_templates(id),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  plan VARCHAR(20) NOT NULL CHECK (plan IN ('free', 'pro', 'firm')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_template_id ON documents(template_id);
CREATE INDEX idx_document_templates_category ON document_templates(category);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON document_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default document templates
INSERT INTO document_templates (name, category, description, template, fields) VALUES
('Non-Disclosure Agreement (NDA)', 'business', 'A confidentiality agreement between two parties', 
'This Non-Disclosure Agreement ("Agreement") is entered into on {date} between {company1} ("Disclosing Party") and {company2} ("Receiving Party").

1. CONFIDENTIAL INFORMATION
The Disclosing Party may share confidential information including but not limited to: {confidential_info}

2. OBLIGATIONS
The Receiving Party agrees to:
- Keep all confidential information strictly confidential
- Not disclose confidential information to third parties
- Use confidential information solely for {purpose}

3. TERM
This Agreement shall remain in effect for {duration} from the date of execution.

4. GOVERNING LAW
This Agreement shall be governed by the laws of {governing_law}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

{company1}: _________________ Date: _________
{company2}: _________________ Date: _________',
'[
  {"id": "date", "name": "date", "label": "Agreement Date", "type": "date", "required": true},
  {"id": "company1", "name": "company1", "label": "Disclosing Party Company", "type": "text", "required": true, "placeholder": "Enter company name"},
  {"id": "company2", "name": "company2", "label": "Receiving Party Company", "type": "text", "required": true, "placeholder": "Enter company name"},
  {"id": "confidential_info", "name": "confidential_info", "label": "Confidential Information", "type": "textarea", "required": true, "placeholder": "Describe the confidential information"},
  {"id": "purpose", "name": "purpose", "label": "Purpose", "type": "text", "required": true, "placeholder": "e.g., evaluating potential business partnership"},
  {"id": "duration", "name": "duration", "label": "Duration", "type": "text", "required": true, "placeholder": "e.g., 2 years"},
  {"id": "governing_law", "name": "governing_law", "label": "Governing Law", "type": "text", "required": true, "placeholder": "e.g., State of California"}
]'::jsonb),

('Employment Offer Letter', 'employment', 'A formal job offer letter template',
'Dear {candidate_name},

We are pleased to offer you the position of {position} at {company_name}.

POSITION DETAILS
- Position: {position}
- Department: {department}
- Start Date: {start_date}
- Salary: ${salary} per {salary_period}
- Benefits: {benefits}

REPORTING STRUCTURE
You will report to {manager_name}, {manager_title}.

TERMS AND CONDITIONS
This offer is contingent upon:
- Successful completion of background check
- Verification of employment eligibility
- Execution of our standard employment agreement

Please confirm your acceptance of this offer by {response_deadline}.

We look forward to welcoming you to our team.

Best regards,
{hr_representative}
{company_name}',
'[
  {"id": "candidate_name", "name": "candidate_name", "label": "Candidate Name", "type": "text", "required": true, "placeholder": "Full name"},
  {"id": "position", "name": "position", "label": "Position", "type": "text", "required": true, "placeholder": "Job title"},
  {"id": "company_name", "name": "company_name", "label": "Company Name", "type": "text", "required": true, "placeholder": "Your company name"},
  {"id": "department", "name": "department", "label": "Department", "type": "text", "required": true, "placeholder": "Department name"},
  {"id": "start_date", "name": "start_date", "label": "Start Date", "type": "date", "required": true},
  {"id": "salary", "name": "salary", "label": "Salary", "type": "number", "required": true, "placeholder": "Annual salary amount"},
  {"id": "salary_period", "name": "salary_period", "label": "Salary Period", "type": "select", "required": true, "options": ["year", "month", "hour"]},
  {"id": "benefits", "name": "benefits", "label": "Benefits", "type": "textarea", "required": false, "placeholder": "List benefits offered"},
  {"id": "manager_name", "name": "manager_name", "label": "Manager Name", "type": "text", "required": true, "placeholder": "Direct manager name"},
  {"id": "manager_title", "name": "manager_title", "label": "Manager Title", "type": "text", "required": true, "placeholder": "Manager job title"},
  {"id": "response_deadline", "name": "response_deadline", "label": "Response Deadline", "type": "date", "required": true},
  {"id": "hr_representative", "name": "hr_representative", "label": "HR Representative", "type": "text", "required": true, "placeholder": "HR person name"}
]'::jsonb),

('Rental Lease Agreement', 'property', 'A residential lease agreement template',
'RENTAL LEASE AGREEMENT

This Lease Agreement is made on {lease_date} between {landlord_name} ("Landlord") and {tenant_name} ("Tenant").

PROPERTY DETAILS
- Property Address: {property_address}
- Property Type: {property_type}
- Lease Term: {lease_term} months
- Start Date: {lease_start_date}
- End Date: {lease_end_date}

RENTAL TERMS
- Monthly Rent: ${monthly_rent}
- Security Deposit: ${security_deposit}
- Due Date: {rent_due_date} of each month
- Late Fee: ${late_fee} if rent is paid after {grace_period} days

UTILITIES AND MAINTENANCE
{utilities_responsibility}

RESTRICTIONS
- No pets allowed: {pets_allowed}
- Smoking allowed: {smoking_allowed}
- Maximum occupancy: {max_occupancy} persons

TERMINATION
Either party may terminate this lease with {notice_period} days written notice.

GOVERNING LAW
This lease shall be governed by the laws of {governing_state}.

LANDLORD: {landlord_name}                    TENANT: {tenant_name}
Signature: _________________                 Signature: _________________
Date: _______________                        Date: _______________',
'[
  {"id": "lease_date", "name": "lease_date", "label": "Lease Date", "type": "date", "required": true},
  {"id": "landlord_name", "name": "landlord_name", "label": "Landlord Name", "type": "text", "required": true, "placeholder": "Full name"},
  {"id": "tenant_name", "name": "tenant_name", "label": "Tenant Name", "type": "text", "required": true, "placeholder": "Full name"},
  {"id": "property_address", "name": "property_address", "label": "Property Address", "type": "textarea", "required": true, "placeholder": "Full property address"},
  {"id": "property_type", "name": "property_type", "label": "Property Type", "type": "select", "required": true, "options": ["Apartment", "House", "Condo", "Townhouse", "Other"]},
  {"id": "lease_term", "name": "lease_term", "label": "Lease Term (months)", "type": "number", "required": true, "placeholder": "12"},
  {"id": "lease_start_date", "name": "lease_start_date", "label": "Lease Start Date", "type": "date", "required": true},
  {"id": "lease_end_date", "name": "lease_end_date", "label": "Lease End Date", "type": "date", "required": true},
  {"id": "monthly_rent", "name": "monthly_rent", "label": "Monthly Rent", "type": "number", "required": true, "placeholder": "1500"},
  {"id": "security_deposit", "name": "security_deposit", "label": "Security Deposit", "type": "number", "required": true, "placeholder": "1500"},
  {"id": "rent_due_date", "name": "rent_due_date", "label": "Rent Due Date", "type": "number", "required": true, "placeholder": "1"},
  {"id": "late_fee", "name": "late_fee", "label": "Late Fee", "type": "number", "required": true, "placeholder": "50"},
  {"id": "grace_period", "name": "grace_period", "label": "Grace Period (days)", "type": "number", "required": true, "placeholder": "5"},
  {"id": "utilities_responsibility", "name": "utilities_responsibility", "label": "Utilities Responsibility", "type": "textarea", "required": true, "placeholder": "Describe which utilities are included/not included"},
  {"id": "pets_allowed", "name": "pets_allowed", "label": "Pets Allowed", "type": "select", "required": true, "options": ["Yes", "No", "With approval"]},
  {"id": "smoking_allowed", "name": "smoking_allowed", "label": "Smoking Allowed", "type": "select", "required": true, "options": ["Yes", "No"]},
  {"id": "max_occupancy", "name": "max_occupancy", "label": "Maximum Occupancy", "type": "number", "required": true, "placeholder": "2"},
  {"id": "notice_period", "name": "notice_period", "label": "Notice Period (days)", "type": "number", "required": true, "placeholder": "30"},
  {"id": "governing_state", "name": "governing_state", "label": "Governing State", "type": "text", "required": true, "placeholder": "California"}
]'::jsonb);