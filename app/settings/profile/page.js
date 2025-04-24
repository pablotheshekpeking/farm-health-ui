"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Building, Lock } from "lucide-react"
import { useUser } from "@/app/hooks/useUser"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { ThemeToggle } from "../../components/ThemeToggle"

export default function ProfilePage() {
  const { user, isLoading, error, updateUser, isUpdating } = useUser()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    farmName: "",
    farmId: ""
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        farmName: user.farms[0]?.name || "",
        farmId: user.farms[0]?.id || ""
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      farmName: user.farms[0]?.name || "",
      farmId: user.farms[0]?.id || ""
    })
    setIsEditing(false)
  }

  const handleSave = async () => {
    try {
      await updateUser({
        name: formData.name,
        farmId: formData.farmId,
        farmName: formData.farmName
      })
      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">Error loading profile data. Please try again later.</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and farm information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and farm information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{formData.name}</h3>
                    <p className="text-sm text-muted-foreground">{formData.email}</p>
                  </div>
                </div>
                <ThemeToggle />
              </div>

              <Separator />

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email} 
                    disabled 
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="farmName" className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Farm Name
                </Label>
                <Input
                  id="farmName"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/settings/change-password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Change Password
                  </Link>
                </Button>
                <Button onClick={handleEdit}>Edit Profile</Button>
              </div>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
