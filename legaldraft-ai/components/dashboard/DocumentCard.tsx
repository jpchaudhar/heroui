import React from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FiDownload, FiFileText, FiCalendar } from 'react-icons/fi';
import { Document } from '@/types';
import { format } from 'date-fns';

interface DocumentCardProps {
  document: Document;
  onDownloadPDF: (document: Document) => void;
  onDownloadDOCX: (document: Document) => void;
  onClick: (document: Document) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onDownloadPDF,
  onDownloadDOCX,
  onClick,
}) => {
  return (
    <Card className="hover:border-blue-400 border-2 border-transparent">
      <CardBody>
        <div className="flex items-start justify-between">
          <div className="flex-1 cursor-pointer" onClick={() => onClick(document)}>
            <div className="flex items-center space-x-2 mb-2">
              <FiFileText className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{document.title}</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-4 h-4" />
              <span>{format(new Date(document.created_at), 'MMM dd, yyyy')}</span>
            </div>
            <div className="mt-2">
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  document.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                }`}
              >
                {document.status}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-2 ml-4">
            <Button size="sm" onClick={() => onDownloadPDF(document)}>
              <FiDownload className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDownloadDOCX(document)}>
              <FiDownload className="w-4 h-4 mr-1" />
              DOCX
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
