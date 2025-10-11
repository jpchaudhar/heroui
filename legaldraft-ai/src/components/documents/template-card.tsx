"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileTemplate, ArrowRight } from "lucide-react"
import { DocumentTemplate } from "@/lib/types"

interface TemplateCardProps {
  template: DocumentTemplate
  onSelect?: (template: DocumentTemplate) => void
}

const categoryColors = {
  business: "bg-blue-100 text-blue-800",
  employment: "bg-green-100 text-green-800",
  property: "bg-purple-100 text-purple-800",
  litigation: "bg-red-100 text-red-800",
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FileTemplate className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="mt-1">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[template.category]}`}>
            {template.category}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {template.fields.length} fields required
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelect?.(template)}
            className="group-hover:bg-blue-50"
          >
            Use Template
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}