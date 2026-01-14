"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { ItemCard, type Item } from "@/components/item-card"
import { Filters, type FilterState } from "@/components/filters"
import { SearchBar } from "@/components/search-bar"
import { ContactRequestModal } from "@/components/contact-request-modal"
import { PackageX } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

// Mock data for demo
const mockItems: Item[] = [
  {
    id: "1",
    title: "Calculus Textbook - 9th Edition",
    price: 3735,
    type: "sell",
    category: "books",
    image: "/calculus-textbook.png",
    sellerId: "mock-seller-1",
    seller: { year: "Junior", department: "Engineering" },
    negotiable: true,
  },
  {
    id: "2",
    title: "MacBook Pro 2021 - Excellent Condition",
    price: 74617,
    type: "sell",
    category: "electronics",
    image: "/macbook-pro-laptop.png",
    sellerId: "mock-seller-2",
    seller: { year: "Senior", department: "Computer Science" },
    isUrgent: true,
  },
  {
    id: "3",
    title: "Mini Fridge - Perfect for Dorm",
    price: 6225,
    type: "sell",
    category: "furniture",
    image: "/mini-fridge.jpg",
    sellerId: "mock-seller-3",
    seller: { year: "Sophomore", department: "Business" },
    negotiable: true,
    isUrgent: true,
  },
  {
    id: "4",
    title: "Scientific Calculator (TI-84)",
    type: "borrow",
    category: "electronics",
    image: "/ti-84-calculator.jpg",
    sellerId: "mock-seller-4",
    seller: { year: "Junior", department: "Mathematics" },
  },
  {
    id: "5",
    title: "Vintage Desk Lamp",
    type: "recycle",
    category: "furniture",
    image: "/modern-desk-lamp.png",
    sellerId: "mock-seller-5",
    seller: { year: "Senior", department: "Art & Design" },
  },
  {
    id: "6",
    title: "Winter Jacket - North Face",
    price: 4980,
    type: "sell",
    category: "clothing",
    image: "/winter-jacket.png",
    sellerId: "mock-seller-6",
    seller: { year: "Freshman", department: "Biology" },
    negotiable: true,
  },
  {
    id: "7",
    title: "Office Chair with Wheels",
    price: 3320,
    type: "sell",
    category: "furniture",
    image: "/ergonomic-office-chair.png",
    sellerId: "mock-seller-7",
    seller: { year: "Junior", department: "Economics" },
  },
  {
    id: "8",
    title: "iPhone 13 Pro - 256GB",
    price: 53950,
    type: "sell",
    category: "electronics",
    image: "/iphone-13-pro.png",
    sellerId: "mock-seller-8",
    seller: { year: "Sophomore", department: "Marketing" },
    isUrgent: true,
  },
]

export default function BrowsePage() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    type: "all",
    minPrice: "",
    maxPrice: "",
    urgentOnly: false,
  })

  const filteredItems = useMemo(() => {
    let result = mockItems

    if (filters.category !== "all") {
      result = result.filter((item) => item.category === filters.category)
    }

    if (filters.type !== "all") {
      result = result.filter((item) => item.type === filters.type)
    }

    if (filters.minPrice) {
      const minPrice = Number.parseFloat(filters.minPrice)
      result = result.filter((item) => item.price !== undefined && item.price >= minPrice)
    }

    if (filters.maxPrice) {
      const maxPrice = Number.parseFloat(filters.maxPrice)
      result = result.filter((item) => item.price !== undefined && item.price <= maxPrice)
    }

    if (filters.urgentOnly) {
      result = result.filter((item) => item.isUrgent === true)
    }

    if (searchQuery.trim()) {
      result = result.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return result
  }, [searchQuery, filters])

  const handleItemClick = (item: Item) => {
    setSelectedItem(item)
    setShowContactModal(true)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Browse Items</h1>
            <p className="text-muted-foreground">Find what you need from fellow students on campus</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <Filters onFilterChange={setFilters} />
            </aside>

            <main>
              <SearchBar value={searchQuery} onChange={setSearchQuery} resultCount={filteredItems.length} />

              {filteredItems.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => (
                    <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <PackageX className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No items found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery.trim()
                      ? "Try a different search term or adjust your filters"
                      : "Try adjusting your filters or check back later"}
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
        {selectedItem && (
          <ContactRequestModal
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
            itemTitle={selectedItem.title}
            itemId={selectedItem.id}
            sellerId={selectedItem.sellerId}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
