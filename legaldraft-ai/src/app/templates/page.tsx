"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter, useSearchParams } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TemplateCard } from "@/components/documents/template-card"
import { DocumentForm } from "@/components/documents/document-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DocumentTemplate } from "@/lib/types"
import { ArrowLeft, Search } from "lucide-react"

export default function TemplatesPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [templates, setTemplates] = useState<DocumentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null)
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router])

  useEffect(() => {
    if (user) {
      fetchTemplates()
    }
  }, [user, category])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const url = category === "all" ? "/api/templates" : `/api/templates?category=${category}`
      const response = await fetch(url)
      const data = await response.json()
      if (data.templates) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template)
  }

  const handleCancelForm = () => {
    setSelectedTemplate(null)
  }

  const handleSubmitForm = async (formData: Record<string, string>) => {
    if (!selectedTemplate) return

    try {
      setIsGenerating(true)
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: selectedTemplate.id,
          title: `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
          formData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/documents/${data.document.id}`)
      } else {
        console.error("Error creating document")
      }
    } catch (error) {
      console.error("Error creating document:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (selectedTemplate) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleCancelForm}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Create Document</h1>
            <p className="text-gray-600">Fill in the information below to generate your legal document.</p>
          </div>
          <DocumentForm
            template={selectedTemplate}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            isLoading={isGenerating}
          />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Templates</h1>
          <p className="text-gray-600">
            Choose from our library of professional legal document templates.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <label htmlFor="category" className="text-sm font-medium text-gray-700">
              Filter by category:
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="employment">Employment</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="litigation">Litigation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : templates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 text-center">
                No templates match your selected category. Try selecting a different category.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleSelectTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}