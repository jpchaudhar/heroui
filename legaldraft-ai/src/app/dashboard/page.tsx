"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DocumentCard } from "@/components/documents/document-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Document, FileText, Plus, TrendingUp } from "lucide-react"
import { Document as DocumentType } from "@/lib/types"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [documents, setDocuments] = useState<DocumentType[]>([])
  const [loading, setLoading] = useState(true)

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your legal documents.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(d => d.status === "completed").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {documents.length > 0 
                  ? Math.round((documents.filter(d => d.status === "completed").length / documents.length) * 100)
                  : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents.filter(d => {
                  const docDate = new Date(d.createdAt)
                  const now = new Date()
                  return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear()
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Documents created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Available templates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Documents</h2>
            <Link href="/templates">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Document
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                <p className="text-gray-600 text-center mb-6">
                  Get started by creating your first legal document using our AI-powered templates.
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
              {documents.slice(0, 6).map((document) => (
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

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/templates?category=business">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Business Documents
                </Button>
              </Link>
              <Link href="/templates?category=employment">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Employment Contracts
                </Button>
              </Link>
              <Link href="/templates?category=property">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Property Documents
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}