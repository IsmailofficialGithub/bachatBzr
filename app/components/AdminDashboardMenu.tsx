// app/layout.tsx
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";

export default function AdminDashboardMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Users", href: "/admin/dashboard/users" },
    { name: "Products", href: "/admin/dashboard/products" },
    { name: "Orders", href: "/admin/dashboard/orders" },
    { name: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-100 w-full">
        {/* Mobile Hamburger Button */}
        {isOpen ? (
          ""
        ) : (
          <button
            className="md:hidden fixed top-2 right-2 p-2 z-50"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Sidebar */}
        <div
          className={`fixed md:relative z-40 w-60 h-screen bg-orange-400 shadow-lg transform transition-transform duration-200 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="p-4">
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">
                Admin Panel
              </h1>
              <X
                className={`font-bold cursor-pointer ${
                  isOpen ? "block" : "hidden"
                }`}
                onClick={() => {
                  setIsOpen(false);
                }}
              />
            </div>
            <nav>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-2 mb-2 rounded-lg transition-colors
                  ${
                    pathname === item.href
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
      </div>
    </>
  );
}
