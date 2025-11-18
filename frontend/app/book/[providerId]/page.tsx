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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sparkles,
  ArrowLeft,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { bookingsAPI, servicesAPI } from "@/lib/api";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const providerId = params.providerId as string;
  const { user, userRole, loading } = useAuth();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [providerName, setProviderName] = useState("");

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
      setUserName(user.displayName || "");
      setUserEmail(user.email || "");

      // Load provider/service name from backend
      const loadProvider = async () => {
        try {
          const data = await servicesAPI.getById(providerId);
          if (data.service) {
            setProviderName(data.service.name || "Service Provider");
          }
        } catch (error) {
          console.error("Error loading provider:", error);
          setProviderName("Service Provider");
        }
      };
      loadProvider();
    }
  }, [user, userRole, loading, router, providerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create booking via API
      await bookingsAPI.create({
        userId: user?.uid,
        providerId,
        eventType,
        eventDate,
        guestCount: parseInt(guestCount),
        message,
        status: "pending",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Booking Request Sent!</CardTitle>
            <CardDescription>
              Your request has been sent to {providerName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The service provider will review your request and respond soon.
              You can track the status in your dashboard.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/user/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href="/browse">
                <Button variant="outline" className="w-full bg-transparent">
                  Browse More Services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            <span className="text-2xl font-bold text-foreground">Moment</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Link href="/browse">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Book {providerName}
            </h1>
            <p className="text-muted-foreground">
              Fill out the form below to send a booking request
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Tell us about your event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select
                    value={eventType}
                    onValueChange={setEventType}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Wedding Reception">
                        Wedding Reception
                      </SelectItem>
                      <SelectItem value="Corporate Event">
                        Corporate Event
                      </SelectItem>
                      <SelectItem value="Birthday Party">
                        Birthday Party
                      </SelectItem>
                      <SelectItem value="Anniversary">Anniversary</SelectItem>
                      <SelectItem value="Graduation">Graduation</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Event Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">
                      <Users className="h-4 w-4 inline mr-1" />
                      Number of Guests
                    </Label>
                    <Input
                      id="guests"
                      type="number"
                      placeholder="e.g., 100"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    <MessageSquare className="h-4 w-4 inline mr-1" />
                    Additional Details
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more about your event, special requirements, or any questions you have..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="pt-4 space-y-3">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? "Sending Request..." : "Send Booking Request"}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    By submitting this form, you agree to be contacted by the
                    service provider regarding your event.
                  </p>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
