export type DocumentCategory = "Business" | "Employment" | "Property" | "Litigation";

export type DocumentType = "NDA" | "Lease" | "Offer Letter";

export interface Template {
  id: string;
  title: string;
  slug: string;
  category: DocumentCategory;
  description?: string;
  placeholders: string[];
  templateText: string;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = "free" | "pro" | "firm";
