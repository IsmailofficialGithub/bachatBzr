"use client";
import React, { useEffect, useState } from "react";
import UserSidebar from "@/components/user/UserSidebar";
import theme from "@/data";
import "@/public/assets/css/tailwind-cdn.css";
import UserNotLogin from "@/components/user/UserNotLogin";
import { useDispatch } from "react-redux";
import { fetchAuthSession } from "@/features/auth/authSlice";

export default function UserLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState(false);
  const dispatch = useDispatch();

  const fetchSession = async () => {
    try {
      const session = await dispatch(fetchAuthSession());
      if (session.payload) {
        setSession(true);
      } else {
        setSession(false);
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="max-w-[90%] mx-auto lg:px-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
        {/* Hamburger button for mobile and medium screens */}
        <div className="lg:hidden p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">
            {title ? title : "User"}
          </span>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center w-10 h-10 text-blue-600 focus:outline-none z-50 relative"
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

        {/* Overlay for mobile/tablet when sidebar is open */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
          ></div>
        )}

        <div className="flex flex-col lg:flex-row relative">
          {/* Sidebar for large screens (always visible) */}
          <div
            className="hidden lg:block w-1/4 lg:min-h-[600px]"
            style={{ background: theme.color.secondary }}
          >
            <UserSidebar isOpen={true} />
          </div>

          {/* Slide-in Sidebar for mobile and medium screens */}
          <div
            className={`lg:hidden fixed top-0 right-0 h-full w-80 sm:w-96 transform transition-transform duration-300 ease-in-out z-50 ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ background: theme.color.secondary }}
          >
            {/* Close button inside sidebar */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800">Menu</span>
              <button
                onClick={closeSidebar}
                className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Close menu"
              >
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
              </button>
            </div>
            <UserSidebar isOpen={sidebarOpen} />
          </div>

          {/* Main Content */}
          <div
            className="w-full lg:w-3/4 p-3 lg:p-8 bg-gray-50 min-h-[600px]"
            style={{ background: theme.color.primary }}
          >
            {session ? children : <UserNotLogin />}
          </div>
        </div>
      </div>
    </div>
  );
}