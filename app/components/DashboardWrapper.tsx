"use client";
import React, { FC, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminDashboardMenu from "./AdminDashboardMenu";
import "@/app/admin/dashboard/admin.css";
import { supabase } from "@/lib/supabaseSetup";

interface DashboardWrapperProps {
  children: ReactNode;
}

interface UserProfile {
  id: string;
  role: string;
  // Add other profile fields as needed
}

const DashboardWrapper: FC<DashboardWrapperProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // No session found, redirect to login
          router.push("/authentication?login=true"); // Adjust login path as needed
          return;
        }

        // Get user profile/role from your profiles table
        const { data: profile, error: profileError } = await supabase
          .from("users") // Adjust table name as needed
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          router.push("/authentication?login=true");
          return;
        }

        // Check if user has admin role
        if (profile?.role === "admin") {
          setIsAuthorized(true);
        } else {
          // User is not admin, redirect to user dashboard
          router.push("/user/dashboard");
          return;
        }
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/authentication?login=true");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserAccess();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          router.push("/authentication?login=true");
        } else if (event === "SIGNED_IN") {
          // Re-check user access when signed in
          checkUserAccess();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="adminAuthCheck-wrapper">
        <div className="adminAuthCheck-loading-container">
          <div className="adminAuthCheck-spinner"></div>
          <p className="adminAuthCheck-loading-text">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Only render dashboard if user is authorized
  if (!isAuthorized) {
    return null; // Component will redirect, so return null
  }

  return (
    <div className="dashboard-wrapper">
      <div className="sidebar">
        <AdminDashboardMenu />
      </div>
      <div className="main-content">{children}</div>
    </div>
  );
};

export default DashboardWrapper;