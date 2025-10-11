-- Users table (synced with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'firm')),
  documents_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Business', 'Employment', 'Property', 'Litigation')),
  description TEXT NOT NULL,
  base_template TEXT NOT NULL,
  fields JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES templates(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'firm')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table (for firm plan)
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(firm_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_template_id ON documents(template_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_team_members_firm_id ON team_members(firm_id);

-- Insert default templates
INSERT INTO templates (name, category, description, base_template, fields) VALUES
(
  'Non-Disclosure Agreement (NDA)',
  'Business',
  'A mutual NDA to protect confidential information between two parties',
  'MUTUAL NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement ("Agreement") is entered into as of {{date}} by and between:\n\nParty A: {{party_a_name}}, located at {{party_a_address}}\nParty B: {{party_b_name}}, located at {{party_b_address}}\n\n1. PURPOSE\nThe parties wish to explore a business opportunity of mutual interest and in connection with this opportunity, may disclose certain confidential technical and business information.\n\n2. CONFIDENTIAL INFORMATION\n"Confidential Information" means any information disclosed by either party that is marked as confidential or would reasonably be considered confidential.\n\n3. OBLIGATIONS\nEach party agrees to:\n(a) Hold all Confidential Information in strict confidence\n(b) Not disclose Confidential Information to third parties\n(c) Use Confidential Information only for the purpose stated above\n\n4. TERM\nThis Agreement shall commence on {{date}} and continue for {{duration}} years.\n\n5. RETURN OF MATERIALS\nUpon termination, each party shall return all Confidential Information to the disclosing party.\n\n{{additional_clauses}}\n\nIN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.\n\nParty A: _________________\n{{party_a_name}}\n\nParty B: _________________\n{{party_b_name}}',
  '[
    {"name": "date", "label": "Agreement Date", "type": "date", "required": true},
    {"name": "party_a_name", "label": "Party A Name", "type": "text", "required": true},
    {"name": "party_a_address", "label": "Party A Address", "type": "textarea", "required": true},
    {"name": "party_b_name", "label": "Party B Name", "type": "text", "required": true},
    {"name": "party_b_address", "label": "Party B Address", "type": "textarea", "required": true},
    {"name": "duration", "label": "Agreement Duration (years)", "type": "number", "required": true},
    {"name": "additional_clauses", "label": "Additional Clauses (optional)", "type": "textarea", "required": false}
  ]'::jsonb
),
(
  'Employment Offer Letter',
  'Employment',
  'A formal offer letter for new employees',
  'EMPLOYMENT OFFER LETTER\n\nDate: {{date}}\n\nDear {{candidate_name}},\n\nWe are pleased to offer you the position of {{job_title}} at {{company_name}}. We believe your skills and experience will be a valuable asset to our team.\n\nPOSITION DETAILS:\nTitle: {{job_title}}\nDepartment: {{department}}\nReporting To: {{supervisor_name}}\nStart Date: {{start_date}}\n\nCOMPENSATION:\nAnnual Salary: ${{salary}}\nPayment Frequency: {{payment_frequency}}\n\nBENEFITS:\n{{benefits}}\n\nWORK SCHEDULE:\n{{work_schedule}}\n\nThis offer is contingent upon successful completion of a background check and verification of your eligibility to work.\n\nTo accept this offer, please sign and return this letter by {{response_deadline}}.\n\nWe look forward to welcoming you to our team!\n\nSincerely,\n\n{{hiring_manager_name}}\n{{hiring_manager_title}}\n{{company_name}}\n\nACCEPTANCE:\nI accept the terms of this offer.\n\nSignature: _________________\nName: {{candidate_name}}\nDate: _________________',
  '[
    {"name": "date", "label": "Letter Date", "type": "date", "required": true},
    {"name": "candidate_name", "label": "Candidate Name", "type": "text", "required": true},
    {"name": "job_title", "label": "Job Title", "type": "text", "required": true},
    {"name": "company_name", "label": "Company Name", "type": "text", "required": true},
    {"name": "department", "label": "Department", "type": "text", "required": true},
    {"name": "supervisor_name", "label": "Supervisor Name", "type": "text", "required": true},
    {"name": "start_date", "label": "Start Date", "type": "date", "required": true},
    {"name": "salary", "label": "Annual Salary", "type": "number", "required": true},
    {"name": "payment_frequency", "label": "Payment Frequency", "type": "select", "required": true, "options": ["Bi-weekly", "Semi-monthly", "Monthly"]},
    {"name": "benefits", "label": "Benefits Description", "type": "textarea", "required": true},
    {"name": "work_schedule", "label": "Work Schedule", "type": "textarea", "required": true},
    {"name": "response_deadline", "label": "Response Deadline", "type": "date", "required": true},
    {"name": "hiring_manager_name", "label": "Hiring Manager Name", "type": "text", "required": true},
    {"name": "hiring_manager_title", "label": "Hiring Manager Title", "type": "text", "required": true}
  ]'::jsonb
),
(
  'Residential Lease Agreement',
  'Property',
  'A comprehensive lease agreement for residential property',
  'RESIDENTIAL LEASE AGREEMENT\n\nThis Lease Agreement ("Lease") is entered into as of {{date}} by and between:\n\nLANDLORD: {{landlord_name}}\nAddress: {{landlord_address}}\n\nTENANT: {{tenant_name}}\nAddress: {{tenant_current_address}}\n\n1. PROPERTY\nLandlord leases to Tenant the property located at:\n{{property_address}}\n("Premises")\n\n2. TERM\nThe lease term shall begin on {{start_date}} and end on {{end_date}}.\n\n3. RENT\nMonthly Rent: ${{monthly_rent}}\nDue Date: {{rent_due_date}} of each month\nPayment Method: {{payment_method}}\n\n4. SECURITY DEPOSIT\nTenant shall pay a security deposit of ${{security_deposit}}, to be held by Landlord as security for Tenant\'s faithful performance.\n\n5. UTILITIES\nTenant shall be responsible for: {{tenant_utilities}}\nLandlord shall be responsible for: {{landlord_utilities}}\n\n6. USE OF PREMISES\nThe Premises shall be used for residential purposes only.\n\n7. PETS\n{{pet_policy}}\n\n8. MAINTENANCE AND REPAIRS\nLandlord shall maintain the Premises in habitable condition. Tenant shall maintain the Premises in clean and sanitary condition.\n\n9. TERMINATION\nEither party may terminate this Lease with {{notice_period}} days written notice.\n\n{{additional_terms}}\n\nLANDLORD SIGNATURE:\n_________________\n{{landlord_name}}\nDate: _________________\n\nTENANT SIGNATURE:\n_________________\n{{tenant_name}}\nDate: _________________',
  '[
    {"name": "date", "label": "Agreement Date", "type": "date", "required": true},
    {"name": "landlord_name", "label": "Landlord Name", "type": "text", "required": true},
    {"name": "landlord_address", "label": "Landlord Address", "type": "textarea", "required": true},
    {"name": "tenant_name", "label": "Tenant Name", "type": "text", "required": true},
    {"name": "tenant_current_address", "label": "Tenant Current Address", "type": "textarea", "required": true},
    {"name": "property_address", "label": "Property Address", "type": "textarea", "required": true},
    {"name": "start_date", "label": "Lease Start Date", "type": "date", "required": true},
    {"name": "end_date", "label": "Lease End Date", "type": "date", "required": true},
    {"name": "monthly_rent", "label": "Monthly Rent Amount", "type": "number", "required": true},
    {"name": "rent_due_date", "label": "Rent Due Date (day of month)", "type": "number", "required": true},
    {"name": "payment_method", "label": "Payment Method", "type": "text", "required": true},
    {"name": "security_deposit", "label": "Security Deposit Amount", "type": "number", "required": true},
    {"name": "tenant_utilities", "label": "Utilities Paid by Tenant", "type": "textarea", "required": true},
    {"name": "landlord_utilities", "label": "Utilities Paid by Landlord", "type": "textarea", "required": true},
    {"name": "pet_policy", "label": "Pet Policy", "type": "textarea", "required": true},
    {"name": "notice_period", "label": "Termination Notice Period (days)", "type": "number", "required": true},
    {"name": "additional_terms", "label": "Additional Terms (optional)", "type": "textarea", "required": false}
  ]'::jsonb
),
(
  'Service Agreement',
  'Business',
  'A service agreement between service provider and client',
  'SERVICE AGREEMENT\n\nThis Service Agreement ("Agreement") is entered into as of {{date}} by and between:\n\nSERVICE PROVIDER: {{provider_name}}\nAddress: {{provider_address}}\n\nCLIENT: {{client_name}}\nAddress: {{client_address}}\n\n1. SERVICES\nService Provider agrees to provide the following services:\n{{services_description}}\n\n2. TERM\nThis Agreement shall commence on {{start_date}} and continue until {{end_date}}, unless terminated earlier.\n\n3. COMPENSATION\nClient agrees to pay Service Provider:\nRate: ${{rate}} per {{rate_period}}\nTotal Project Fee: ${{total_fee}}\nPayment Terms: {{payment_terms}}\n\n4. EXPENSES\n{{expense_policy}}\n\n5. INTELLECTUAL PROPERTY\n{{ip_ownership}}\n\n6. CONFIDENTIALITY\nBoth parties agree to maintain confidentiality of proprietary information.\n\n7. TERMINATION\nEither party may terminate this Agreement with {{termination_notice}} days written notice.\n\n8. INDEPENDENT CONTRACTOR\nService Provider is an independent contractor and not an employee of Client.\n\n{{additional_clauses}}\n\nSERVICE PROVIDER:\n_________________\n{{provider_name}}\nDate: _________________\n\nCLIENT:\n_________________\n{{client_name}}\nDate: _________________',
  '[
    {"name": "date", "label": "Agreement Date", "type": "date", "required": true},
    {"name": "provider_name", "label": "Service Provider Name", "type": "text", "required": true},
    {"name": "provider_address", "label": "Provider Address", "type": "textarea", "required": true},
    {"name": "client_name", "label": "Client Name", "type": "text", "required": true},
    {"name": "client_address", "label": "Client Address", "type": "textarea", "required": true},
    {"name": "services_description", "label": "Services Description", "type": "textarea", "required": true},
    {"name": "start_date", "label": "Start Date", "type": "date", "required": true},
    {"name": "end_date", "label": "End Date", "type": "date", "required": true},
    {"name": "rate", "label": "Rate Amount", "type": "number", "required": true},
    {"name": "rate_period", "label": "Rate Period", "type": "select", "required": true, "options": ["hour", "day", "week", "month", "project"]},
    {"name": "total_fee", "label": "Total Project Fee", "type": "number", "required": true},
    {"name": "payment_terms", "label": "Payment Terms", "type": "textarea", "required": true},
    {"name": "expense_policy", "label": "Expense Policy", "type": "textarea", "required": true},
    {"name": "ip_ownership", "label": "IP Ownership Terms", "type": "textarea", "required": true},
    {"name": "termination_notice", "label": "Termination Notice (days)", "type": "number", "required": true},
    {"name": "additional_clauses", "label": "Additional Clauses (optional)", "type": "textarea", "required": false}
  ]'::jsonb
)
ON CONFLICT DO NOTHING;
