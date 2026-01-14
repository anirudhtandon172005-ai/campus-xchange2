"use client"

import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ItemCard, type Item } from "@/components/item-card"
import { User, Mail, School, CheckCircle2, Clock, MessageCircle, Package, X, Check } from "lucide-react"
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

// Mock user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@university.edu",
  year: "Junior",
  department: "Computer Science",
  verified: true,
  memberSince: "September 2024",
  stats: {
    listed: 12,
    sold: 8,
    bought: 15,
  },
}

const myListings: Item[] = [
  {
    id: "1",
    title: "MacBook Pro 2021",
    price: 899,
    type: "sell",
    category: "electronics",
    image: "/macbook-pro-on-desk.png",
    seller: { year: "Junior", department: "Computer Science" },
    isUrgent: true,
  },
  {
    id: "2",
    title: "Desk Lamp",
    type: "recycle",
    category: "furniture",
    image: "/modern-desk-lamp.png",
    seller: { year: "Junior", department: "Computer Science" },
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(userData)
  const [pendingRequests, setPendingRequests] = useState<ContactRequest[]>([])
  const [acceptedRequests, setAcceptedRequests] = useState<ContactRequest[]>([])
  const [receivedRequests, setReceivedRequests] = useState<ContactRequest[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("userProfile")
    if (stored) {
      const profile = JSON.parse(stored)
      setUser({
        ...userData,
        name: profile.name || userData.name,
        year: profile.year || userData.year,
        department: profile.department || userData.department,
      })
    }

    loadRequests()

    const handleRequestsUpdated = () => {
      loadRequests()
    }
    window.addEventListener("requestsUpdated", handleRequestsUpdated)

    return () => {
      window.removeEventListener("requestsUpdated", handleRequestsUpdated)
    }
  }, [])

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-12 w-12" />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                      {user.verified && (
                        <Badge variant="outline" className="gap-1.5 border-verified bg-verified/10 text-verified">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Verified Student
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <School className="h-4 w-4" />
                        {user.year} • {user.department}
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm">
                    <div>
                      <p className="text-2xl font-bold text-foreground">{user.stats.listed}</p>
                      <p className="text-muted-foreground">Items Listed</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{user.stats.sold}</p>
                      <p className="text-muted-foreground">Items Sold</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{user.stats.bought}</p>
                      <p className="text-muted-foreground">Items Bought</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 md:items-end">
                  <Button variant="outline" onClick={() => router.push("/profile/edit")}>
                    Edit Profile
                  </Button>
                  <p className="text-xs text-muted-foreground">Member since {user.memberSince}</p>
                </div>
              </div>
            </Card>

            {/* Activity Tabs */}
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="listings" className="gap-2">
                  <Package className="h-4 w-4" />
                  My Listings
                </TabsTrigger>
                <TabsTrigger value="requests" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Requests
                  {receivedRequests.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                      {receivedRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Pending
                  {pendingRequests.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                      {pendingRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="accepted" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Accepted
                  {acceptedRequests.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1.5">
                      {acceptedRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {myListings.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="requests" className="mt-6">
                {receivedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {receivedRequests.map((request) => (
                      <Card key={request.id} className="p-6">
                        <div className="flex gap-4">
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                              src={request.itemImage || "/placeholder.svg"}
                              alt={request.itemTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{request.itemTitle}</h3>
                              <p className="text-sm text-muted-foreground">
                                Request from <strong>{request.buyerName}</strong>
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.message}</p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>📧 {request.buyerEmail}</span>
                              <span>📱 {request.buyerPhone}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" onClick={() => handleAcceptRequest(request.id)} className="gap-1.5">
                                <Check className="h-4 w-4" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRejectRequest(request.id)}
                                className="gap-1.5"
                              >
                                <X className="h-4 w-4" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No active requests</h3>
                    <p className="text-muted-foreground">When students request to contact you, they'll appear here</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <Card key={request.id} className="p-6">
                        <div className="flex gap-4">
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                              src={request.itemImage || "/placeholder.svg"}
                              alt={request.itemTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{request.itemTitle}</h3>
                                <p className="text-sm text-muted-foreground">Sent to {request.sellerName}</p>
                              </div>
                              <Badge variant="outline" className="gap-1.5">
                                <Clock className="h-3 w-3" />
                                Pending
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{request.message}</p>
                            <p className="text-xs text-muted-foreground">
                              Sent on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No pending requests</h3>
                    <p className="text-muted-foreground">Requests awaiting seller response will appear here</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="accepted" className="mt-6">
                {acceptedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedRequests.map((request) => (
                      <Card key={request.id} className="p-6 border-2 border-accent/50 bg-accent/5">
                        <div className="flex gap-4">
                          <div className="h-20 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                            <img
                              src={request.itemImage || "/placeholder.svg"}
                              alt={request.itemTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-foreground">{request.itemTitle}</h3>
                                {request.itemPrice && (
                                  <p className="text-lg font-bold text-primary">₹{request.itemPrice}</p>
                                )}
                              </div>
                              <Badge className="gap-1.5 bg-accent text-accent-foreground">
                                <CheckCircle2 className="h-3 w-3" />
                                Accepted
                              </Badge>
                            </div>
                            <div className="p-4 bg-card rounded-lg border border-border space-y-2">
                              <p className="text-sm font-medium text-foreground">Seller Contact Information:</p>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <strong className="text-foreground">{request.sellerName}</strong>
                                </p>
                                {request.sellerEmail && (
                                  <p className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <a href={`mailto:${request.sellerEmail}`} className="text-primary hover:underline">
                                      {request.sellerEmail}
                                    </a>
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Accepted on {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <CheckCircle2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No accepted requests</h3>
                    <p className="text-muted-foreground">When sellers accept your requests, they'll appear here</p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
