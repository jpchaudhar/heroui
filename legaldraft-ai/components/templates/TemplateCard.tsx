import React from 'react';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Template } from '@/types';
import { FiFileText } from 'react-icons/fi';

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, onSelect }) => {
  const categoryColors: Record<string, string> = {
    Business: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    Employment: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    Property: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    Litigation: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  };

  return (
    <Card className="h-full flex flex-col">
      <CardBody className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <FiFileText className="w-8 h-8 text-blue-600" />
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              categoryColors[template.category]
            }`}
          >
            {template.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {template.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
      </CardBody>
      <CardFooter>
        <Button className="w-full" onClick={() => onSelect(template)}>
          Use Template
        </Button>
      </CardFooter>
    </Card>
  );
};
