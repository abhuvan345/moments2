"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Sparkles, ArrowLeft, User, LogOut, Upload, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { providersAPI } from "@/lib/api";

export default function ProviderProfilePage() {
  const router = useRouter();
  const { user, userRole, loading, signOut } = useAuth();
  const [providerName, setProviderName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [providerId, setProviderId] = useState<string | null>(null);

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

      // Load existing profile data from backend
      const loadProfile = async () => {
        try {
          const data = await providersAPI.getByUid(user.uid);
          if (data.provider) {
            const profile = data.provider;
            setProviderId(profile.id);
            setBusinessName(profile.businessName || "");
            setCategory(profile.category || "");
            setLocation(profile.location || "");
            setPriceRange(profile.priceRange || "");
            setDescription(profile.description || "");
            setFeatures(profile.features || [""]);
          }
        } catch (error) {
          // Provider profile doesn't exist yet, which is fine for new providers
          console.log(
            "No existing provider profile found - creating new profile"
          );
        }
      };
      loadProfile();
    }
  }, [user, userRole, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const profileData = {
        uid: user?.uid,
        businessName,
        category,
        location,
        priceRange,
        description,
        features: features.filter((f) => f.trim() !== ""),
      };

      if (providerId) {
        await providersAPI.update(providerId, profileData);
      } else {
        await providersAPI.create(profileData);
      }

      router.push("/provider/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSubmitting(false);
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
        <Link href="/provider/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Edit Profile
            </h1>
            <p className="text-muted-foreground">
              Update your business information and showcase your services
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Tell clients about your services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    placeholder="e.g., Grand Ballroom Events"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venue">Venue</SelectItem>
                      <SelectItem value="vendor">Vendor</SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Input
                    id="priceRange"
                    placeholder="e.g., $5,000 - $15,000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your services, experience, and what makes you unique..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features & Amenities</CardTitle>
                <CardDescription>
                  List what's included in your service
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="e.g., Capacity: 500 guests"
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveFeature(index)}
                        className="bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFeature}
                  className="w-full bg-transparent"
                >
                  Add Feature
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Images</CardTitle>
                <CardDescription>
                  Showcase your work (coming soon)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Image upload feature coming soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You'll be able to upload photos of your venue, work, or
                    performances
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1"
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Profile"}
              </Button>
              <Link href="/provider/dashboard" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
