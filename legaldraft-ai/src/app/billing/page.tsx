"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for individuals",
    features: [
      "3 documents per month",
      "Basic templates",
      "PDF export",
      "Email support"
    ],
    limitations: [
      "Limited templates",
      "Watermarked documents"
    ],
    current: true
  },
  {
    name: "Pro",
    price: 29,
    description: "For growing businesses",
    features: [
      "Unlimited documents",
      "All templates",
      "PDF & DOCX export",
      "No watermarks",
      "Priority support"
    ],
    limitations: [],
    current: false
  },
  {
    name: "Firm",
    price: 99,
    description: "For law firms",
    features: [
      "Everything in Pro",
      "5 team members",
      "Custom templates",
      "Advanced analytics",
      "Dedicated support"
    ],
    limitations: [],
    current: false
  }
]

export default function BillingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router])

  const handleUpgrade = async (planName: string) => {
    setLoading(true)
    try {
      // In a real app, you would create a Stripe checkout session here
      console.log(`Upgrading to ${planName} plan`)
      // For now, just show an alert
      alert(`Upgrade to ${planName} plan - Stripe integration needed`)
    } catch (error) {
      console.error("Error upgrading plan:", error)
    } finally {
      setLoading(false)
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
          <p className="text-gray-600">
            Manage your subscription and billing information.
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>
              You are currently on the Free plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Free Plan</h3>
                <p className="text-gray-600">3 documents per month</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$0<span className="text-lg font-normal">/month</span></p>
                <p className="text-sm text-gray-600">Documents used: 0/3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.current ? "ring-2 ring-blue-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    {plan.current && (
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Current
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="text-3xl font-bold">
                    ${plan.price}<span className="text-lg font-normal">/month</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <li key={limitation} className="flex items-center">
                        <X className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {!plan.current && (
                    <Button
                      className="w-full"
                      onClick={() => handleUpgrade(plan.name)}
                      disabled={loading}
                    >
                      {loading ? "Processing..." : `Upgrade to ${plan.name}`}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>
              Your billing details and payment history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payment Method</span>
                <span className="text-sm text-gray-600">No payment method on file</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Next Billing Date</span>
                <span className="text-sm text-gray-600">N/A (Free plan)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Billing Address</span>
                <span className="text-sm text-gray-600">Not provided</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}