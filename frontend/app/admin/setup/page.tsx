"use client";

import { useState } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Shield, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminSetupPage() {
  const [uid, setUid] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/set-admin/${uid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminSecret }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set admin claim");
      }

      setSuccess(true);
      setUid("");
      setAdminSecret("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-background to-blue-50 dark:from-gray-900 dark:via-background dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-3xl font-bold">Moment</span>
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl font-bold">Admin Setup</h1>
          </div>
          <p className="text-muted-foreground">
            Set admin claim for Firebase user
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Configure Admin Access</CardTitle>
            <CardDescription>
              Enter the Firebase user UID and admin secret to grant admin
              privileges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Admin claim set successfully! Please sign out and sign in
                  again for changes to take effect.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSetupAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uid">Firebase User UID</Label>
                <Input
                  id="uid"
                  placeholder="e.g., abc123xyz456..."
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Get this from Firebase Console → Authentication → Users
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secret">Admin Secret</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="Enter admin secret from .env"
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use ADMIN_SECRET from backend/.env file
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Setting up..." : "Set Admin Claim"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-sm mb-2">Instructions:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Create admin user in Firebase Console</li>
                <li>Copy the UID from Authentication tab</li>
                <li>Get ADMIN_SECRET from backend/.env</li>
                <li>Submit this form to set admin claim</li>
                <li>Sign out and sign in to apply changes</li>
              </ol>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/auth/signin"
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
