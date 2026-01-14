"use client"

import type React from "react"

import Image from "next/image"
import { Clock, MessageCircle, Heart, ShoppingCart } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  addToCart,
  addToWishlist,
  isInCart,
  isInWishlist,
  removeFromCart,
  removeFromWishlist,
} from "@/lib/cart-wishlist"

export interface Item {
  id: string
  title: string
  price?: number
  type: "sell" | "borrow" | "recycle"
  category: string
  image: string
  sellerId: string // UUID from Supabase
  seller: {
    year: string
    department: string
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

  useEffect(() => {
    setInCart(isInCart(item.id))
    setInWishlist(isInWishlist(item.id))
  }, [item.id])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inCart) {
      removeFromCart(item.id)
      setInCart(false)
    } else {
      addToCart(item)
      setInCart(true)
    }
    window.dispatchEvent(new Event("cartUpdated"))
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inWishlist) {
      removeFromWishlist(item.id)
      setInWishlist(false)
    } else {
      addToWishlist(item)
      setInWishlist(true)
    }
    window.dispatchEvent(new Event("wishlistUpdated"))
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
            <Badge variant="secondary" className="shrink-0 bg-accent/10 text-accent">
              Borrow
            </Badge>
          ) : item.type === "recycle" ? (
            <Badge variant="secondary" className="shrink-0 bg-accent text-accent-foreground">
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
            <span className="font-medium">{item.seller.year}</span>
            {" • "}
            <span>{item.seller.department}</span>
          </div>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </Card>
  )
}
