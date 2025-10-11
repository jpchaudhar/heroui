'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { Document } from '@/types';
import { exportToPDF } from '@/lib/export/pdf';
import { exportToDOCX } from '@/lib/export/docx';
import { format } from 'date-fns';

export default function DocumentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params?.id as string;

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${documentId}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      }
    } catch (error) {
      console.error('Error fetching document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (document) {
      exportToPDF(document.content, `${document.title}.pdf`, false);
    }
  };

  const handleDownloadDOCX = async () => {
    if (document) {
      await exportToDOCX(document.content, `${document.title}.docx`, false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          Loading document...
        </div>
      </DashboardLayout>
    );
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Document not found</p>
          <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex space-x-3">
            <Button onClick={handleDownloadPDF}>
              <FiDownload className="w-5 h-5 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={handleDownloadDOCX}>
              <FiDownload className="w-5 h-5 mr-2" />
              Download DOCX
            </Button>
          </div>
        </div>

        {/* Document Info */}
        <Card>
          <CardHeader>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {document.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Created on {format(new Date(document.created_at), 'MMMM dd, yyyy')}
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="prose dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100">
                {document.content}
              </pre>
            </div>
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
