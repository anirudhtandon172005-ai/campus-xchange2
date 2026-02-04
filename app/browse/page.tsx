"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type Item = {
  id: string
  title: string
  description: string
  price: number
  image_url: string | null
  created_at: string
}

export default function BrowsePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)

    const { data, error } = await supabase.from("items").select("*").order("created_at", { ascending: false })

    console.log("ITEMS FROM SUPABASE:", data)
    console.log("ERROR:", error)

    if (error) {
      setError(error.message)
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  if (loading) {
    return <p className="p-6">Loading items...</p>
  }

  if (error) {
    return <p className="p-6 text-red-500">Error: {error}</p>
  }

  if (items.length === 0) {
    return <p className="p-6">No items found.</p>
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="border rounded-lg p-4 shadow-sm">
          {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-40 object-cover rounded" />}

          <h2 className="mt-2 font-semibold">{item.title}</h2>
          <p className="text-sm text-gray-600">{item.description}</p>
          <p className="mt-1 font-bold">₹{item.price}</p>
        </div>
      ))}
    </div>
  )
}
