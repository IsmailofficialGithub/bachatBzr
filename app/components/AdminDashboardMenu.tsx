// app/layout.tsx or app/admin/dashboard/AdminDashboardMenu.tsx
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, X } from "lucide-react";
import "@/app/admin/dashboard/admin.css";

export default function AdminDashboardMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Products", href: "/admin/dashboard/products" },
    { name: "Orders", href: "/admin/dashboard/orders" },
    { name: "BLP", href: "/admin/dashboard/blp" },
    { name: "Users", href: "/admin/dashboard/users" },
    // { name: "Settings", href: "/admin/dashboard/settings" },
  ];

  return (
    <>
      <div className="admin-container">
        {/* Mobile Hamburger Button */}
        {!isOpen && (
          <button
            className="admin-hamburger-btn"
            onClick={() => setIsOpen(true)}
          >
            <svg
              className="admin-hamburger-icon"
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
        <div className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
          <div className="admin-sidebar-content">
            <div className="admin-header">
              <h1 className="admin-title">Admin Panel</h1>
              <h1 className="admin-title cursor-pointer" onClick={()=>{window.location.href='/'}}><Home/></h1>
              <X className="admin-close-btn" onClick={() => setIsOpen(false)} />
            </div>
            <nav>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`admin-nav-link ${
                    pathname === item.href ? "active" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
