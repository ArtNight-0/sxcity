"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UserCircle,
  LogOut,
  Home,
  BarChart2,
  FileText,
  Settings,
  Calculator,
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Sidebar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.log("No token found");
          setIsLoading(false);
          return;
        }

        console.log("Fetching with token:", token);

        // Gunakan endpoint internal Next.js
        const response = await fetch("/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Response data:", data);

        if (data?.status === "success") {
          setUser(data.data.user);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error instanceof Error) {
          if (error.message.includes("401")) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
          }
        }
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        // Panggil endpoint logout
        await fetch("http://sccic-ssoserver.test/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
  };

  if (isLoading) {
    return <div className="w-64 h-screen bg-gray-800 animate-pulse" />;
  }

  return (
    <div className="w-64 h-screen bg-white border-r fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      {/* User Info */}
      <div className="p-4 border-b">
        {user ? (
          <div className="flex items-center space-x-3">
            <UserCircle size={32} className="text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
              <p className="text-xs text-gray-400 capitalize">
                Role: {user.role}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <UserCircle size={20} />
            <span>Login</span>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Home size={18} />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/statistik"
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <BarChart2 size={18} />
          <span>Statistik</span>
        </Link>
        <Link
          href="/laporan"
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <FileText size={18} />
          <span>Laporan</span>
        </Link>
        <Link
          href="/pengaturan"
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Settings size={18} />
          <span>Pengaturan</span>
        </Link>
        <Link
          href="/gdp"
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <Calculator size={18} />
          <span>GDP Calculator</span>
        </Link>
      </nav>

      {/* Logout Button */}
      {user && (
        <div className="p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}
