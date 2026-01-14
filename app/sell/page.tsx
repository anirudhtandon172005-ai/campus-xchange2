"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ProtectedRoute } from "@/components/protected-route"
import { createItem } from "@/app/actions/items"
import { Loader2, Package, DollarSign, Image as ImageIcon } from "lucide-react"

export default function SellPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)

    try {
      const result = await createItem(formData)

      if (result.success) {
        router.push("/browse")
      } else {
        setError(result.error || "Failed to create item")
      }
    } catch (err) {
      setError("An error occurred while creating the item")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Sell Your Item</h1>
              <p className="text-muted-foreground">List your item for sale, lending, or recycling</p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Item Title *
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Calculus Textbook 9th Edition"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your item in detail..."
                    required
                    disabled={isSubmitting}
                    rows={4}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <select
                      id="category"
                      name="category"
                      required
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select category</option>
                      <option value="books">Books</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="sports">Sports Equipment</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Listing Type *</Label>
                    <select
                      id="type"
                      name="type"
                      required
                      disabled={isSubmitting}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select type</option>
                      <option value="sell">Sell</option>
                      <option value="borrow">Lend/Borrow</option>
                      <option value="recycle">Recycle (Free)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price (₹) <span className="text-xs text-muted-foreground">(leave empty for borrow/recycle)</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="0"
                    min="0"
                    step="1"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_url" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image URL *
                  </Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    required
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-muted-foreground">Provide a direct link to your item's image</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_negotiable"
                      name="is_negotiable"
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_negotiable" className="cursor-pointer">
                      Price is negotiable
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_urgent"
                      name="is_urgent"
                      disabled={isSubmitting}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="is_urgent" className="cursor-pointer">
                      Urgent sale (needs to sell quickly)
                    </Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Listing Item...
                      </>
                    ) : (
                      "List Item"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/browse")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
