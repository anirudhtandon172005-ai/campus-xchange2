import { createBrowserClient } from "@supabase/ssr"

// DEPRECATED: Use supabase from @/lib/supabaseClient instead
// This file exists for backwards compatibility only
export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
