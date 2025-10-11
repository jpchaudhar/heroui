"use client"

import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [notifications, setNotifications] = useState({
    email: true,
    documentUpdates: true,
    billing: true,
    marketing: false
  })

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/")
    }
  }, [isLoaded, user, router])

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue={user.firstName || ""}
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue={user.lastName || ""}
                    disabled
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  defaultValue={user.emailAddresses[0]?.emailAddress || ""}
                  disabled
                />
              </div>
              <p className="text-sm text-gray-600">
                To update your profile information, please use the account settings in the top-right menu.
              </p>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified about updates and changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="document-updates">Document Updates</Label>
                  <p className="text-sm text-gray-600">Get notified when documents are processed</p>
                </div>
                <Switch
                  id="document-updates"
                  checked={notifications.documentUpdates}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, documentUpdates: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="billing-notifications">Billing Notifications</Label>
                  <p className="text-sm text-gray-600">Receive billing and payment notifications</p>
                </div>
                <Switch
                  id="billing-notifications"
                  checked={notifications.billing}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, billing: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-notifications">Marketing Emails</Label>
                  <p className="text-sm text-gray-600">Receive product updates and promotional content</p>
                </div>
                <Switch
                  id="marketing-notifications"
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security and privacy settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-gray-600">Last updated: Recently</p>
                </div>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline" size="sm">
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-red-600">Delete Account</Label>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}