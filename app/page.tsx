import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle2, Shield, Zap, Leaf, TrendingUp, Store } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border min-h-screen flex items-center">
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          <img
            src="/images/chatgpt-20image-20jan-2012-2c-202026-2c-2010-35-39-20pm.png"
            alt="College student in campus hallway"
            className="w-full h-full object-cover object-center"
          />

          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70" />

          {/* Additional warm gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/90 backdrop-blur-sm px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg">
              <Shield className="h-4 w-4" />
              Campus-Only • Verified Students Only
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-2xl">
              Your Campus Marketplace for <span className="text-primary">Everything</span>
            </h1>

            <p className="text-lg text-white/90 leading-relaxed drop-shadow-lg">
              Buy, sell, borrow, and recycle items safely within your campus community. No shipping. No strangers. Just
              students helping students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base shadow-xl hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/login">Get Started Now</Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-xl hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/browse">Browse Items</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Why CampusXchange?</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Shield className="h-6 w-6 text-verified" />}
            title="Campus-Only Safety"
            text="Only verified students from your campus can buy or sell. Meet face-to-face in safe campus locations."
          />

          <FeatureCard
            icon={<Zap className="h-6 w-6 text-primary" />}
            title="Lightning Fast"
            text="List items in seconds. Mark urgent items to sell even faster. No shipping delays."
          />

          <FeatureCard
            icon={<Leaf className="h-6 w-6 text-accent" />}
            title="Sustainable Campus"
            text="Recycle old items instead of throwing them away. Reduce waste and help fellow students."
          />

          <FeatureCard
            icon={<TrendingUp className="h-6 w-6 text-urgent-foreground" />}
            title="Affordable Prices"
            text="Students sell to students. Get textbooks, furniture, and electronics at student-friendly prices."
          />

          <FeatureCard
            icon={<CheckCircle2 className="h-6 w-6 text-secondary-foreground" />}
            title="Borrow & Share"
            text="Need something for a short time? Browse items available for temporary borrowing."
          />

          <FeatureCard
            icon={<Store className="h-6 w-6 text-foreground" />}
            title="Local Campus Ads"
            text="Discover local campus shops and services. Support businesses that support students."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-8 md:p-12">
          <div className="mx-auto max-w-2xl text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Ready to Join Your Campus Community?</h2>
            <p className="text-lg text-muted-foreground">
              Thousands of students are already buying, selling, and sharing. Start today!
            </p>
            <Button size="lg" className="text-base" asChild>
              <Link href="/login">Login with College Email</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card className="p-6 space-y-3 border-2 hover:border-primary/50 transition-colors">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">{icon}</div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{text}</p>
    </Card>
  )
}
