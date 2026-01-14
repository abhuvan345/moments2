import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Users,
  Star,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* <Sparkles className="h-7 w-7 text-primary" /> */}
              <span className="text-2xl font-bold text-foreground">
                Moment
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#features"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Link
                href="#for-providers"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                For Providers
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-background" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              Trusted by 10,000+ event planners
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
              Your Perfect Event Starts Here
            </h1>

            <p className="text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto">
              Connect with top-rated venues, talented vendors, and amazing
              entertainment. Plan unforgettable moments with ease.
            </p>

            {/* Action Cards (Primary CTA) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
              {/* Find a Service */}
              <Link href="/browse">
                <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-lg">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="h-16 w-16 rounded-xl border-2 border-border flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="h-8 w-8 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Find a service
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      I'm looking for a service
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Sell Services */}
              <Link href="/auth/signup?role=provider">
                <Card className="border-2 hover:border-primary/50 transition-all cursor-pointer h-full hover:shadow-lg">
                  <CardContent className="pt-8 pb-8 text-center">
                    <div className="h-16 w-16 rounded-xl border-2 border-border flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="h-8 w-8 text-emerald-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Selling services
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      I'd like to offer my services
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform for planning events and connecting with
              service providers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Easy Booking
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse and book venues, vendors, and entertainment all in one
                  place. Simple, fast, and secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Verified Providers
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All service providers are carefully vetted and approved by
                  our admin team.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-8 pb-8">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Secure Platform
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Role-based authentication ensures your data is protected
                  and you only see what's relevant.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Providers */}
      <section
        id="for-providers"
        className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Are You a Service Provider?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Join our platform to showcase your talents, connect with
              clients, and grow your business.
            </p>
            <Link href="/auth/signup?role=provider">
              <Button size="lg" className="text-base px-8">
                Join as Provider
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                Moment
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Moment. Creating unforgettable events.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
