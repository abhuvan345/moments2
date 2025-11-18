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
import { bookingsAPI, servicesAPI } from "@/lib/api";

const mockProviders = [
  { id: 1, name: "Grand Ballroom Events" },
  { id: 2, name: "Gourmet Catering Co" },
  { id: 3, name: "The Jazz Collective" },
  { id: 4, name: "Sunset Garden Venue" },
  { id: 5, name: "Lens & Light Photography" },
  { id: 6, name: "DJ Pulse Entertainment" },
];

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading, signOut } = useAuth();
  const [userName, setUserName] = useState("");
  const [provider, setProvider] = useState<{ id: number; name: string } | null>(
    null
  );
  const [date, setDate] = useState<Date>();
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (user) {
      setUserName(user.displayName || user.email?.split("@")[0] || "User");
    }

    const foundProvider = mockProviders.find((p) => p.id === Number(params.id));
    setProvider(foundProvider || null);
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
      await bookingsAPI.create({
        userId: user?.uid,
        serviceId: params.id as string,
        eventType,
        eventDate: date?.toISOString() || "",
        guestCount: parseInt(guestCount),
        message,
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
                Send a booking request to {provider.name}
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
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
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
                  disabled={loading || !date}
                >
                  {loading ? "Sending Request..." : "Send Booking Request"}
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
