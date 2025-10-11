"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Document as DocumentType } from "@/lib/types"
import { ArrowLeft, Download, Edit, Trash2 } from "lucide-react"

interface DocumentPageProps {
  params: {
    id: string
  }
}

export default function DocumentPage({ params }: DocumentPageProps) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [document, setDocument] = useState<DocumentType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router])

  useEffect(() => {
    if (user && params.id) {
      fetchDocument()
    }
  }, [user, params.id])

  const fetchDocument = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents/${params.id}`)
      const data = await response.json()
      if (data.document) {
        setDocument(data.document)
      }
    } catch (error) {
      console.error("Error fetching document:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!document) return
    
    // Create a blob with the document content
    const blob = new Blob([document.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${document.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDelete = async () => {
    if (!document) return
    
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await fetch(`/api/documents/${document.id}`, {
          method: "DELETE",
        })
        router.push("/documents")
      } catch (error) {
        console.error("Error deleting document:", error)
      }
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!document) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Document not found</h3>
              <p className="text-gray-600 text-center mb-6">
                The document you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button onClick={() => router.push("/documents")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Documents
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/documents")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{document.title}</h1>
              <p className="text-gray-600">
                {document.template?.name} • Created {new Date(document.createdAt).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Document Content</CardTitle>
            <CardDescription>
              This document was generated using AI based on the {document.template?.name} template.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
                {document.content}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}