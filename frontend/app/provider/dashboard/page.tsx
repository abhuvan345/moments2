"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  User,
  LogOut,
  Calendar,
  Star,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { bookingsAPI, providersAPI } from "@/lib/api";

interface BookingRequest {
  id: number;
  userName: string;
  userEmail: string;
  eventType: string;
  date: string;
  guestCount: string;
  message: string;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const { user, userRole, loading, signOut } = useAuth();
  const [providerName, setProviderName] = useState("");
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingRequests: 0,
    confirmedBookings: 0,
    rating: 4.8,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (
      !loading &&
      userRole &&
      userRole !== "provider" &&
      userRole !== "admin"
    ) {
      router.push("/user/dashboard");
      return;
    }

    if (user) {
      setProviderName(
        user.displayName || user.email?.split("@")[0] || "Provider"
      );

      // Load provider's bookings from backend
      const loadBookings = async () => {
        try {
          // First get provider profile to get providerId
          const providerData = await providersAPI.getByUid(user.uid);
          if (providerData.provider) {
            const data = await bookingsAPI.getByProviderId(
              providerData.provider.id
            );
            const requests = data.bookings || [];
            setBookingRequests(requests);

            // Calculate stats
            setStats({
              totalBookings: requests.length,
              pendingRequests: requests.filter(
                (r: any) => r.status === "pending"
              ).length,
              confirmedBookings: requests.filter(
                (r: any) => r.status === "confirmed"
              ).length,
              rating: 4.8,
            });
          } else {
            // No provider profile found - redirect to complete profile
            console.log(
              "No provider profile found. Please complete your profile."
            );
          }
        } catch (error) {
          console.error("Error loading bookings:", error);
          // If provider not found, just show empty state
          setBookingRequests([]);
        }
      };
      loadBookings();
    }
  }, [user, userRole, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleBookingAction = (
    bookingId: number,
    action: "confirmed" | "rejected"
  ) => {
    setBookingRequests((prev) =>
      prev.map((req) =>
        req.id === bookingId ? { ...req, status: action } : req
      )
    );

    // Update stats
    setStats((prev) => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      confirmedBookings:
        action === "confirmed"
          ? prev.confirmedBookings + 1
          : prev.confirmedBookings,
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-secondary/50 text-secondary-foreground";
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
              <Link href="/provider/profile">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {providerName}
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
            Welcome back, {providerName}!
          </h1>
          <p className="text-muted-foreground">
            Manage your bookings and grow your business
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Requests</CardDescription>
              <CardTitle className="text-3xl">{stats.totalBookings}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Requests</CardDescription>
              <CardTitle className="text-3xl">
                {stats.pendingRequests}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-secondary">
                <Clock className="h-4 w-4" />
                <span>Needs attention</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Confirmed Bookings</CardDescription>
              <CardTitle className="text-3xl">
                {stats.confirmedBookings}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span>Upcoming events</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Your Rating</CardDescription>
              <CardTitle className="text-3xl">{stats.rating}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span>Based on reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Requests</CardTitle>
            <CardDescription>
              Review and respond to client inquiries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">
                  Pending (
                  {bookingRequests.filter((r) => r.status === "pending").length}
                  )
                </TabsTrigger>
                <TabsTrigger value="confirmed">
                  Confirmed (
                  {
                    bookingRequests.filter((r) => r.status === "confirmed")
                      .length
                  }
                  )
                </TabsTrigger>
                <TabsTrigger value="all">
                  All ({bookingRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                {bookingRequests.filter((r) => r.status === "pending")
                  .length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending requests
                  </div>
                ) : (
                  bookingRequests
                    .filter((r) => r.status === "pending")
                    .map((request) => (
                      <Card key={request.id} className="border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg">
                                {request.eventType}
                              </CardTitle>
                              <CardDescription>
                                {request.userName} • {request.userEmail}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">
                                {request.status}
                              </span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Event Date
                              </p>
                              <p className="font-medium text-foreground">
                                {format(new Date(request.date), "MMMM d, yyyy")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Guest Count
                              </p>
                              <p className="font-medium text-foreground">
                                {request.guestCount} guests
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm mb-1">
                              Message
                            </p>
                            <p className="text-foreground leading-relaxed">
                              {request.message}
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              className="flex-1"
                              onClick={() =>
                                handleBookingAction(request.id, "confirmed")
                              }
                              disabled={request.status !== "pending"}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() =>
                                handleBookingAction(request.id, "rejected")
                              }
                              disabled={request.status !== "pending"}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Decline
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              <TabsContent value="confirmed" className="space-y-4">
                {bookingRequests.filter((r) => r.status === "confirmed")
                  .length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No confirmed bookings
                  </div>
                ) : (
                  bookingRequests
                    .filter((r) => r.status === "confirmed")
                    .map((request) => (
                      <Card key={request.id} className="border-2">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-lg">
                                {request.eventType}
                              </CardTitle>
                              <CardDescription>
                                {request.userName} • {request.userEmail}
                              </CardDescription>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">
                                {request.status}
                              </span>
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Event Date
                              </p>
                              <p className="font-medium text-foreground">
                                {format(new Date(request.date), "MMMM d, yyyy")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">
                                Guest Count
                              </p>
                              <p className="font-medium text-foreground">
                                {request.guestCount} guests
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {bookingRequests.map((request) => (
                  <Card key={request.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            {request.eventType}
                          </CardTitle>
                          <CardDescription>
                            {request.userName} • {request.userEmail}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">
                            {request.status}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">
                            Event Date
                          </p>
                          <p className="font-medium text-foreground">
                            {format(new Date(request.date), "MMMM d, yyyy")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">
                            Guest Count
                          </p>
                          <p className="font-medium text-foreground">
                            {request.guestCount} guests
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
