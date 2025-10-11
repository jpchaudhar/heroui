'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input, TextArea, Select } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Template, TemplateField } from '@/types';
import { FiArrowLeft } from 'react-icons/fi';

export default function TemplateFormPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params?.id as string;

  const [template, setTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}`);
      if (response.ok) {
        const data = await response.json();
        setTemplate(data);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    setErrors((prev) => ({ ...prev, [fieldName]: '' }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    template?.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          fields: formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/documents/${data.documentId}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to generate document');
      }
    } catch (error) {
      console.error('Error generating document:', error);
      alert('Failed to generate document. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const renderField = (field: TemplateField) => {
    switch (field.type) {
      case 'text':
      case 'date':
      case 'number':
        return (
          <Input
            key={field.name}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={errors[field.name]}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <TextArea
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={errors[field.name]}
            required={field.required}
            rows={4}
          />
        );
      case 'select':
        return (
          <Select
            key={field.name}
            label={field.label}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            error={errors[field.name]}
            required={field.required}
            options={(field.options || []).map((opt) => ({ value: opt, label: opt }))}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          Loading template...
        </div>
      </DashboardLayout>
    );
  }

  if (!template) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Template not found</p>
          <Button onClick={() => router.push('/templates')}>
            Back to Templates
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/templates')}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Templates
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{template.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{template.description}</p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Fill in the details
            </h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {template.fields.map((field) => renderField(field))}

              <div className="pt-4">
                <Button type="submit" disabled={generating} className="w-full">
                  {generating ? 'Generating...' : 'Generate Document'}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
