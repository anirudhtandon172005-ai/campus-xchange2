"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addToCart(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const { error } = await supabase.from("carts").insert({
    user_id: user.id,
    item_id: itemId,
  })

  if (error) {
    // If it's a duplicate violation, consider it a success (already in cart)
    if (error.code === "23505") {
      return { success: true }
    }
    console.error("Error adding to cart:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/cart")
  return { success: true }
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const { error } = await supabase.from("carts").delete().match({ user_id: user.id, item_id: itemId })

  if (error) {
    console.error("Error removing from cart:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/cart")
  return { success: true }
}

export async function getCartItems() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("carts")
    .select(
      `
      item_id,
      items (
        *,
        profiles:seller_id (
          year,
          department
        )
      )
    `
    )
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching cart:", error)
    return []
  }

  return data || []
}

export async function checkCartStatus(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from("carts")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .single()

  if (error || !data) {
    return false
  }

  return true
}

export async function clearCart() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const { error } = await supabase.from("carts").delete().eq("user_id", user.id)

  if (error) {
    console.error("Error clearing cart:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/cart")
  return { success: true }
}
