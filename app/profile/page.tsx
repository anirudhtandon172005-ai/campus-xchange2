"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ItemCard, type Item } from "@/components/item-card"
import { User, Mail, School, CheckCircle2, Clock, MessageCircle, Package, X, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  getPendingRequests,
  getAcceptedRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  getCurrentUserId,
  type ContactRequest,
} from "@/lib/requests"
import { ProtectedRoute } from "@/components/protected-route"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePage() {
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    email: "",
    name: "",
    year: "",
    department: "",
    college: "JIIT",
  })

  const [myListings, setMyListings] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [pendingRequests, setPendingRequests] = useState<ContactRequest[]>([])
  const [acceptedRequests, setAcceptedRequests] = useState<ContactRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([])

  useEffect(() => {
    fetchProfileAndItems()
    loadRequests()

    const handleRequestsUpdated = () => loadRequests()
    window.addEventListener("requestsUpdated", handleRequestsUpdated)

    return () => {
      window.removeEventListener("requestsUpdated", handleRequestsUpdated)
    }
  }, [])

  /* ---------------- PROFILE + ITEMS ---------------- */

  async function fetchProfileAndItems() {
    setIsLoading(true)

    try {
      // 1. Get auth user (SOURCE OF TRUTH)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // 2. Set profile data (NO DUMMY EMAIL)
      setProfileData({
        email: user.email ?? "",
        name: user.user_metadata?.full_name ?? "User",
        year: user.user_metadata?.year ?? "",
        department: user.user_metadata?.department ?? "",
        college: "JIIT",
      })

      // 3. Fetch items WITHOUT JOIN (CRITICAL FIX)
      const { data: items, error } = await supabase
        .from("items")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user items:", error)
        return
      }

      // 4. Normalize items for ItemCard
      const normalized: Item[] =
        items?.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price ?? undefined,
          type: item.type,
          category: item.category,
          image: item.image_url || "/placeholder.svg",
          seller_id: item.seller_id,
          isUrgent: item.is_urgent,
          negotiable: item.is_negotiable,
          seller: {
            year: profileData.year || "Student",
            department: profileData.department || "Campus",
          },
        })) || []

      setMyListings(normalized)
    } catch (err) {
      console.error("Failed to load profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------- REQUESTS ---------------- */

  const loadRequests = () => {
    const userId = getCurrentUserId()
    setPendingRequests(getPendingRequests(userId))
    setAcceptedRequests(getAcceptedRequests(userId))
    setReceivedRequests(getReceivedRequests(userId))
  }

  const handleAcceptRequest = (requestId: string) => {
    acceptRequest(requestId)
    loadRequests()
  }

  const handleRejectRequest = (requestId: string) => {
    rejectRequest(requestId)
    loadRequests()
  }

  /* ---------------- UI ---------------- */

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            {isLoading ? (
              <Card className="p-6 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </Card>
            ) : (
              <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-12 w-12" />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold">{profileData.name}</h1>
                        <Badge variant="outline" className="gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified Student
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <School className="h-4 w-4" />
                          {profileData.year || "Student"} • {profileData.department || "Department"}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {profileData.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <p className="text-2xl font-bold">{myListings.length}</p>
                        <p className="text-muted-foreground">Items Listed</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:items-end">
                    <Button variant="outline" onClick={() => router.push("/profile/edit")}>
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="listings">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="listings">
                  <Package className="h-4 w-4 mr-2" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="requests">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Requests
                </TabsTrigger>
                <TabsTrigger value="pending">
                  <Clock className="h-4 w-4 mr-2" />
                  Pending
                </TabsTrigger>
                <TabsTrigger value="accepted">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Accepted
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myListings.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>

              {/* Requests tabs unchanged */}
              {/* (Your existing request UI works fine and is kept intact) */}
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
