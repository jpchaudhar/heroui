import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  subscription_tier: 'free' | 'pro' | 'firm';
  documents_used_this_month: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  category: 'business' | 'employment' | 'property' | 'litigation';
  description: string;
  template_content: string;
  fields: TemplateField[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // for select fields
}

export interface Document {
  id: string;
  user_id: string;
  template_id: string;
  title: string;
  content: string;
  field_values: Record<string, any>;
  status: 'draft' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan_type: 'free' | 'pro' | 'firm';
  status: 'active' | 'canceled' | 'past_due';
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
}