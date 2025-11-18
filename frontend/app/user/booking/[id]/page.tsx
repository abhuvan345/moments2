"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles, ArrowLeft, CalendarIcon, User, LogOut } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { bookingsAPI, providersAPI } from "@/lib/api";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [providerName, setProviderName] = useState("");
  const [date, setDate] = useState<Date[]>([]);
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User");
    }

    // Load provider name
    const loadProvider = async () => {
      try {
        const data = await providersAPI.getById(params.id as string);
        if (data.provider) {
          setProviderName(data.provider.businessName || "Service Provider");
        }
      } catch (error) {
        console.error("Error loading provider:", error);
      }
    };
    loadProvider();

    // Load booked dates for this provider
    const loadBookedDates = async () => {
      try {
        const response = await bookingsAPI.getProviderBookedDates(
          params.id as string
        );
        if (response.bookedDates) {
          const dates = response.bookedDates.map((b: any) => {
            const bookingDate = new Date(b.date);
            // Normalize to midnight UTC to avoid timezone issues
            bookingDate.setHours(0, 0, 0, 0);
            return bookingDate.toISOString().split("T")[0];
          });
          setBookedDates(dates);
        }
      } catch (error) {
        console.error("Error loading booked dates:", error);
      }
    };
    loadBookedDates();
  }, [user, authLoading, router, params.id]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a single booking with all selected dates
      const sortedDates = [...date].sort((a, b) => a.getTime() - b.getTime());
      await bookingsAPI.create({
        userId: user?.uid,
        providerId: params.id as string,
        serviceId: params.id as string,
        date: sortedDates[0].toISOString(), // Primary date (first selected)
        dates: sortedDates.map((d) => d.toISOString()), // All selected dates
        time: "TBD",
        eventType,
        guestCount: parseInt(guestCount) || 0,
        notes: message,
        totalPrice: 0,
        status: "pending",
      });

      router.push("/user/bookings");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
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
        <Link href={`/user/service/${params.id}`}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Service
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl">Request Booking</CardTitle>
              <CardDescription>
                Send a booking request to {providerName}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Input
                    id="eventType"
                    placeholder="e.g., Wedding, Corporate Event, Birthday Party"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Event Date</Label>
                  <Calendar
                    mode="multiple"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="rounded-lg"
                    modifiers={{
                      booked: (checkDate) => {
                        const dateStr = new Date(
                          checkDate.getFullYear(),
                          checkDate.getMonth(),
                          checkDate.getDate()
                        )
                          .toISOString()
                          .split("T")[0];
                        return bookedDates.includes(dateStr);
                      },
                      available: (checkDate) => {
                        const dateStr = new Date(
                          checkDate.getFullYear(),
                          checkDate.getMonth(),
                          checkDate.getDate()
                        )
                          .toISOString()
                          .split("T")[0];
                        const isSelected = date.some(
                          (selectedDate) =>
                            selectedDate.getFullYear() ===
                              checkDate.getFullYear() &&
                            selectedDate.getMonth() === checkDate.getMonth() &&
                            selectedDate.getDate() === checkDate.getDate()
                        );
                        return (
                          checkDate >= new Date() &&
                          !bookedDates.includes(dateStr) &&
                          !isSelected
                        );
                      },
                      selected: (checkDate) => {
                        return date.some(
                          (selectedDate) =>
                            selectedDate.getFullYear() ===
                              checkDate.getFullYear() &&
                            selectedDate.getMonth() === checkDate.getMonth() &&
                            selectedDate.getDate() === checkDate.getDate()
                        );
                      },
                    }}
                    modifiersClassNames={{
                      booked:
                        "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-900 line-through font-bold border-2 border-red-400",
                      available:
                        "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900/50 border-2 border-green-400",
                      selected:
                        "!bg-orange-500 !text-white hover:!bg-orange-600 !border-4 !border-orange-500 shadow-lg scale-105 font-bold z-10",
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestCount">Expected Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    placeholder="e.g., 100"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    required
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Additional Details</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell the provider more about your event, special requirements, or questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={loading || date.length === 0}
                >
                  {loading
                    ? "Sending Request..."
                    : `Send Booking Request${
                        date.length > 0
                          ? ` (${date.length} date${
                              date.length > 1 ? "s" : ""
                            })`
                          : ""
                      }`}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  The provider will review your request and respond with
                  availability and final pricing
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
