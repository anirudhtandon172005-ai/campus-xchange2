"use client"

import type React from "react"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShoppingBag, Shield, Mail, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const EMAIL_REGEX = /^\d{12}@mail\.jiit\.ac\.in$/

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)

  const isValidEmail = (email: string) => EMAIL_REGEX.test(email)

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

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      console.error(signUpError)
      setError(signUpError.message)
      setIsLoading(false)
      return
    }

    setSignupSuccess(true)
    setIsLoading(false)
  }

  if (signupSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-verified/10 mx-auto">
            <CheckCircle2 className="h-8 w-8 text-verified" />
          </div>
          <h1 className="text-2xl font-bold">Check Your Email</h1>
          <p className="text-muted-foreground">
            We’ve sent a verification link to <b>{email}</b>
          </p>
          <Link href="/login" className="text-primary hover:underline">
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <ShoppingBag className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground">Join the CampusXchange community</p>
        </div>

        <Card className="p-6 space-y-6 border-2">
          <div className="flex items-center gap-2 text-verified">
            <Shield className="h-5 w-5" />
            <span className="text-sm font-medium">Campus-Only Marketplace</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="123456789012@mail.jiit.ac.in"
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account…" : "Sign Up"}
            </Button>
          </form>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
