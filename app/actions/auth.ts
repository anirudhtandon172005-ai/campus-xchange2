"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// Only allow JIIT student emails
const EMAIL_REGEX = /^\d{12}@mail\.jiit\.ac\.in$/

export async function signUp(email: string, password: string) {
  // 1. Validate email
  if (!EMAIL_REGEX.test(email)) {
    return {
      error: "Email must be 12 digits followed by @mail.jiit.ac.in",
    }
  }

  const supabase = await createClient()

  // 2. Create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error("Supabase signup error:", error)
    return { error: error.message }
  }

  const user = data.user

  if (!user) {
    return { error: "User creation failed" }
  }

  // 3. Create profile row (CRITICAL for RLS)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id, // must match auth.users.id
    college: "JIIT",
  })

  if (profileError) {
    console.error("Profile insert error:", profileError)
    return { error: "Failed to create user profile" }
  }

  return { success: true }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/browse")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}
