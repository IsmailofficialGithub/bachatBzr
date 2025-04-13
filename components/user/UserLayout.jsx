"use client";
import React, { useEffect, useState } from "react";
import UserSidebar from "@/components/user/UserSidebar";
import theme from "@/data";
import "@/public/assets/css/tailwind-cdn.css";
import UserNotLogin from "@/components/user/UserNotLogin";
import { useSelector } from "react-redux";
export default function UserLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(false);
  const user = useSelector((state) => state.auth.session);
  //   try {
  //     const session = await dispatch(fetchAuthSession());
  //     if (session.payload) {
  //       setSession(true);
  //       console.log("session ture")
  //     } else {
  //       setSession(false);
  //       console.log("session false")
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch session:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchSession();
  // }, []);
  useEffect(() => {
    if (user) {
      setSession(true);
    } else {
      setSession(false);
    }
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Hamburger button for mobile and medium screens */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">
            {title ? title : "User"}
          </span>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div
            className="w-full lg:w-1/4 lg:min-h-[600px]"
            style={{ background: theme.color.secondary }}
          >
            <UserSidebar isOpen={sidebarOpen} />
          </div>

          {/* Main Content */}
          <div
            className="w-full lg:w-3/4 p-6 lg:p-8 bg-gray-50"
            style={{ background: theme.color.primary }}
          >
            {session?children:<UserNotLogin/>}
          </div>
        </div>
      </div>
    </div>
  );
}
