// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  subscription_tier: 'free' | 'pro' | 'firm';
  documents_count: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  content: string;
  status: 'draft' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  category: 'Business' | 'Employment' | 'Property' | 'Litigation';
  description: string;
  base_template: string;
  fields: TemplateField[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: 'free' | 'pro' | 'firm';
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  firm_id: string;
  user_id: string;
  role: 'admin' | 'member';
  created_at: string;
}

// Form Types
export interface DocumentGenerationRequest {
  templateId: string;
  fields: Record<string, any>;
}

export interface DocumentGenerationResponse {
  content: string;
  documentId: string;
}

// UI Types
export interface DashboardStats {
  totalDocuments: number;
  documentsThisMonth: number;
  remainingDocuments: number | null; // null for unlimited
  subscriptionTier: string;
}

export interface SubscriptionPlan {
  name: string;
  price: number;
  features: string[];
  stripePriceId: string;
  documentLimit: number | null; // null for unlimited
}
