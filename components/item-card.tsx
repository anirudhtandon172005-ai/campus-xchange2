"use client"

import type React from "react"
import Image from "next/image"
import { Clock, MessageCircle, Heart, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { addToWishlist, removeFromWishlist, checkWishlistStatus } from "@/app/actions/wishlist"
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  checkCartStatus,
} from "@/app/actions/cart"

/**
 * UUID v4 regex (Supabase compatible)
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export interface Item {
  id: string
  title: string
  price?: number
  type: "sell" | "borrow" | "recycle"
  category: string
  image: string
  seller_id: string
  seller?: {
    id?: string
    name?: string
    year?: string
    department?: string
  }
  isUrgent?: boolean
  negotiable?: boolean
}

interface ItemCardProps {
  item: Item
  onClick?: () => void
  showActions?: boolean
}

export function ItemCard({ item, onClick, showActions = true }: ItemCardProps) {
  const [inCart, setInCart] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)
  const [loadingWishlist, setLoadingWishlist] = useState(false)
  const [loadingCart, setLoadingCart] = useState(false)

  const isValidUUID = UUID_REGEX.test(item.id)

  useEffect(() => {
    if (!isValidUUID) {
      console.warn("Skipping wishlist/cart check, invalid UUID:", item.id)
      return
    }

    const checkStatus = async () => {
      try {
        const [wishlistStatus, cartStatus] = await Promise.all([checkWishlistStatus(item.id), checkCartStatus(item.id)])
        setInWishlist(wishlistStatus)
        setInCart(cartStatus)
      } catch (err) {
        console.error("Status check failed:", err)
      }
    }

    checkStatus()
  }, [item.id, isValidUUID])

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isValidUUID) {
      console.error("Cannot add to cart - invalid UUID:", item.id)
      return
    }

    setLoadingCart(true)

    const previousState = inCart
    setInCart(!previousState) // optimistic update

    try {
      const result = previousState ? await removeFromCartAction(item.id) : await addToCartAction(item.id)

      if (!result?.success) {
        setInCart(previousState)
        console.error(result?.error || "Cart operation failed")
      }
    } catch (error) {
      setInCart(previousState)
      console.error("Cart error:", error)
    } finally {
      setLoadingCart(false)
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isValidUUID) {
      console.error("Cannot wishlist item with invalid UUID:", item.id)
      return
    }

    setLoadingWishlist(true)

    const previousState = inWishlist
    setInWishlist(!previousState) // optimistic update

    try {
      const result = previousState ? await removeFromWishlist(item.id) : await addToWishlist(item.id)

      if (!result?.success) {
        setInWishlist(previousState)
        console.error(result?.error || "Wishlist operation failed")
      }
    } catch (error) {
      setInWishlist(previousState)
      console.error("Wishlist error:", error)
    } finally {
      setLoadingWishlist(false)
    }
  }

  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${
        item.isUrgent ? "border-urgent bg-urgent/5" : "border-border hover:border-primary/50"
      }`}
      onClick={onClick}
    >
      {item.isUrgent && (
        <Badge className="absolute left-3 top-3 z-10 gap-1.5 bg-urgent text-urgent-foreground shadow-lg">
          <Clock className="h-3 w-3" />
          Urgent Sale
        </Badge>
      )}

      {showActions && (
        <div className="absolute right-3 top-3 z-10 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            disabled={loadingWishlist || !isValidUUID}
            className={`h-8 w-8 rounded-full shadow-lg transition-colors ${
              inWishlist ? "bg-accent text-accent-foreground" : "bg-card/80 backdrop-blur-sm"
            }`}
            onClick={handleAddToWishlist}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
          </Button>

          {item.type === "sell" && (
            <Button
              size="icon"
              variant="secondary"
              disabled={loadingCart || !isValidUUID}
              className={`h-8 w-8 rounded-full shadow-lg transition-colors ${
                inCart ? "bg-primary text-primary-foreground" : "bg-card/80 backdrop-blur-sm"
              }`}
              onClick={handleAddToCart}
            >
              <ShoppingCart className={`h-4 w-4 ${inCart ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-2">{item.title}</h3>
          {item.type === "borrow" ? (
            <Badge variant="secondary" className="bg-accent/10 text-accent">
              Borrow
            </Badge>
          ) : item.type === "recycle" ? (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              Free
            </Badge>
          ) : null}
        </div>

        {item.price !== undefined && item.type === "sell" && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-primary">₹{item.price}</span>
            {item.negotiable && <span className="text-xs text-muted-foreground">(negotiable)</span>}
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">{item.seller?.year || "Student"}</span>
            {" • "}
            <span>{item.seller?.department || "Campus"}</span>
          </div>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  )
}
