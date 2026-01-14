export interface ContactRequest {
  id: string
  itemId: string
  itemTitle: string
  itemPrice?: number
  itemImage?: string
  sellerId: string
  sellerName: string
  sellerEmail?: string
  buyerId: string
  buyerName: string
  buyerEmail: string
  buyerPhone: string
  message: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}

// Save a contact request
export function saveContactRequest(request: Omit<ContactRequest, "id" | "createdAt" | "status">): ContactRequest {
  const requests = getContactRequests()
  const newRequest: ContactRequest = {
    ...request,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  }
  requests.push(newRequest)
  localStorage.setItem("campusxchange_requests", JSON.stringify(requests))
  window.dispatchEvent(new Event("requestsUpdated"))
  return newRequest
}

// Get all contact requests
export function getContactRequests(): ContactRequest[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("campusxchange_requests")
  return stored ? JSON.parse(stored) : []
}

// Get requests sent by current user (pending status)
export function getPendingRequests(userId: string): ContactRequest[] {
  const requests = getContactRequests()
  return requests.filter((req) => req.buyerId === userId && req.status === "pending")
}

// Get accepted requests for current user
export function getAcceptedRequests(userId: string): ContactRequest[] {
  const requests = getContactRequests()
  return requests.filter((req) => req.buyerId === userId && req.status === "accepted")
}

// Get requests received by seller
export function getReceivedRequests(sellerId: string): ContactRequest[] {
  const requests = getContactRequests()
  return requests.filter((req) => req.sellerId === sellerId && req.status === "pending")
}

// Accept a request
export function acceptRequest(requestId: string): void {
  const requests = getContactRequests()
  const index = requests.findIndex((req) => req.id === requestId)
  if (index !== -1) {
    requests[index].status = "accepted"
    localStorage.setItem("campusxchange_requests", JSON.stringify(requests))
    window.dispatchEvent(new Event("requestsUpdated"))
  }
}

// Reject a request
export function rejectRequest(requestId: string): void {
  const requests = getContactRequests()
  const index = requests.findIndex((req) => req.id === requestId)
  if (index !== -1) {
    requests[index].status = "rejected"
    localStorage.setItem("campusxchange_requests", JSON.stringify(requests))
    window.dispatchEvent(new Event("requestsUpdated"))
  }
}

// Get current user ID from localStorage
export function getCurrentUserId(): string {
  if (typeof window === "undefined") return "user-1"
  const userData = localStorage.getItem("campusxchange_user")
  if (userData) {
    const user = JSON.parse(userData)
    return user.id || "user-1"
  }
  return "user-1"
}
