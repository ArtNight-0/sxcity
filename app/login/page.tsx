"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

// Konfigurasi OAuth Laravel Passport
const OAUTH_CLIENT_ID = process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID || "";
const OAUTH_CLIENT_SECRET =
  process.env.NEXT_PUBLIC_PASSPORT_CLIENT_SECRET || "";
const OAUTH_REDIRECT_URI =
  process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI ||
  "http://localhost:3000/auth/callback";
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://sccic-ssoserver.test";

// Fungsi generate state untuk keamanan CSRF
const generateState = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Login tradisional
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Simpan token dari login standar
      if (response.data.access_token) {
        Cookies.set("token", response.data.access_token, {
          expires: 1,
          path: "/",
          sameSite: "strict",
        });
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login gagal. Silakan periksa email dan password."
      );
    }
  };

  // Login OAuth Laravel Passport
  const handleOAuthLogin = () => {
    // Generate state untuk keamanan
    const state = generateState();

    // Simpan state di cookies
    Cookies.set("oauth_state", state, {
      expires: 0.5 / 24, // Berlaku 30 menit
      sameSite: "strict",
    });

    // Parameter OAuth sesuai Laravel Passport
    const params = new URLSearchParams({
      client_id: OAUTH_CLIENT_ID,
      redirect_uri: OAUTH_REDIRECT_URI,
      response_type: "code",
      scope: "",
      state: state,
    });

    // Redirect ke halaman otorisasi
    window.location.href = `${BACKEND_URL}/oauth/authorize?${params.toString()}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Login
          </h2>
          {error && (
            <div className="mt-2 text-center text-sm text-red-600">{error}</div>
          )}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <button
            onClick={handleOAuthLogin}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login dengan OAuth
          </button>
        </div>
      </div>
    </div>
  );
}
