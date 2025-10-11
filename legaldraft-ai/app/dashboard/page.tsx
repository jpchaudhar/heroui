'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { Button } from '@/components/ui/Button';
import { FiFileText, FiCalendar, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { Document } from '@/types';
import { exportToPDF } from '@/lib/export/pdf';
import { exportToDOCX } from '@/lib/export/docx';

export default function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    remaining: 3,
    tier: 'free',
  });

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        setStats(data.stats || stats);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (document: Document) => {
    const addWatermark = stats.tier === 'free';
    exportToPDF(document.content, `${document.title}.pdf`, addWatermark);
  };

  const handleDownloadDOCX = async (document: Document) => {
    if (stats.tier === 'free') {
      alert('DOCX export is only available for Pro and Firm plans. Please upgrade your subscription.');
      router.push('/billing');
      return;
    }
    const addWatermark = false;
    await exportToDOCX(document.content, `${document.title}.docx`, addWatermark);
  };

  const handleDocumentClick = (document: Document) => {
    router.push(`/dashboard/documents/${document.id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here&apos;s what&apos;s happening with your documents today.
            </p>
          </div>
          <Button onClick={() => router.push('/templates')}>
            <FiPlus className="w-5 h-5 mr-2" />
            New Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Documents"
            value={stats.total}
            icon={<FiFileText className="w-6 h-6 text-blue-600" />}
          />
          <StatsCard
            title="This Month"
            value={stats.thisMonth}
            icon={<FiCalendar className="w-6 h-6 text-blue-600" />}
          />
          <StatsCard
            title={stats.tier === 'free' ? 'Remaining' : 'Plan'}
            value={stats.tier === 'free' ? stats.remaining : stats.tier.toUpperCase()}
            icon={<FiTrendingUp className="w-6 h-6 text-blue-600" />}
          />
        </div>

        {/* Recent Documents */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Documents</h2>
          {loading ? (
            <div className="text-center py-12 text-gray-600 dark:text-gray-400">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No documents yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get started by creating your first legal document
              </p>
              <Button onClick={() => router.push('/templates')}>
                <FiPlus className="w-5 h-5 mr-2" />
                Create Document
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDownloadPDF={handleDownloadPDF}
                  onDownloadDOCX={handleDownloadDOCX}
                  onClick={handleDocumentClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
