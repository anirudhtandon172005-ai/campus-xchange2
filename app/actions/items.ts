"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createItem(formData: FormData) {
  const supabase = await createClient()

  /* 1️⃣ AUTH CHECK */
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (!user || authError) {
    return { success: false, error: "Not authenticated" }
  }

  /* 2️⃣ EXTRACT FORM DATA */
  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const category = String(formData.get("category") || "").trim()
  const type = formData.get("type") as "sell" | "borrow" | "recycle"
  const image_url = String(formData.get("image_url") || "").trim()

  const rawPrice = formData.get("price")
  const price = type === "sell" && rawPrice !== null && rawPrice !== "" ? Number(rawPrice) : null

  const is_negotiable = formData.get("is_negotiable") === "on"
  const is_urgent = formData.get("is_urgent") === "on"

  /* 3️⃣ VALIDATION */
  if (!title || !description || !category || !type || !image_url) {
    return { success: false, error: "Missing required fields" }
  }

  if (type === "sell" && (price === null || Number.isNaN(price))) {
    return { success: false, error: "Invalid price" }
  }

  /* 4️⃣ INSERT */
  const { data, error } = await supabase
    .from("items")
    .insert({
      title,
      description,
      category,
      type,
      price,
      image_url,
      is_negotiable,
      is_urgent,
      seller_id: user.id, // ✅ UUID
    })
    .select()
    .single()

  if (error) {
    console.error("Create item error:", error)
    return { success: false, error: error.message }
  }

  // Revalidate browse page to show new item immediately
  revalidatePath("/browse")
  revalidatePath("/")

  return { success: true, item: data }
}

export async function getItems() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("items")
    .select(
      `
      *,
      profiles:seller_id (
        year,
        department
      )
    `
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching items:", error)
    return []
  }

  return data || []
}
