"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Document, Download, Edit, Trash2 } from "lucide-react"
import { Document as DocumentType } from "@/lib/types"

interface DocumentCardProps {
  document: DocumentType
  onEdit?: (document: DocumentType) => void
  onDelete?: (document: DocumentType) => void
  onDownload?: (document: DocumentType) => void
}

export function DocumentCard({ document, onEdit, onDelete, onDownload }: DocumentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Document className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{document.title}</CardTitle>
              <CardDescription>
                {document.template?.name} • {new Date(document.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <span className={`px-2 py-1 text-xs rounded-full ${
              document.status === 'completed' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {document.status}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Last updated: {new Date(document.updatedAt).toLocaleDateString()}
          </div>
          
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(document)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDownload(document)}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(document)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}