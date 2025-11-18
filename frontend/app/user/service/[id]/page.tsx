"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Check,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

// Mock provider data (same as dashboard)
const mockProviders = [
  {
    id: 1,
    name: "Grand Ballroom Events",
    category: "venue",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    price: "$5,000 - $15,000",
    image: "/elegant-ballroom-venue-interior.jpg",
    description: "Luxurious ballroom perfect for weddings and corporate events",
    fullDescription:
      "Our grand ballroom features stunning crystal chandeliers, elegant decor, and can accommodate up to 500 guests. Perfect for weddings, corporate events, and special celebrations.",
    features: [
      "Capacity: 500 guests",
      "Crystal chandeliers",
      "In-house catering available",
      "Free parking",
    ],
    portfolio: [
      "/ballroom-wedding-setup.jpg",
      "/ballroom-corporate-event.jpg",
      "/ballroom-gala-dinner.jpg",
    ],
  },
  {
    id: 2,
    name: "Gourmet Catering Co",
    category: "vendor",
    rating: 4.8,
    reviews: 89,
    location: "Los Angeles, CA",
    price: "$50 - $150 per person",
    image: "/gourmet-catering-presentation.jpg",
    description: "Award-winning catering service with customizable menus",
    fullDescription:
      "We provide exceptional catering services with a focus on fresh, locally-sourced ingredients and creative presentation. Our experienced chefs can customize menus to match your event theme and dietary requirements.",
    features: [
      "Custom menus",
      "Dietary accommodations",
      "Professional staff",
      "Award-winning chefs",
    ],
    portfolio: [
      "/elegant-plated-dinner.jpg",
      "/buffet-catering-setup.jpg",
      "/dessert-table-display.jpg",
    ],
  },
  {
    id: 3,
    name: "The Jazz Collective",
    category: "entertainment",
    rating: 5.0,
    reviews: 64,
    location: "Chicago, IL",
    price: "$2,000 - $5,000",
    image: "/jazz-band-live-performance.jpg",
    description: "Professional jazz band for sophisticated events",
    fullDescription:
      "Our talented ensemble of professional musicians brings elegance and energy to any event. With a repertoire spanning classic jazz standards to contemporary hits, we create the perfect ambiance for your special occasion.",
    features: [
      "5-piece ensemble",
      "Custom setlists",
      "Professional sound system",
      "MC services available",
    ],
    portfolio: [
      "/jazz-band-wedding-performance.jpg",
      "/jazz-quartet-corporate-event.jpg",
      "/jazz-singer-performance.jpg",
    ],
  },
  {
    id: 4,
    name: "Sunset Garden Venue",
    category: "venue",
    rating: 4.7,
    reviews: 156,
    location: "Miami, FL",
    price: "$3,000 - $10,000",
    image: "/outdoor-garden-venue-sunset.jpg",
    description: "Beautiful outdoor garden venue with stunning sunset views",
    fullDescription:
      "Experience the magic of an outdoor celebration in our beautifully landscaped garden venue. With breathtaking sunset views and versatile spaces, we provide the perfect backdrop for your dream event.",
    features: [
      "Outdoor & indoor spaces",
      "Sunset views",
      "Garden ceremony area",
      "Climate-controlled tent",
    ],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: 5,
    name: "Lens & Light Photography",
    category: "vendor",
    rating: 4.9,
    reviews: 203,
    location: "San Francisco, CA",
    price: "$1,500 - $4,000",
    image: "/placeholder.svg?height=400&width=800",
    description: "Creative photography capturing your special moments",
    fullDescription:
      "We specialize in capturing authentic moments and emotions through artistic photography. Our team uses state-of-the-art equipment and creative techniques to tell your unique story.",
    features: [
      "Full-day coverage",
      "Second photographer",
      "Online gallery",
      "Print rights included",
    ],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
  {
    id: 6,
    name: "DJ Pulse Entertainment",
    category: "entertainment",
    rating: 4.8,
    reviews: 142,
    location: "Austin, TX",
    price: "$800 - $2,500",
    image: "/placeholder.svg?height=400&width=800",
    description: "High-energy DJ services for unforgettable parties",
    fullDescription:
      "Bring your event to life with our professional DJ services. We read the crowd and create an energetic atmosphere that keeps your guests dancing all night long.",
    features: [
      "Premium sound system",
      "Lighting effects",
      "Music requests",
      "MC services",
    ],
    portfolio: [
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
      "/placeholder.svg?height=300&width=400",
    ],
  },
];

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [provider, setProvider] = useState<(typeof mockProviders)[0] | null>(
    null
  );

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User");
    }

    // Find provider by ID
    const foundProvider = mockProviders.find((p) => p.id === Number(params.id));
    setProvider(foundProvider || null);
  }, [user, loading, router, params.id]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleBooking = () => {
    router.push(`/user/booking/${params.id}`);
  };

  if (!user || !provider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-primary" />
              <span className="text-2xl font-bold text-foreground">Moment</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {userName}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Link href="/user/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Hero Image */}
        <div className="aspect-[21/9] relative overflow-hidden rounded-xl bg-muted mb-8">
          <img
            src={provider.image || "/placeholder.svg"}
            alt={provider.name}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {provider.name}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location}</span>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {provider.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="h-5 w-5 fill-secondary text-secondary" />
                    <span className="text-2xl font-bold">
                      {provider.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {provider.reviews} reviews
                  </p>
                </div>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {provider.fullDescription}
              </p>
            </div>

            <Separator />

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                What's Included
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {provider.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Portfolio */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Portfolio
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {provider.portfolio.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square relative overflow-hidden rounded-lg bg-muted"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Portfolio ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-2">
              <CardHeader>
                <CardTitle>Book This Service</CardTitle>
                <CardDescription>Starting from</CardDescription>
                <p className="text-2xl font-bold text-foreground">
                  {provider.price}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={handleBooking}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Request Booking
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  You'll be able to discuss details and finalize pricing with
                  the provider
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
