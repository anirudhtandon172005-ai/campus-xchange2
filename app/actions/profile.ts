"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Fetch profile data
  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    return {
      email: user.email,
      name: "",
      year: "",
      department: "",
      college: "JIIT",
    }
  }

  return {
    email: user.email,
    name: profile.name || "",
    year: profile.year || "",
    department: profile.department || "",
    college: profile.college || "JIIT",
  }
}

export async function updateProfile(formData: { name: string; year: string; department: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "Not authenticated" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      name: formData.name,
      year: formData.year,
      department: formData.department,
    })
    .eq("id", user.id)

  if (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function getUserItems() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

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
    .eq("seller_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user items:", error)
    return []
  }

  return data || []
}
