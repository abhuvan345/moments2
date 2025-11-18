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
import { Sparkles, Calendar, User, LogOut, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { bookingsAPI } from "@/lib/api";

interface Booking {
  id: string;
  providerId: string;
  providerName: string;
  eventDate: string;
  eventType: string;
  guestCount: number;
  message: string;
  status: "pending" | "confirmed" | "rejected" | "completed";
  createdAt: string;
}

export default function UserBookingsPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  useEffect(() => {
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

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Track and manage your event service bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No bookings yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Start planning your event by browsing our services
              </p>
              <Link href="/user/dashboard">
                <Button>Browse Services</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">
                        {booking.providerName}
                      </CardTitle>
                      <CardDescription>{booking.eventType}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {booking.dates && booking.dates.length > 1
                          ? "Event Dates"
                          : "Event Date"}
                      </p>
                      <p className="font-medium text-foreground">
                        {booking.dates && booking.dates.length > 0
                          ? booking.dates.length === 1
                            ? format(new Date(booking.dates[0]), "MMMM d, yyyy")
                            : booking.dates.length <= 3
                            ? booking.dates
                                .map((d) => format(new Date(d), "MMM d, yyyy"))
                                .join(", ")
                            : `${format(
                                new Date(booking.dates[0]),
                                "MMM d"
                              )} - ${format(
                                new Date(
                                  booking.dates[booking.dates.length - 1]
                                ),
                                "MMM d, yyyy"
                              )} (${booking.dates.length} dates)`
                          : booking.date
                          ? format(new Date(booking.date), "MMMM d, yyyy")
                          : "Date TBD"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Guest Count</p>
                      <p className="font-medium text-foreground">
                        {booking.guestCount || 0} guests
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-muted-foreground mb-1">Request Sent</p>
                      <p className="font-medium text-foreground">
                        {booking.createdAt
                          ? format(
                              new Date(booking.createdAt),
                              "MMM d, yyyy 'at' h:mm a"
                            )
                          : "Recently"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
