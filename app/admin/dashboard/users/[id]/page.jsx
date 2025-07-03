"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import DashboardWrapper from "@/app/components/DashboardWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccessToken } from "@/util/getAccessToken";

const UserDetails = () => {
  const params = useParams();

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState({
    mainLoading: false,
    roleLoading: false,
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!params?.id) return;

      setLoading((prev) => ({ ...prev, mainLoading: true }));

      try {
        const session = await getAccessToken();
        const response = await axios.get(`/api/user/singleUser/${params.id}`,{
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setUser(response.data.user);
          setMessage(response.data.message);
        } else {
          toast.error("Something went wrong", {
            description: response.data.error,
          });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to fetch user", { description: error.message });
      } finally {
        setLoading((prev) => ({ ...prev, mainLoading: false }));
      }
    };

    fetchUser();
  }, [params?.id]);

  // Set role when user data is available
  useEffect(() => {
    if (user?.user_metadata?.role) {
      setRole(user.user_metadata.role);
    }
  }, [user]);

  // Handle role change
  const handleChange = async (value) => {
    const confirmation = prompt(`Type "${value}" to confirm role change:`);

    if (confirmation !== value) return;

    setLoading((prev) => ({ ...prev, roleLoading: true }));
  const session=await getAccessToken()
    try {
      const response = await axios.post("/api/user/setRole", {
        userId: params.id,
        role: value,
      },{
          headers: {
            Authorization: `Bearer ${session}`,
            "Content-Type": "application/json",
          },
      }
    );

      if (response.data.success) {
        setRole(value);
        toast.success("Role updated successfully");
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      console.error("Role update error:", error);
      toast.error("Failed to update role");
    } finally {
      setLoading((prev) => ({ ...prev, roleLoading: false }));
    }
  };

  return (
    <DashboardWrapper>
      <div className="flex flex-row justify-between items-center mt-8">
        <h1 className="text-2xl font-semibold">User Details</h1>

        <Select value={role} onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Change Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="user">User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {message && <p className="text-green-500 font-medium mt-2">{message}</p>}

      {loading.mainLoading ? (
        <p className="mt-4">Loading...</p>
      ) : user ? (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-600" style={{background: "#4B5563"}}>
          {Object.entries(user).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
              {typeof value === "object" && value !== null ? (
                <pre className="bg-gray-500 p-2 rounded text-sm overflow-x-auto">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <span className="text-gray-300">{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No user found.</p>
      )}
    </DashboardWrapper>
  );
};

export default UserDetails;
