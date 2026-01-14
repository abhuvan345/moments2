"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { authAPI } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone?: string,
    role?: string,
    experience?: string,
    address?: string,
    aadharUrl?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      // Check if user profile exists in backend, create if not
      if (user) {
        try {
          // Force token refresh to get latest custom claims
          await user.getIdToken(true);
          const idTokenResult = await user.getIdTokenResult();

          // Check custom claims first
          let role = "user";
          if (idTokenResult.claims.admin) {
            role = "admin";
          } else if (idTokenResult.claims.provider) {
            role = "provider";
          }

          // Fetch user data from backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL?.replace(
              "/api",
              ""
            )}/api/users/${user.uid}`,
            {
              headers: {
                Authorization: `Bearer ${await user.getIdToken()}`,
              },
            }
          );

          if (response.status === 404) {
            // User doesn't exist in backend, create profile
            await authAPI.register({
              uid: user.uid,
              email: user.email!,
              name: user.displayName || user.email?.split("@")[0] || "User",
            });
            setUserRole(role);
          } else {
            const data = await response.json();
            console.log("User data from backend:", data);
            // Use custom claims role, fallback to backend role
            const backendRole = data.user?.role || data.role || role;
            console.log("Setting user role to:", backendRole);
            setUserRole(backendRole);
          }
        } catch (error) {
          console.error("Error checking/creating user profile:", error);
          setUserRole("user");
        }
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    phone?: string,
    role?: string,
    experience?: string,
    address?: string,
    aadharUrl?: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Create user profile in backend
    try {
      await authAPI.register({
        uid: user.uid,
        email: user.email!,
        name,
        phone,
        role: role || "user",
        experience,
        address,
        aadharUrl,
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      // Still allow login even if profile creation fails
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
