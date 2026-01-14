"use client"

import Link from "next/link"
import { ShoppingBag, Plus, Recycle, User, CheckCircle2, Heart, ShoppingCart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { getCartItems, getWishlistItems } from "@/lib/cart-wishlist"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const { user, signOut } = useAuth()

  useEffect(() => {
    // Initial load
    setCartCount(getCartItems().length)
    setWishlistCount(getWishlistItems().length)

    // Listen for storage changes
    const handleStorage = () => {
      setCartCount(getCartItems().length)
      setWishlistCount(getWishlistItems().length)
    }

    window.addEventListener("storage", handleStorage)
    // Custom event for same-tab updates
    window.addEventListener("cartUpdated", handleStorage)
    window.addEventListener("wishlistUpdated", handleStorage)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("cartUpdated", handleStorage)
      window.removeEventListener("wishlistUpdated", handleStorage)
    }
  }, [])

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <ShoppingBag className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">CampusXchange</span>
        </Link>

        {user ? (
          <>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/browse" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Browse
              </Link>
              <Link href="/sell" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Sell Item
              </Link>
              <Link
                href="/recycle"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Recycle
              </Link>
              <Link
                href="/profile"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Profile
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild className="relative">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>

              <Badge variant="outline" className="gap-1.5 border-verified bg-verified/10 text-verified hidden md:flex">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </Badge>

              <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
          </div>
        )}
      </div>

      {user && (
        <div className="flex items-center justify-around border-t border-border bg-card py-2 md:hidden">
          <Link href="/browse" className="flex flex-col items-center gap-1 px-3 py-1">
            <ShoppingBag className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Browse</span>
          </Link>
          <Link href="/sell" className="flex flex-col items-center gap-1 px-3 py-1">
            <Plus className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Sell</span>
          </Link>
          <Link href="/recycle" className="flex flex-col items-center gap-1 px-3 py-1">
            <Recycle className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Recycle</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 px-3 py-1">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Profile</span>
          </Link>
        </div>
      )}
    </nav>
  )
}
