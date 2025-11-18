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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  Search,
  MapPin,
  DollarSign,
  Star,
  User,
  LogOut,
  Building2,
  Music,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { providersAPI } from "@/lib/api";
import Image from "next/image";

interface Provider {
  id: string;
  businessName: string;
  category: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  avatar: string;
  images: string[];
  status: string;
}

export default function BrowsePage() {
  const router = useRouter();
  const { user, userRole, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (!loading && userRole && userRole !== "user" && userRole !== "admin") {
      router.push("/provider/dashboard");
      return;
    }

    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User");

      // Load providers from backend
      const loadProviders = async () => {
        try {
          // Only load approved providers
          const data = await providersAPI.getAll({ status: "approved" });
          setProviders(data.providers || []);
        } catch (error) {
          console.error("Error loading providers:", error);
        } finally {
          setLoadingProviders(false);
        }
      };
      loadProviders();
    }
  }, [user, userRole, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

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

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      (provider.businessName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (provider.description?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (provider.location?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      );

    const matchesCategory =
      categoryFilter === "all" || provider.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

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
              <Link href="/user/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse Services
          </h1>
          <p className="text-muted-foreground">
            Find the perfect venue, vendor, or entertainment for your event
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, location, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="venue">Venues</SelectItem>
                  <SelectItem value="vendor">Vendors</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {filteredProviders.length}{" "}
            {filteredProviders.length === 1 ? "result" : "results"} found
          </p>
        </div>

        {/* Provider Cards */}
        {filteredProviders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                No providers found matching your criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="flex flex-col overflow-hidden">
                {/* Provider Image */}
                {provider.images && provider.images.length > 0 ? (
                  <div className="relative h-48 w-full bg-muted">
                    <Image
                      src={provider.images[0]}
                      alt={provider.businessName}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-primary/30" />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">
                      {provider.businessName}
                    </CardTitle>
                    <Badge className="bg-primary/10 text-primary">
                      {getCategoryIcon(provider.category)}
                      <span className="ml-1 capitalize">
                        {provider.category}
                      </span>
                    </Badge>
                  </div>
                  <CardDescription className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {provider.location || "Location not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-3 w-3" />
                      <span>{provider.priceRange || "Price on request"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 fill-secondary text-secondary" />
                      <span className="font-medium text-foreground">
                        {provider.rating || 0}
                      </span>
                      <span>({provider.reviewCount || 0} reviews)</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {provider.description}
                  </p>
                  {provider.features && provider.features.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {provider.features.slice(0, 3).map((feature, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {provider.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{provider.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <Link href={`/book/${provider.id}`} className="mt-auto">
                    <Button className="w-full">Request Booking</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
