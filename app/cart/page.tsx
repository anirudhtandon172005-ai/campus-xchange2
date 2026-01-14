"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import type { Item } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { getCartItems, removeFromCart } from "@/lib/cart-wishlist"
import { ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Item[]>([])
  const router = useRouter()

  useEffect(() => {
    setCartItems(getCartItems())

    const handleUpdate = () => {
      setCartItems(getCartItems())
    }

    window.addEventListener("cartUpdated", handleUpdate)
    window.addEventListener("storage", handleUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleUpdate)
      window.removeEventListener("storage", handleUpdate)
    }
  }, [])

  const handleRemove = (itemId: string) => {
    removeFromCart(itemId)
    setCartItems(getCartItems())
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0)

  const handleProceedToCheckout = () => {
    router.push("/cart/checkout")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {cartItems.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-card rounded-2xl border-2 border-border">
                    <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.seller.year} • {item.seller.department}
                      </p>
                      <p className="text-lg font-bold text-primary">₹{item.price}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemove(item.id)}
                      className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="lg:sticky lg:top-24 h-fit">
                <div className="bg-card rounded-2xl border-2 border-border p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                  <div className="space-y-2 py-4 border-y border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span className="font-medium text-foreground">{cartItems.length}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">₹{totalPrice}</span>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleProceedToCheckout}>
                    Proceed to Contact Sellers
                  </Button>

                  <Link href="/browse">
                    <Button variant="outline" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <ShoppingCart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add items from the browse page to get started</p>
              <Button asChild>
                <Link href="/browse">Browse Items</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
