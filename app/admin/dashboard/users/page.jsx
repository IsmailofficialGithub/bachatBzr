"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader, Search, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabaseSetup";
import { getAccessToken } from "@/util/getAccessToken";

const Users = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [role, setRole] = useState("all");

  const handleChange = async (value) => {
    setRole(value);
    const accessToken = await getAccessToken();
    try {
      const response = await axios.get(
        `/api/user/filter`, // Your backend API route
        {
          params: {
            role: value === "all" ? "" : value, // Leave empty if "all"
            page: page, // Page number
            limit: 10, // Items per page
          },
          withCredentials: true, // Include cookies if needed
          headers: {
            Authorization: `Bearer ${accessToken}`, // Auth token
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        if (response.data.users.length > 0) {
          toast.success(`Successfully filtered ${value}s`);
          setUsers(response.data.users);
        } else {
          toast.info(`No ${value} users found`);
          setUsers(response.data.users);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to filter users" + error.message);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast.error("Please login first");
      router.push("/authentication");
      return;
    }
    try {
      const response = await axios.get(
        `/api/user/get?page=${page}&pageSize=25`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.success) {
        setTotalPages(response.data.pagination.totalPages);
        setUsers(response.data.users);
      } else {
        toast.error("Failed to get users", {
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to get users", { description: "Internal error" });
    }
    setLoading(false);
  };

  const searchUser = async () => {
    try {
      setLoading(true);
      if (searchQuery === "") {
        return toast.info("Please provide search criteria");
      }
      const token = await getAccessToken();
      const response = await axios.get(
        `/api/user/search?query=${searchQuery}&page=${page}&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.data.success) {
        if (response.data.users.length > 0) {
          toast.success("Users found");
          setUsers(response.data.users);
        } else {
          toast.info("No users found matching your criteria");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Search failed", {
        description: `Error while searching: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>;
      case "user":
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage your platform users and their permissions
            </p>
          </div>
          <Button onClick={() => router.push("/admin/dashboard/users/add")}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>
                  {users.length} {users.length === 1 ? "user" : "users"} found
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder="Search by email or phone..."
                    className="pl-9"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchUser()}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={role} onValueChange={handleChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Administrators</SelectItem>
                      <SelectItem value="user">Regular Users</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={searchUser} disabled={loading}>
                    {loading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="mr-2 h-4 w-4" />
                    )}
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <Loader className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <Search className="w-8 h-8 text-muted-foreground" />
                <p className="text-muted-foreground">No users found</p>
                <Button variant="outline" onClick={fetchUsers}>
                  Reset filters
                </Button>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="w-[60px]">User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Last Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-muted/50 cursor-pointer"
                          onClick={() =>
                            router.push(`/admin/dashboard/users/${user.id}`)
                          }
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    user.user_metadata?.avatar_url ||
                                    user.user_metadata?.picture ||
                                    user.user_metadata?.avatar
                                  }
                                />
                                <AvatarFallback>
                                  {getInitials(
                                    user.user_metadata?.name ||
                                      user.user_metadata?.full_name ||
                                      user.email,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex flex-col">
                              <span>{user.email}</span>
                              {user.user_metadata?.phone && (
                                <span className="text-xs text-muted-foreground">
                                  {user.user_metadata.phone}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {getRoleBadge(
                              user.user_metadata?.role ||
                                user.app_metadata?.role,
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(user.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.last_sign_in_at ? (
                              <div className="flex flex-col">
                                <span>
                                  {new Date(
                                    user.last_sign_in_at,
                                  ).toLocaleDateString()}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    user.last_sign_in_at,
                                  ).toLocaleTimeString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">
                                Never logged in
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={page === 1}
                          />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                          <PaginationItem key={index}>
                            <PaginationLink
                              onClick={() => setPage(index + 1)}
                              isActive={page === index + 1}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setPage((prev) => Math.min(totalPages, prev + 1))
                            }
                            disabled={page >= totalPages}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
};

export default Users;
