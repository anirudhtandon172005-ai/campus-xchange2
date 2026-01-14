"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()

  // Middleware handles auth redirect, just show loading state here
  if (isLoading) {
    return null
  }

  return <>{children}</>
}
