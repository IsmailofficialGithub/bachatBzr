"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserDetails = () => {
  const params = useParams();
  const [user, setUser] = useState(null); // Initialize state as null
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const [Loading,setLoading]=useState({mainLoading:false,roleLoading:false})

  //fetching users data
  useEffect(() => {
    const fetchingUser = async () => {
      if (!params.id) return; // Ensure params.id exists before making the request
      setLoading((prevState) => ({ ...prevState, mainLoading: true }));
      try {
        const response = await axios.get(`/api/user/singleUser/${params.id}`);
        if (response.data.success) {
          setUser(response.data.user);
          setMessage(response.data.message);
        } else {
          toast.error("Something went wrong", {
            description: response.data.error,
          });
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user", { description: error.message });
      }finally{
        setLoading((prevState) => ({ ...prevState, mainLoading: false }));
      }
    };
    fetchingUser();
  }, [params.id]); // Add dependency

  const handleChange = async (value: string) => {

    const conformationMessage = prompt(`Type "${value}" to change role`);
    if (conformationMessage === value) {
    try {
      setLoading((prevState) => ({ ...prevState, roleLoading: true }));
      const response = await axios.post("/api/user/setRole", {
        userId: params.id,
        role: value,
      });
      if (response.data.success) {
        setRole(value);
        toast("Update role successFully")
      }
    } catch (error) {
      console.log(error)
      toast("Falied to update role")
    }finally{
      setLoading((prevState) => ({ ...prevState, roleLoading: false }));
    }
    }
  };

  useEffect(() => {
    if (user?.user_metadata?.role) {
      setRole(user.user_metadata.role);
    }
  }, [user]);
  return (
    <DashboardWrapper>
      <div className="flex flex-row justify-between items-center mt-8">
        <h1 className="text-2xl">User Details</h1>
        <div>
          <Select value={role} onValueChange={handleChange} defaultValue="All">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Change Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {message && <p className="text-green-500 font-semibold">{message}</p>}
      {user ? (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-gray-600">
          {Object.entries(user).map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong className="capitalize">{key.replace(/_/g, " ")}:</strong>{" "}
              {typeof value === "object" && value !== null ? (
                <pre className="bg-gray-500 p-2 rounded">
                  {JSON.stringify(value, null, 2)}
                </pre>
              ) : (
                <span className="text-gray-400">{String(value)}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </DashboardWrapper>
  );
};

export default UserDetails;
