"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Zap, Shield, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard")
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">LegalDraft AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Generate Legal Documents
            <span className="text-blue-600"> with AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create professional legal documents in minutes, not hours. Perfect for law firms, 
            startups, and individuals who need reliable legal documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4">
              View Templates
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Generate professional legal documents in under 60 seconds using advanced AI technology.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Legally Sound</CardTitle>
              <CardDescription>
                All documents are based on proven legal templates and reviewed by legal professionals.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share documents with your team, manage permissions, and collaborate in real-time.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Pricing */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for individuals</CardDescription>
                <div className="text-3xl font-bold">$0<span className="text-lg font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>3 documents per month</li>
                  <li>Basic templates</li>
                  <li>PDF export</li>
                  <li>Email support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-500 ring-2 ring-blue-500">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For growing businesses</CardDescription>
                <div className="text-3xl font-bold">$29<span className="text-lg font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Unlimited documents</li>
                  <li>All templates</li>
                  <li>PDF & DOCX export</li>
                  <li>No watermarks</li>
                  <li>Priority support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Firm</CardTitle>
                <CardDescription>For law firms</CardDescription>
                <div className="text-3xl font-bold">$99<span className="text-lg font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Everything in Pro</li>
                  <li>5 team members</li>
                  <li>Custom templates</li>
                  <li>Advanced analytics</li>
                  <li>Dedicated support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p>&copy; 2024 LegalDraft AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}