"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ItemCard, type Item } from "@/components/item-card"
import { Button } from "@/components/ui/button"
import { getWishlist } from "@/app/actions/wishlist"
import { ContactRequestModal } from "@/components/contact-request-modal"
import { Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist()

        // Map Supabase response to Item interface
        // The join returns: { item_id, items: { ...itemData, profiles: { ...sellerData } } }
        const mappedItems = data.map((entry: any) => {
          const itemData = entry.items
          return {
            ...itemData,
            id: itemData.id, // Explicit mapping if needed
            seller_id: itemData.seller_id,
            sellerId: itemData.seller_id, // Compatibility
            seller: {
              year: itemData.profiles?.year || "Unknown",
              department: itemData.profiles?.department || "Unknown",
            },
            // Fallback for imageURL/image field naming if database differs from mock
            image: itemData.image || itemData.image_url || "/placeholder.svg",
          }
        }) as Item[]

        setWishlistItems(mappedItems)
      } catch (error) {
        console.error("Failed to fetch wishlist:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [])

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
            <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => (
                <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <Heart className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">Save items you like to keep track of them</p>
              <Button asChild>
                <Link href="/browse">Browse Items</Link>
              </Button>
            </div>
          )}
        </div>

        {selectedItem && (
          <ContactRequestModal
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)}
            itemTitle={selectedItem.title}
            itemId={selectedItem.id}
            itemPrice={selectedItem.price}
            itemImage={selectedItem.image}
            sellerId={selectedItem.seller_id}
            sellerName={selectedItem.seller?.department || "Seller"} // Use department as proxy name or fix safely
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
