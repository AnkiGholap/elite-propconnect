"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Properties", href: "/admin/properties", icon: "🏠" },
  { label: "Leads", href: "/admin/leads", icon: "👥" },
  { label: "Categories", href: "/admin/categories", icon: "📁" },
  { label: "Users", href: "/admin/users", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("Admin");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        setUsername(user.username || "Admin");
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300`}>
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-amber-400 font-bold text-xl">
            {sidebarOpen ? "Elite PropConnect" : "EP"}
          </h1>
          {sidebarOpen && <p className="text-gray-400 text-sm mt-1">Admin Panel</p>}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-white text-sm w-full text-center"
          >
            {sidebarOpen ? "← Collapse" : "→"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">
            Welcome, <span className="text-amber-400">{username}</span>!
          </h2>
          <div className="flex items-center gap-4">
            <Link href="/home" className="text-gray-400 hover:text-white text-sm">
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
