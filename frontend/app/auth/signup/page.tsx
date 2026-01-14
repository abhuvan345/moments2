"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userRole, loading: authLoading, signUp } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"user" | "provider">("user");
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [experience, setExperience] = useState("");
  const [address, setAddress] = useState("");
  const [aadharFile, setAadharFile] = useState<File | null>(null);

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (1MB = 1048576 bytes)
      if (file.size > 1048576) {
        toast({
          title: "Error",
          description: "File size must be less than 1MB",
          variant: "destructive",
        });
        e.target.value = ""; // Reset file input
        return;
      }
      setAadharFile(file);
    }
  };

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "provider") {
      setRole("provider");
    }
  }, [searchParams]);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard based on role
    if (!authLoading && user && userRole) {
      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "provider") {
        router.push("/provider/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    }
  }, [user, userRole, authLoading, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast({
        title: "Error",
        description: "Please accept the terms and conditions to continue",
        variant: "destructive",
      });
      return;
    }

    // Validate provider-specific fields
    if (role === "provider") {
      if (!experience || !address || !aadharFile) {
        toast({
          title: "Error",
          description:
            "Please fill in all provider fields and upload Aadhar card",
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    try {
      let aadharUrl = "";

      // Upload Aadhar to Cloudinary if provider
      if (role === "provider" && aadharFile) {
        const formData = new FormData();
        formData.append("file", aadharFile);

        const uploadResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          // Check if response is JSON or HTML
          const contentType = uploadResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await uploadResponse.json();
            throw new Error(errorData.error || "Failed to upload Aadhar card");
          } else {
            const textError = await uploadResponse.text();
            console.error("Server error:", textError);
            throw new Error(
              `Server error (${uploadResponse.status}): Please ensure backend is running`
            );
          }
        }

        const uploadData = await uploadResponse.json();
        aadharUrl = uploadData.url;
      }

      // Create user account with all provider fields
      await signUp(
        email,
        password,
        name,
        phone,
        role,
        experience,
        address,
        aadharUrl
      );

      toast({
        title: "Success",
        description: "Account created successfully",
      });

      // Redirect based on role
      if (role === "provider") {
        router.push("/provider/pending");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            {/* <Sparkles className="h-8 w-8 text-primary" /> */}
            <span className="text-3xl font-bold text-foreground">Moment</span>
          </Link>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>
              Join Moment to start planning amazing events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) =>
                    setRole(value as "user" | "provider")
                  }
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user" className="cursor-pointer flex-1">
                      <div className="font-medium">Book services</div>
                      <div className="text-sm text-muted-foreground">
                        Plan events and hire providers
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                    <RadioGroupItem value="provider" id="provider" />
                    <Label htmlFor="provider" className="cursor-pointer flex-1">
                      <div className="font-medium">Offer services</div>
                      <div className="text-sm text-muted-foreground">
                        Showcase portfolio and get hired
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {role === "provider" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience (Years)</Label>
                    <Input
                      id="experience"
                      type="text"
                      placeholder="e.g., 5 years"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required={role === "provider"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Your business address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required={role === "provider"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Valid ID (Aadhar Card)</Label>
                    <Input
                      id="aadhar"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleAadharChange}
                      required={role === "provider"}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Upload a clear photo of your Aadhar card (Max 1MB)
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) =>
                    setAcceptedTerms(checked as boolean)
                  }
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I accept the{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="text-primary font-medium hover:underline"
                      >
                        Terms & Conditions
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Terms & Conditions</DialogTitle>
                        <DialogDescription>
                          Please read our terms and conditions carefully
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 text-sm">
                        <section>
                          <h3 className="font-semibold text-base mb-2">
                            About Moments
                          </h3>
                          <p className="text-muted-foreground">
                            Moments ("we", "our", "us") is an online event
                            discovery and management platform that helps people
                            organize events such as weddings, parties, concerts,
                            and celebrations by connecting them with vendors
                            (decorators, photographers, caterers, etc.) and
                            performers (singers, dancers, entertainers, etc.).
                            Moments acts as a facilitator and payment
                            intermediary. Users make payments to Moments through
                            the platform, and Moments subsequently transfers the
                            applicable amount to the respective vendors or
                            performers as per agreed terms.
                          </p>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">
                            Terms & Conditions
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            Last Updated: November 2025
                          </p>
                          <p className="text-muted-foreground">
                            By accessing or using the Moments website or
                            services, you agree to comply with these Terms &
                            Conditions. If you do not agree, please do not use
                            the platform.
                          </p>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            1. Eligibility & Platform Usage
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>
                              You must be at least 18 years old, or have
                              permission from a parent or legal guardian.
                            </li>
                            <li>
                              You must have the legal capacity to enter into
                              agreements.
                            </li>
                            <li>
                              You agree to provide accurate, truthful, and
                              complete information while using the platform.
                            </li>
                          </ul>
                          <p className="text-muted-foreground mt-2">
                            You may browse vendor profiles, view talent
                            listings, share event requirements, and make
                            bookings through the platform. You are responsible
                            for ensuring the accuracy of your booking details.
                          </p>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            2. Roles & Responsibilities
                          </h4>
                          <p className="font-medium mb-1">
                            For Users (Event Organizers):
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                            <li>
                              Moments enables you to discover and book vendors
                              and performers.
                            </li>
                            <li>
                              Payments for bookings are made to Moments through
                              the platform.
                            </li>
                            <li>
                              Moments transfers payments to the respective
                              service providers after confirmation, subject to
                              applicable policies.
                            </li>
                            <li>
                              Moments is not responsible for the actual service
                              delivery, quality, delays, or performance once
                              payment is transferred.
                            </li>
                          </ul>
                          <p className="font-medium mb-1">
                            For Vendors & Performers:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>
                              You must provide accurate information regarding
                              pricing, availability, and services.
                            </li>
                            <li>You agree to receive payments via Moments.</li>
                            <li>
                              You are solely responsible for fulfilling the
                              services booked by users.
                            </li>
                            <li>
                              Fake listings, false reviews, misrepresentation,
                              or copyright violations may result in suspension
                              or removal from the platform.
                            </li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            3. Payments & Settlement
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>
                              All payments for bookings must be made through
                              Moments.
                            </li>
                            <li>
                              Moments may hold payments temporarily for
                              verification, dispute resolution, or cancellation
                              windows.
                            </li>
                            <li>
                              Payouts to vendors or performers will be made
                              after confirmation of booking or service
                              milestones, as defined by Moments.
                            </li>
                            <li>
                              Moments may deduct applicable platform fees,
                              taxes, or charges before transferring payments.
                            </li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            4. Content Ownership & Acceptable Use
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                            <li>
                              You retain ownership of the content you upload.
                            </li>
                            <li>
                              By uploading content, you grant Moments permission
                              to display, promote, and share it on our platform
                              and marketing channels (with appropriate credit).
                            </li>
                            <li>
                              We reserve the right to remove content that
                              violates laws or platform policies.
                            </li>
                          </ul>
                          <p className="font-medium mb-1">
                            Prohibited Content Includes:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>
                              Hate speech, harassment, or misleading information
                            </li>
                            <li>Nudity, offensive, or illegal material</li>
                            <li>
                              Copyrighted material used without permission
                            </li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            5. Disclaimers & Limitation of Liability
                          </h4>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>
                              Moments does not guarantee service quality,
                              outcomes, or event success.
                            </li>
                            <li>
                              While Moments facilitates payments, service
                              execution remains the responsibility of vendors
                              and performers.
                            </li>
                            <li>
                              Moments is not liable for losses, damages, or
                              disputes arising after payout to the service
                              provider.
                            </li>
                            <li>
                              The platform is provided on an "as-is" basis
                              without warranties of uninterrupted or error-free
                              operation.
                            </li>
                          </ul>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            6. Account Termination & Content Removal
                          </h4>
                          <p className="text-muted-foreground">
                            Moments reserves the right to suspend or terminate
                            accounts or remove content that:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            <li>Violates these Terms & Conditions, or</li>
                            <li>Misuses the platform in any manner.</li>
                          </ul>
                          <p className="text-muted-foreground mt-2">
                            Removed content may still exist in backups or
                            promotional materials created before removal.
                          </p>
                        </section>

                        <section>
                          <h4 className="font-semibold mb-2">
                            7. Governing Law & Jurisdiction
                          </h4>
                          <p className="text-muted-foreground">
                            These Terms are governed by the laws of India. Any
                            disputes shall be subject to the jurisdiction of
                            courts in Bengaluru, Karnataka.
                          </p>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">
                            Privacy Policy
                          </h3>
                          <p className="text-muted-foreground mb-3">
                            Your privacy is important to us. We collect only the
                            information necessary to operate and improve our
                            platform.
                          </p>
                          <p className="font-medium mb-1">
                            Information We Collect
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                            <li>
                              Personal details such as name, email address, and
                              contact information
                            </li>
                            <li>
                              Payment-related details processed securely through
                              authorized payment gateways
                            </li>
                            <li>Event-related details shared by users</li>
                            <li>Vendor and performer profile information</li>
                          </ul>
                          <p className="font-medium mb-1">
                            How We Use Information
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                            <li>To process bookings and payments</li>
                            <li>
                              To transfer payouts to vendors and performers
                            </li>
                            <li>
                              To improve platform functionality and user
                              experience
                            </li>
                            <li>
                              To communicate important updates or support
                              responses
                            </li>
                          </ul>
                          <p className="text-muted-foreground">
                            We do not sell personal data. Reasonable security
                            measures are taken to protect user information.
                          </p>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">
                            Refund Policy
                          </h3>
                          <p className="text-muted-foreground mb-2">
                            Unless explicitly stated otherwise:
                          </p>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                            <li>
                              Payments made to Moments are generally
                              non-refundable once transferred to the service
                              provider.
                            </li>
                            <li>
                              Refund eligibility depends on the vendor or
                              performer's individual refund policy.
                            </li>
                          </ul>
                          <p className="text-muted-foreground">
                            If a booking is cancelled before payout, refunds may
                            be processed after applicable deductions, subject to
                            Moments' discretion and payment gateway charges.
                          </p>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">
                            Cancellation Policy
                          </h3>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground mb-3">
                            <li>
                              Cancellations must be requested through the
                              Moments platform.
                            </li>
                            <li>
                              Cancellation terms are defined by the respective
                              vendor or performer.
                            </li>
                            <li>
                              Moments may facilitate communication and
                              settlement but does not guarantee refunds unless
                              specified.
                            </li>
                          </ul>
                          <p className="text-muted-foreground">
                            Users are strongly advised to review cancellation
                            terms before confirming a booking.
                          </p>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">
                            Contact Us
                          </h3>
                          <p className="text-muted-foreground">
                            If you have any questions, concerns, or issues
                            related to these policies, please contact us at:
                          </p>
                          <p className="text-muted-foreground mt-1">
                            Email:{" "}
                            <a
                              href="mailto:ashekday@gmail.com"
                              className="text-primary hover:underline"
                            >
                              ashekday@gmail.com
                            </a>
                          </p>
                        </section>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !acceptedTerms}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link
                href="/auth/signin"
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
