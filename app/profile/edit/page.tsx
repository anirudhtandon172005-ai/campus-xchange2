"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Mail, School, GraduationCap } from "lucide-react"

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@university.edu",
    year: "Junior",
    department: "Computer Science",
  })
  const [customYear, setCustomYear] = useState("")
  const [showCustomYear, setShowCustomYear] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Save to localStorage or state management
    localStorage.setItem("userData", JSON.stringify(formData))
    router.push("/profile")
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    if (value === "other") {
      setShowCustomYear(true)
      setFormData({ ...formData, year: customYear || "" })
    } else {
      setShowCustomYear(false)
      setFormData({ ...formData, year: value })
    }
  }

  const handleCustomYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomYear(value)
    setFormData({ ...formData, year: value })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isVerified={true} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => router.push("/profile")} className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Button>

          <Card className="p-6">
            <h1 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@university.edu"
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed for security reasons</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Year
                </Label>
                <select
                  id="year"
                  value={showCustomYear ? "other" : formData.year}
                  onChange={handleYearChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="other">Other</option>
                </select>
                {showCustomYear && (
                  <Input
                    type="number"
                    value={customYear}
                    onChange={handleCustomYearChange}
                    placeholder="Enter year number"
                    min="1"
                    className="mt-2"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  Department
                </Label>
                <Input
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g., Computer Science, Business, etc."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
