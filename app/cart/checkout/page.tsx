"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCartItems, clearCart } from "@/lib/cart-wishlist"
import type { Item } from "@/components/item-card"
import { CheckCircle2, User, Mail, Phone, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { saveContactRequest, getCurrentUserId } from "@/lib/requests"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<Item[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const items = getCartItems()
    if (items.length === 0) {
      router.push("/cart")
    }
    setCartItems(items)

    // Load user data from localStorage
    const userData = localStorage.getItem("campusxchange_user")
    if (userData) {
      const user = JSON.parse(userData)
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert("Please fill in all required fields (Name, Email, and Phone Number)")
      return
    }

    if (formData.email === "null" || formData.email.toLowerCase() === "null") {
      alert("Please enter a valid email address")
      return
    }

    setSubmitted(true)

    const userId = getCurrentUserId()
    cartItems.forEach((item) => {
      saveContactRequest({
        itemId: item.id,
        itemTitle: item.title,
        itemPrice: item.price,
        itemImage: item.image,
        sellerId: item.seller.id || "seller-1",
        sellerName: item.seller.name || "Unknown Seller",
        buyerId: userId,
        buyerName: formData.name,
        buyerEmail: formData.email,
        buyerPhone: formData.phone,
        message: formData.message || `Hi! I'm interested in "${item.title}". Is it still available?`,
      })
    })

    // Clear cart after submission
    setTimeout(() => {
      clearCart()
      window.dispatchEvent(new Event("cartUpdated"))
    }, 2000)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

  // Get unique sellers
  const sellers = Array.from(new Set(cartItems.map((item) => item.seller.name)))

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation isVerified={true} />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Contact Request Sent!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your contact request has been sent to {sellers.length} {sellers.length === 1 ? "seller" : "sellers"}. They
              will reach out to you soon via your provided email and phone number.
            </p>
            <div className="space-y-4">
              <Button size="lg" onClick={() => router.push("/browse")} className="w-full sm:w-auto">
                Continue Shopping
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/profile")}
                className="w-full sm:w-auto ml-0 sm:ml-4"
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isVerified={true} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Contact Sellers</h1>
            <p className="text-muted-foreground">Provide your contact details to reach out to the sellers</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground mb-4">Your Contact Information</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="h-12"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4" />
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Add any additional message for the sellers..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Contact Request
              </Button>
            </form>

            <div className="space-y-6">
              <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.seller.name}</p>
                        <p className="text-sm font-bold text-primary">₹{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Items</span>
                    <span className="font-medium text-foreground">{cartItems.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sellers</span>
                    <span className="font-medium text-foreground">{sellers.length}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">₹{totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
