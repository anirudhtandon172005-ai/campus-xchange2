"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Shield, Mail, Lock } from "lucide-react"
import Link from "next/link"

const EMAIL_REGEX = /^\d{12}@mail\.jiit\.ac\.in$/

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const isValidEmail = (email: string): boolean => {
    return EMAIL_REGEX.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!email.trim()) {
      setError("Email is required")
      setIsLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError("Email must be 12 digits followed by @mail.jiit.ac.in")
      setIsLoading(false)
      return
    }

    if (!password) {
      setError("Password is required")
      setIsLoading(false)
      return
    }

    try {
      const result = await signIn(email, password)
      if (result?.error) {
        setError(result.error)
        setIsLoading(false)
      }
      // If successful, Server Action will redirect
    } catch (err) {
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your CampusXchange account</p>
        </div>

        {/* Login Card */}
        <Card className="p-6 space-y-6 border-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-verified">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">Campus-Only Marketplace</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in with your JIIT student email to access the marketplace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">JIIT Student Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="123456789012@mail.jiit.ac.in"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  className="pl-9"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>Your email is only used for verification purposes.</p>
          <p>We never share your information with third parties.</p>
        </div>
      </div>
    </div>
  )
}
