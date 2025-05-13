"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import UserLayout from "@/components/user/UserLayout";
import UserGreeting from "@/components/user/UserGreeting";
import UserStats from "@/components/user/UserStats";
import UserQuickLinks from "@/components/user/UserQuickLinks";
import "@/public/assets/css/tailwind-cdn.css";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchAuthSession } from "@/features/auth/authSlice";
import { useDispatch } from "react-redux";
export default function Dashboard() {
  const [stats, setStats] = useState([]);
  const dispatch = useDispatch();
  const [user, setuser] = useState({email:"",name:""});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch the user ID from the Redux store or session
        const fetchedUser = await dispatch(fetchAuthSession());
        if (fetchedUser.payload?.user) {
          const userid = fetchedUser.payload.user.id;
          const user = {
            email: fetchedUser.payload.user.email,
            name:
              fetchedUser.payload.user.name ||
              fetchedUser.payload.user.user_metadata.name ||
              "",
          };
          setuser(user);
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/orders/user-stats`,
            {
              userId: userid,
            },
          );

          if (response.data.success) {
            setStats(response.data.stats);
          } else {
            toast.error("Failed to fetch user stats");
          }
        } else {
          return toast.error("User not found");
        }
      } catch (error) {
        toast.error("Error fetching user details");
      }
    };

    fetchDetails();
  }, []);

  const quickLinks = [
    { title: "Edit Profile", href: "/user/profile" },
    { title: "View Orders", href: "/user/orders" },
    { title: "View Wishlist", href: "/user/wishlist" },
    { title: "Manage Addresses", href: "/user/addresses" },
  ];

  return (
    <Layout headerStyle={3} footerStyle={1}>
      <UserLayout title={"My Account"}>
        <UserGreeting user={user} />
        <UserStats stats={stats} />
        <UserQuickLinks links={quickLinks} />
      </UserLayout>
    </Layout>
  );
}
