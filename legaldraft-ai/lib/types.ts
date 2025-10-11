export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  subscription: 'free' | 'pro' | 'firm'
  subscriptionId?: string
  createdAt: string
  updatedAt: string
}

export interface DocumentTemplate {
  id: string
  name: string
  category: 'business' | 'employment' | 'property' | 'litigation'
  description: string
  template: string
  fields: TemplateField[]
  isCustom: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface TemplateField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'date' | 'number' | 'textarea' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
  defaultValue?: string
}

export interface Document {
  id: string
  userId: string
  templateId: string
  title: string
  content: string
  status: 'draft' | 'completed'
  createdAt: string
  updatedAt: string
  template?: DocumentTemplate
}

export interface Subscription {
  id: string
  userId: string
  stripeSubscriptionId: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  plan: 'free' | 'pro' | 'firm'
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
}