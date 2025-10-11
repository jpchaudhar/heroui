'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Mock templates data - in real app, this would come from your database
const templates = {
  nda: {
    id: 'nda',
    name: 'Non-Disclosure Agreement (NDA)',
    category: 'business',
    description: 'Standard mutual non-disclosure agreement for business discussions',
    fields: [
      { name: 'date', type: 'date', label: 'Agreement Date', required: true },
      { name: 'party1_name', type: 'text', label: 'First Party Name', required: true },
      { name: 'party1_type', type: 'select', label: 'First Party Type', required: true, options: ['corporation', 'LLC', 'individual', 'partnership'] },
      { name: 'party2_name', type: 'text', label: 'Second Party Name', required: true },
      { name: 'party2_type', type: 'select', label: 'Second Party Type', required: true, options: ['corporation', 'LLC', 'individual', 'partnership'] },
      { name: 'confidential_info_definition', type: 'textarea', label: 'Definition of Confidential Information', required: true, placeholder: 'Define what constitutes confidential information...' },
      { name: 'purpose', type: 'textarea', label: 'Purpose of Disclosure', required: true, placeholder: 'Describe the purpose for sharing confidential information...' },
      { name: 'duration', type: 'select', label: 'Agreement Duration', required: true, options: ['1 year', '2 years', '3 years', '5 years', 'indefinitely'] },
      { name: 'governing_law', type: 'text', label: 'Governing Law (State/Country)', required: true, placeholder: 'e.g., State of California' }
    ]
  },
  employment: {
    id: 'employment',
    name: 'Employment Offer Letter',
    category: 'employment',
    description: 'Standard job offer letter template',
    fields: [
      { name: 'date', type: 'date', label: 'Offer Date', required: true },
      { name: 'candidate_name', type: 'text', label: 'Candidate Name', required: true },
      { name: 'candidate_address', type: 'textarea', label: 'Candidate Address', required: true },
      { name: 'job_title', type: 'text', label: 'Job Title', required: true },
      { name: 'company_name', type: 'text', label: 'Company Name', required: true },
      { name: 'department', type: 'text', label: 'Department', required: true },
      { name: 'start_date', type: 'date', label: 'Start Date', required: true },
      { name: 'manager_name', type: 'text', label: 'Reporting Manager', required: true },
      { name: 'salary', type: 'text', label: 'Annual Salary', required: true, placeholder: '$75,000' },
      { name: 'payment_schedule', type: 'select', label: 'Payment Schedule', required: true, options: ['Bi-weekly', 'Monthly', 'Semi-monthly'] },
      { name: 'benefits_list', type: 'textarea', label: 'Benefits Package', required: true, placeholder: 'List all benefits...' },
      { name: 'employment_type', type: 'select', label: 'Employment Type', required: true, options: ['Full-time', 'Part-time', 'Contract', 'Temporary'] },
      { name: 'work_schedule', type: 'text', label: 'Work Schedule', required: true, placeholder: 'Monday-Friday, 9 AM - 5 PM' },
      { name: 'contingencies', type: 'textarea', label: 'Offer Contingencies', required: true, placeholder: 'background check, reference verification, etc.' },
      { name: 'response_deadline', type: 'date', label: 'Response Deadline', required: true },
      { name: 'hiring_manager_name', type: 'text', label: 'Hiring Manager Name', required: true },
      { name: 'hiring_manager_title', type: 'text', label: 'Hiring Manager Title', required: true }
    ]
  },
  lease: {
    id: 'lease',
    name: 'Residential Lease Agreement',
    category: 'property',
    description: 'Standard residential lease agreement template',
    fields: [
      { name: 'lease_date', type: 'date', label: 'Lease Agreement Date', required: true },
      { name: 'landlord_name', type: 'text', label: 'Landlord Name', required: true },
      { name: 'tenant_name', type: 'text', label: 'Tenant Name', required: true },
      { name: 'property_address', type: 'textarea', label: 'Property Address', required: true },
      { name: 'lease_duration', type: 'select', label: 'Lease Duration', required: true, options: ['6 months', '1 year', '2 years', 'Month-to-month'] },
      { name: 'start_date', type: 'date', label: 'Lease Start Date', required: true },
      { name: 'end_date', type: 'date', label: 'Lease End Date', required: true },
      { name: 'monthly_rent', type: 'text', label: 'Monthly Rent Amount', required: true, placeholder: '$2,500' },
      { name: 'security_deposit', type: 'text', label: 'Security Deposit', required: true, placeholder: '$2,500' },
      { name: 'rent_due_date', type: 'select', label: 'Rent Due Date', required: true, options: ['1st', '5th', '15th', 'Last day'] },
      { name: 'property_description', type: 'textarea', label: 'Property Description', required: true, placeholder: 'Describe the property, number of bedrooms, bathrooms, etc.' },
      { name: 'additional_tenant_responsibilities', type: 'textarea', label: 'Additional Tenant Responsibilities', required: false },
      { name: 'additional_landlord_responsibilities', type: 'textarea', label: 'Additional Landlord Responsibilities', required: false },
      { name: 'additional_terms', type: 'textarea', label: 'Additional Terms and Conditions', required: false },
      { name: 'governing_state', type: 'text', label: 'Governing State/Province', required: true, placeholder: 'California' }
    ]
  }
};

export default function GenerateDocumentPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get('template') || 'nda';
  const [selectedTemplate, setSelectedTemplate] = useState(templateId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  
  const template = templates[selectedTemplate as keyof typeof templates];
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data: any) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: selectedTemplate,
          fieldValues: data,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setGeneratedDocument(result.content);
      } else {
        console.error('Failed to generate document');
      }
    } catch (error) {
      console.error('Error generating document:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadDocument = async (format: 'pdf' | 'docx') => {
    if (!generatedDocument) return;

    try {
      const response = await fetch(`/api/export/${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generatedDocument,
          title: template.name,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${template.name}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error(`Failed to download ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error(`Error downloading ${format.toUpperCase()}:`, error);
    }
  };

  const renderField = (field: any) => {
    const fieldProps = {
      ...register(field.name, { required: field.required }),
      className: "mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...fieldProps}
            rows={3}
          />
        );
      case 'select':
        return (
          <select {...fieldProps}>
            <option value="">Select an option</option>
            {field.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'date':
        return (
          <input
            {...fieldProps}
            type="date"
          />
        );
      default:
        return (
          <input
            {...fieldProps}
            type="text"
          />
        );
    }
  };

  if (generatedDocument) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setGeneratedDocument(null)}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to form
          </button>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
              <div className="flex space-x-2">
                <button 
                  onClick={() => downloadDocument('pdf')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Download PDF
                </button>
                <button 
                  onClick={() => downloadDocument('docx')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Download DOCX
                </button>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <div className="bg-gray-50 p-6 rounded-lg border">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {generatedDocument}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Generate Document</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill out the form below to generate your legal document with AI
            </p>
          </div>

          {/* Template Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {Object.values(templates).map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">{template.description}</p>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {template.fields.map((field) => (
                <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {renderField(field)}
                  {errors[field.name] && (
                    <p className="mt-1 text-sm text-red-600">This field is required</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}