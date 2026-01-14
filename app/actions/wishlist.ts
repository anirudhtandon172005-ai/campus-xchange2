"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addToWishlist(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const { error } = await supabase.from("wishlists").insert({
    user_id: user.id,
    item_id: itemId,
  })

  if (error) {
    // If it's a duplicate violation, we can arguably consider it a success (it's in the wishlist)
    if (error.code === "23505") {
      // Unique violation
      return { success: true }
    }
    console.error("Error adding to wishlist:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/wishlist")
  return { success: true }
}

export async function removeFromWishlist(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const { error } = await supabase.from("wishlists").delete().match({ user_id: user.id, item_id: itemId })

  if (error) {
    console.error("Error removing from wishlist:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/wishlist")
  return { success: true }
}

export async function getWishlist() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("wishlists")
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
    console.error("Error fetching wishlist:", error)
    return []
  }

  // Transform data to flat structure if needed, or return as is.
  // The join returns items nested. We can clean this up in the UI or here.
  // For now, let's return it as is, but we might need to map it in the component.
  return data
}

export async function checkWishlistStatus(itemId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from("wishlists")
    .select("item_id")
    .eq("user_id", user.id)
    .eq("item_id", itemId)
    .single()

  if (error || !data) {
    return false
  }

  return true
}
