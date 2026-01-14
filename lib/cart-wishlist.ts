"use client"

import type { Item } from "@/components/item-card"

// Cart functions
export function getCartItems(): Item[] {
  if (typeof window === "undefined") return []
  const items = localStorage.getItem("campusxchange_cart")
  return items ? JSON.parse(items) : []
}

export function addToCart(item: Item): void {
  const cart = getCartItems()
  // Check if item already exists
  if (!cart.find((i) => i.id === item.id)) {
    cart.push(item)
    localStorage.setItem("campusxchange_cart", JSON.stringify(cart))
  }
}

export function removeFromCart(itemId: string): void {
  const cart = getCartItems().filter((item) => item.id !== itemId)
  localStorage.setItem("campusxchange_cart", JSON.stringify(cart))
}

export function isInCart(itemId: string): boolean {
  return getCartItems().some((item) => item.id === itemId)
}

export function clearCart(): void {
  localStorage.setItem("campusxchange_cart", JSON.stringify([]))
}

// Wishlist functions
export function getWishlistItems(): Item[] {
  if (typeof window === "undefined") return []
  const items = localStorage.getItem("campusxchange_wishlist")
  return items ? JSON.parse(items) : []
}

export function addToWishlist(item: Item): void {
  const wishlist = getWishlistItems()
  // Check if item already exists
  if (!wishlist.find((i) => i.id === item.id)) {
    wishlist.push(item)
    localStorage.setItem("campusxchange_wishlist", JSON.stringify(wishlist))
  }
}

export function removeFromWishlist(itemId: string): void {
  const wishlist = getWishlistItems().filter((item) => item.id !== itemId)
  localStorage.setItem("campusxchange_wishlist", JSON.stringify(wishlist))
}

export function isInWishlist(itemId: string): boolean {
  return getWishlistItems().some((item) => item.id === itemId)
}
