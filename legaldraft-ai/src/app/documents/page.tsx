"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentCard } from "@/components/documents/document-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Document as DocumentType } from "@/lib/types"
import { FileText, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function DocumentsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [documents, setDocuments] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router])

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/documents")
      const data = await response.json()
      if (data.documents) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (document: DocumentType) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await fetch(`/api/documents/${document.id}`, {
          method: "DELETE",
        })
        setDocuments(documents.filter(d => d.id !== document.id))
      } catch (error) {
        console.error("Error deleting document:", error)
      }
    }
  }

  const handleDownloadDocument = (document: DocumentType) => {
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

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.template?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
              <p className="text-gray-600">
                Manage and organize your legal documents.
              </p>
            </div>
            <Link href="/templates">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Document
              </Button>
            </Link>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Documents List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No documents found" : "No documents yet"}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {searchTerm 
                  ? "Try adjusting your search terms or create a new document."
                  : "Get started by creating your first legal document using our AI-powered templates."
                }
              </p>
              <Link href="/templates">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Document
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onEdit={(doc) => router.push(`/documents/${doc.id}`)}
                onDelete={handleDeleteDocument}
                onDownload={handleDownloadDocument}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}