"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2, Phone } from "lucide-react"
import { saveContactRequest, getCurrentUserId } from "@/lib/requests"

interface ContactRequestModalProps {
  isOpen: boolean
  onClose: () => void
  itemTitle: string
  itemId: string
  itemPrice?: number
  itemImage?: string
  sellerId: string
  sellerName?: string
}

export function ContactRequestModal({
  isOpen,
  onClose,
  itemTitle,
  itemId,
  itemPrice,
  itemImage,
  sellerId,
  sellerName = "the seller",
}: ContactRequestModalProps) {
  const [message, setMessage] = useState(`Hi! I'm interested in "${itemTitle}". Is it still available?`)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")
  const [errors, setErrors] = useState({ phone: "", message: "" })

  const validateForm = () => {
    const newErrors = { phone: "", message: "" }
    let isValid = true

    if (!phoneNumber.trim()) {
      newErrors.phone = "Phone number is required"
      isValid = false
    }

    if (!message.trim()) {
      newErrors.message = "Message is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSend = () => {
    if (!validateForm()) {
      return
    }

    setStatus("sending")
    const userData = localStorage.getItem("campusxchange_user")
    const user = userData ? JSON.parse(userData) : { name: "Anonymous User", email: "user@university.edu" }

    if (!user.email || user.email.trim() === "" || user.email === "null") {
      alert("Please update your profile with a valid email address before sending a request.")
      setStatus("idle")
      return
    }

    const userId = getCurrentUserId()

    saveContactRequest({
      itemId,
      itemTitle,
      itemPrice,
      itemImage,
      sellerId,
      sellerName,
      buyerId: userId,
      buyerName: user.name,
      buyerEmail: user.email,
      buyerPhone: phoneNumber,
      message,
    })

    // Simulate sending
    setTimeout(() => {
      setStatus("sent")
      setTimeout(() => {
        onClose()
        setStatus("idle")
        setPhoneNumber("")
        setMessage(`Hi! I'm interested in "${itemTitle}". Is it still available?`)
        setErrors({ phone: "", message: "" })
      }, 2000)
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Contact Info</DialogTitle>
          <DialogDescription className="text-balance">
            Send a message to {sellerName}. Once they accept, you'll receive their contact details.
          </DialogDescription>
        </DialogHeader>

        {status === "sent" ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <p className="text-center font-medium text-foreground">Request sent!</p>
            <p className="text-center text-sm text-muted-foreground">You'll be notified when the seller responds.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Your Phone Number *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      if (errors.phone) setErrors({ ...errors, phone: "" })
                    }}
                    placeholder="+91 98765 43210"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="message">Your Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value)
                    if (errors.message) setErrors({ ...errors, message: "" })
                  }}
                  rows={4}
                  placeholder="Introduce yourself and express your interest..."
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All meetups must happen on campus. Never share sensitive information before meeting in person.
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose} disabled={status === "sending"}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Request"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
