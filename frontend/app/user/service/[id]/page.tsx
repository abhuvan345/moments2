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
import { servicesAPI } from "@/lib/api";
import { servicesAPI } from "@/lib/api";

export default function ServiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [provider, setProvider] = useState<any>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User");
    }

    // Load service from backend
    const loadService = async () => {
      try {
        const data = await servicesAPI.getById(params.id as string);
        if (data.service) {
          setProvider(data.service);
        }
      } catch (error) {
        console.error("Error loading service:", error);
      } finally {
        setLoadingProvider(false);
      }
    };
    loadService();
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
