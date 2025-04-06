"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
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
import { Loader, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";


const Users = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState("all");
  const handleChange = async (value: string) => {
    setRole(value);

    try {
      const response = await axios.get(
        `/api/user/filter?role=${value ==='all'?'':value}&page=${page}&limit=10`,
      );
      if (response.data.success) {
        if (response.data.users.length > 0) {
          toast(`SuccessFully getting ${value}s data `);
          setUsers(response.data.users);
        } else {
          toast(` No ${value} found `);
          setUsers(response.data.users);
        }
      }
    } catch (error) {
      console.log(error);
      toast("Failed to get Filter user");
    }
  };
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/user/get?page=${page}&pageSize=${15}`,
      );
      if (response.data.success) {
        setTotalPages(response.data.pagination.totalPages);
        setUsers(response.data.users);
      } else {
        toast("Failed to Get user", { description: response.data.message });
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast("Failed to Get user", { description: "Internel error" });
    }
    setLoading(false);
  };

  const searchUser = async () => {
    try {
      setLoading(true);
      if (searchQuery === "") {
        return toast("Please provide some Metadata...");
      }
      const response = await axios.get(
        `/api/user/search?query=${searchQuery}&page=${page}&pageSize=${10}`,
      );
      if (response.data.success) {
        if (response.data.users.length > 0) {
          toast("SuccessFully getting user");
          setUsers(response.data.users);
        } else {
          toast("404 No user found");
        }
      }
    } catch (error) {
      console.log(error);
      toast("Failed to search user", {
        description: `Error while fetching user ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  return (
    <DashboardWrapper>
      <div className="flex flex-row gap-3 justify-between item-center mb-3  ">
        <h1 className="text-3xl">User</h1>
      </div>
      <div className="flex flex-row gap-3 w-[auto] justify-between mb-3 flex-wrap">
        <div className="flex flex-row gap-1 items-center flex-nowrap w-full sm:w-auto ">
          <Input
            className="w-full"
            placeholder="Search by Email or phone"
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <Search
              className="cursor-pointer hover:text-slate-400"
              onClick={searchUser}
            />
          )}
        </div>
        <div className="flex flex-row gap-2 justify-between  w-full sm:w-auto">
          <div className="w-auto">
            <Select
              value={role}
              onValueChange={handleChange}
              defaultValue="All"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant={"default"}>Add User</Button>
        </div>
      </div>

      {/* Right side */}

      <div>
        <p>Products : {users.length}</p>
      </div>
      {loading ? (
        <div className="flex  justify-center min-h-screen ">
          L <Loader className="w-16 h-16 animate-spin text-blue-500" /> ading
          ....
        </div>
      ) : (
        <Table>
          <TableCaption>A list of all available products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Index</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>CreateAt</TableHead>
              <TableHead>Last Login</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, index) => (
              <TableRow
                key={index}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`/admin/dashboard/users/${user.id}`);
                }}
              >
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user?.user_metadata?.role}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination className="text-black mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => setPage(index + 1)}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DashboardWrapper>
  );
};

export default Users;
