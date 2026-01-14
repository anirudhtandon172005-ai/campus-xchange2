"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CheckCircle2, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function SellPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [listingType, setListingType] = useState("sell")
  const [isNegotiable, setIsNegotiable] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setTimeout(() => {
        router.push("/browse")
      }, 2000)
    }, 1500)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-2xl">
            {isSubmitted ? (
              <Card className="p-12 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle2 className="h-12 w-12 text-accent" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-3">Item Listed Successfully!</h2>
                  <p className="text-lg text-muted-foreground">
                    Your item is now visible to students. Redirecting you...
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">List an Item</h1>
                  <p className="text-muted-foreground">Share what you have with your campus community</p>
                </div>

                <Card className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Item Title *</Label>
                      <Input id="title" placeholder="e.g., Calculus Textbook - 9th Edition" required />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select required>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="furniture">Furniture</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="misc">Miscellaneous</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="type">Listing Type *</Label>
                        <Select value={listingType} onValueChange={setListingType} required>
                          <SelectTrigger id="type">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sell">Sell</SelectItem>
                            <SelectItem value="borrow">Borrow</SelectItem>
                            <SelectItem value="recycle">Recycle (Free)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {listingType === "sell" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price (INR) *</Label>
                          <Input id="price" type="number" placeholder="0.00" min="0" step="0.01" required />
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="negotiable"
                            checked={isNegotiable}
                            onChange={(e) => setIsNegotiable(e.target.checked)}
                            className="h-4 w-4 rounded border-border"
                          />
                          <Label htmlFor="negotiable" className="font-normal cursor-pointer">
                            Price is negotiable
                          </Label>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the item's condition, features, and any other relevant details..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Photos *</Label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB (max 5 photos)</p>
                      </div>
                    </div>

                    <Card className="border-urgent/50 bg-urgent/5 p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-urgent shrink-0">
                          <Zap className="h-5 w-5 text-urgent-foreground" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <h3 className="font-semibold text-foreground">Mark as Urgent Sale</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Get your item seen first! Urgent listings appear at the top of search results and get a
                            special badge.
                          </p>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id="urgent"
                              checked={isUrgent}
                              onChange={(e) => setIsUrgent(e.target.checked)}
                              className="h-4 w-4 rounded border-border"
                            />
                            <Label htmlFor="urgent" className="font-normal cursor-pointer text-sm">
                              Mark as urgent (₹249 for 7 days)
                            </Label>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSubmitting}>
                        {isSubmitting ? "Publishing..." : "Publish Item"}
                      </Button>
                    </div>
                  </form>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
