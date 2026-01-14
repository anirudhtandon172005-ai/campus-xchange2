"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Mail, CheckCircle2, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()

  const handleVerify = () => {
    setIsVerifying(true)
    // Simulate verification process
    setTimeout(() => {
      setIsVerifying(false)
      setIsVerified(true)
      setTimeout(() => {
        router.push("/browse")
      }, 2000)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          {isVerified ? (
            <Card className="p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-verified/10">
                  <CheckCircle2 className="h-12 w-12 text-verified" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-3">You're Verified!</h2>
                <p className="text-lg text-muted-foreground">
                  Welcome to CampusXchange. Redirecting you to browse items...
                </p>
              </div>
            </Card>
          ) : (
            <>
              <div className="text-center mb-8 space-y-3">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-verified/10">
                    <Shield className="h-8 w-8 text-verified" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground">Verify Your Identity</h1>
                <p className="text-muted-foreground leading-relaxed text-balance">
                  To keep our campus community safe, we need to verify you're a current student.
                </p>
              </div>

              <Card className="p-6">
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">College Email</TabsTrigger>
                    <TabsTrigger value="id">Student ID</TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">College Email Address</Label>
                      <div className="flex gap-2">
                        <Input id="email" type="email" placeholder="yourname@university.edu" className="flex-1" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We'll send a verification link to your .edu email address
                      </p>
                    </div>

                    <Button className="w-full gap-2" onClick={handleVerify} disabled={isVerifying}>
                      <Mail className="h-4 w-4" />
                      {isVerifying ? "Sending..." : "Send Verification Email"}
                    </Button>
                  </TabsContent>

                  <TabsContent value="id" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label>Upload Student ID</Label>
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 hover:border-primary/50 transition-colors cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your ID will be reviewed by our team within 24 hours
                      </p>
                    </div>

                    <Button className="w-full gap-2" onClick={handleVerify} disabled={isVerifying}>
                      {isVerifying ? "Verifying..." : "Submit for Verification"}
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="mt-6 p-4 rounded-lg bg-muted/50 space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Why do we verify?</h3>
                  <ul className="text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    <li>• Ensures only current students access the marketplace</li>
                    <li>• Creates a safe, trusted campus community</li>
                    <li>• Prevents scams and unauthorized access</li>
                    <li>• Your personal information is never shared publicly</li>
                  </ul>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
