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
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  User,
  LogOut,
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { usersAPI, bookingsAPI, providersAPI } from "@/lib/api";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "user" | "provider" | "admin";
  status: "active" | "suspended" | "pending";
  joinedDate: string;
}

interface ProviderData {
  id: string;
  uid: string;
  businessName: string;
  email: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

interface BookingData {
  id: number;
  userName: string;
  providerName: string;
  eventType: string;
  date: string;
  status: "pending" | "confirmed" | "rejected" | "completed";
  amount: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, userRole, loading, signOut } = useAuth();
  const [adminName, setAdminName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [providers, setProviders] = useState<ProviderData[]>([]);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    pendingProviders: 0,
    totalBookings: 0,
    revenue: "$0",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
      return;
    }

    if (!loading && userRole && userRole !== "admin") {
      router.push("/user/dashboard");
      return;
    }

    if (user) {
      setAdminName(user.displayName || user.email?.split("@")[0] || "Admin");

      // Load users from backend
      const loadUsers = async () => {
        try {
          const data = await usersAPI.getAll();
          const usersList = data.users || [];
          setUsers(usersList);

          // Load providers
          const providersData = await providersAPI.getAll();
          const providersList = providersData.providers || [];
          setProviders(providersList);

          // Load bookings from backend
          const bookingsData = await bookingsAPI.getAll();
          const bookingsList = bookingsData.bookings || [];
          setBookings(bookingsList);

          // Calculate stats
          setStats({
            totalUsers: usersList.filter((u: any) => u.role === "user").length,
            totalProviders: providersList.length,
            pendingProviders: providersList.filter(
              (p: any) => p.status === "pending"
            ).length,
            totalBookings: bookingsList.length,
            revenue: "$0",
          });
        } catch (error: any) {
          console.error("Error loading admin data:", error);
          // If forbidden, the admin claim might not be set
          if (
            error.message?.includes("Forbidden") ||
            error.message?.includes("Admin")
          ) {
            alert(
              "Admin access not configured. Please set the admin claim using the backend API:\n\n" +
                `POST http://localhost:5000/api/auth/set-admin/${user.uid}\n` +
                `Body: {"adminSecret": "your-admin-secret"}\n\n` +
                "Then sign out and sign in again."
            );
          }
        }
      };
      loadUsers();
    }
  }, [user, userRole, loading, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleProviderApproval = async (
    providerId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      await providersAPI.updateStatus(providerId, status);

      // Update local state
      setProviders((prev) =>
        prev.map((p) => (p.id === providerId ? { ...p, status } : p))
      );

      // Update stats
      setStats((prev) => ({
        ...prev,
        pendingProviders: providers.filter(
          (p) => p.id !== providerId && p.status === "pending"
        ).length,
      }));

      alert(`Provider ${status} successfully`);
    } catch (error) {
      console.error("Error updating provider status:", error);
      alert("Failed to update provider status");
    }
  };

  const handleUserAction = (
    userId: number,
    action: "suspend" | "activate" | "delete"
  ) => {
    if (action === "delete") {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? { ...u, status: action === "suspend" ? "suspended" : "active" }
            : u
        )
      );
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      case "provider":
        return "bg-primary/10 text-primary";
      default:
        return "bg-secondary/50 text-secondary-foreground";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
      case "confirmed":
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "suspended":
      case "rejected":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-secondary/50 text-secondary-foreground";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredBookings = bookings.filter(
    (booking) =>
      (booking.userName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (booking.providerName?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (booking.eventType?.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

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
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium hidden sm:inline">
                  {adminName}
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
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage users, providers, and platform activity
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">{stats.totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Active clients</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Service Providers</CardDescription>
              <CardTitle className="text-3xl">{stats.totalProviders}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>Registered providers</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
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
              <CardDescription>Platform Revenue</CardDescription>
              <CardTitle className="text-3xl">{stats.revenue}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span>Total earnings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Platform Management</CardTitle>
                <CardDescription>
                  Manage users, providers, and bookings
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="users">
              <TabsList className="mb-4">
                <TabsTrigger value="users">
                  Users ({users.filter((u) => u.role === "user").length})
                </TabsTrigger>
                <TabsTrigger value="providers">
                  Providers ({providers.length})
                  {stats.pendingProviders > 0 && (
                    <Badge className="ml-2 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                      {stats.pendingProviders} pending
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="bookings">
                  Bookings ({bookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                {filteredUsers.filter((u) => u.role === "user").length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredUsers
                      .filter((u) => u.role === "user")
                      .map((user) => (
                        <Card key={user.id} className="border-2">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground truncate">
                                    {user.name}
                                  </p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge
                                  className={getStatusBadgeColor(user.status)}
                                >
                                  {user.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {user.status === "active" ? (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUserAction(user.id, "suspend")
                                        }
                                      >
                                        Suspend User
                                      </DropdownMenuItem>
                                    ) : (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleUserAction(user.id, "activate")
                                        }
                                      >
                                        Activate User
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUserAction(user.id, "delete")
                                      }
                                      className="text-red-600 dark:text-red-400"
                                    >
                                      Delete User
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="providers" className="space-y-4">
                {providers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No providers found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {providers
                      .filter(
                        (provider) =>
                          (provider.businessName?.toLowerCase() || "").includes(
                            searchQuery.toLowerCase()
                          ) ||
                          (provider.email?.toLowerCase() || "").includes(
                            searchQuery.toLowerCase()
                          )
                      )
                      .map((provider) => (
                        <Card key={provider.id} className="border-2">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground truncate">
                                    {provider.businessName}
                                  </p>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {provider.email}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {provider.category} • Joined{" "}
                                    {format(
                                      new Date(provider.createdAt),
                                      "MMM d, yyyy"
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge
                                  className={
                                    provider.status === "approved"
                                      ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                      : provider.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                      : "bg-red-500/10 text-red-700 dark:text-red-400"
                                  }
                                >
                                  {provider.status}
                                </Badge>
                                {provider.status === "pending" && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                      onClick={() =>
                                        handleProviderApproval(
                                          provider.id,
                                          "approved"
                                        )
                                      }
                                    >
                                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                      Approve
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                      onClick={() =>
                                        handleProviderApproval(
                                          provider.id,
                                          "rejected"
                                        )
                                      }
                                    >
                                      <XCircle className="h-3.5 w-3.5 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map((booking) => (
                      <Card key={booking.id} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-medium text-foreground">
                                  {booking.eventType}
                                </p>
                                <Badge
                                  className={getStatusBadgeColor(
                                    booking.status
                                  )}
                                >
                                  {booking.status === "confirmed" && (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {booking.status === "rejected" && (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                <p>
                                  <span className="font-medium text-foreground">
                                    Client:
                                  </span>{" "}
                                  {booking.userName}
                                </p>
                                <p>
                                  <span className="font-medium text-foreground">
                                    Provider:
                                  </span>{" "}
                                  {booking.providerName}
                                </p>
                                <p>
                                  <span className="font-medium text-foreground">
                                    Date:
                                  </span>{" "}
                                  {format(
                                    new Date(booking.date),
                                    "MMM d, yyyy"
                                  )}
                                </p>
                                <p>
                                  <span className="font-medium text-foreground">
                                    Amount:
                                  </span>{" "}
                                  {booking.amount}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
