"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Search,
  MapPin,
  Star,
  Calendar,
  Music,
  Utensils,
  Building2,
  LogOut,
  User,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { bookingsAPI, servicesAPI } from "@/lib/api";

export default function UserDashboard() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User");

      // Load bookings from backend
      const loadBookings = async () => {
        try {
          const data = await bookingsAPI.getByUserId(user.uid);
          setBookings(data.bookings || []);
        } catch (error) {
          console.error("Error loading bookings:", error);
        } finally {
          setLoadingBookings(false);
        }
      };
      loadBookings();

      // Load services from backend
      const loadProviders = async () => {
        try {
          const data = await servicesAPI.getAll();
          setProviders(data.services || []);
        } catch (error) {
          console.error("Error loading services:", error);
        } finally {
          setLoadingProviders(false);
        }
      };
      loadProviders();
    }
  }, [user, loading, router]);

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

  if (!user) {
    return null;
  }

  const filteredProviders = providers.filter((provider: any) => {
    const matchesSearch =
      provider.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || provider.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "venue":
        return <Building2 className="h-4 w-4" />;
      case "vendor":
        return <Utensils className="h-4 w-4" />;
      case "entertainment":
        return <Music className="h-4 w-4" />;
      default:
        return null;
    }
  };

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
              <Link href="/user/bookings">
                <Button variant="ghost" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  My Bookings
                </Button>
              </Link>
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground">
            Discover and book amazing services for your next event
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search venues, vendors, entertainment..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="venue">Venues</TabsTrigger>
            <TabsTrigger value="vendor">Vendors</TabsTrigger>
            <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Service Providers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative overflow-hidden bg-muted">
                <img
                  src={provider.image || "/placeholder.svg"}
                  alt={provider.name}
                  className="object-cover w-full h-full"
                />
                <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm">
                  {getCategoryIcon(provider.category)}
                  <span className="ml-1 capitalize">{provider.category}</span>
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl">{provider.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                    <Star className="h-4 w-4 fill-secondary text-secondary" />
                    <span className="font-semibold">{provider.rating}</span>
                    <span className="text-muted-foreground">
                      ({provider.reviews})
                    </span>
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {provider.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {provider.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {provider.price}
                  </span>
                  <Link href={`/user/service/${provider.id}`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No services found matching your criteria
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
