"use client"

import { Navigation } from "@/components/navigation"
import { ItemCard, type Item } from "@/components/item-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, TrendingDown, Users, PackageX } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

// Mock recycle items
const recycleItems: Item[] = [
  {
    id: "1",
    title: "Vintage Desk Lamp",
    type: "recycle",
    category: "furniture",
    image: "/modern-desk-lamp.png",
    seller: { year: "Senior", department: "Art & Design" },
  },
  {
    id: "2",
    title: "Old Textbooks - Various Subjects",
    type: "recycle",
    category: "books",
    image: "/stack-of-textbooks.png",
    seller: { year: "Junior", department: "Literature" },
  },
  {
    id: "3",
    title: "Plastic Storage Bins (Set of 3)",
    type: "recycle",
    category: "misc",
    image: "/storage-bins.jpg",
    seller: { year: "Sophomore", department: "Business" },
  },
  {
    id: "4",
    title: "Gently Used Backpack",
    type: "recycle",
    category: "misc",
    image: "/colorful-backpack-on-wooden-table.png",
    seller: { year: "Senior", department: "Engineering" },
  },
]

export default function RecyclePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8 text-center max-w-2xl mx-auto space-y-4">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-accent/10">
                <Leaf className="h-8 w-8 text-accent" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Recycle & Reuse</h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-balance">
              Give your unused items a second life. Help fellow students and reduce campus waste.
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid gap-6 sm:grid-cols-3 mb-12 max-w-4xl mx-auto">
            <Card className="p-6 text-center space-y-2 border-2">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <TrendingDown className="h-6 w-6 text-accent" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">2.5T</p>
              <p className="text-sm text-muted-foreground">Waste Reduced (lbs)</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-2">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <PackageX className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">1,247</p>
              <p className="text-sm text-muted-foreground">Items Recycled</p>
            </Card>

            <Card className="p-6 text-center space-y-2 border-2">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-verified/10">
                  <Users className="h-6 w-6 text-verified" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">850</p>
              <p className="text-sm text-muted-foreground">Students Helped</p>
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="border-2 border-accent/20 bg-accent/5 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Have items you don't need?</h3>
                <p className="text-sm text-muted-foreground">
                  List them for free recycling instead of throwing them away
                </p>
              </div>
              <Button asChild className="shrink-0">
                <Link href="/sell">List for Free</Link>
              </Button>
            </div>
          </Card>

          {/* Available Items */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Available for Free</h2>
              <p className="text-sm text-muted-foreground">{recycleItems.length} items available</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recycleItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
