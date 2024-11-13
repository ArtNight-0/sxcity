"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

// Fungsi untuk generate random string
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data?.data?.access_token) {
        Cookies.set("token", response.data.data.access_token, {
          expires: 1,
          path: "/",
        });

        console.log("Token saved in cookies");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login gagal. Silakan cek email dan password Anda.");
    }
  };

  const handleSSOLogin = async () => {
    try {
      // Cek dulu status login di SSO server
      const checkResponse = await axios
        .get("http://sccic-ssoserver.test/api/auth/profile", {
          withCredentials: true,
        })
        .catch(() => null);
      console.log(checkResponse);

      if (checkResponse?.data?.user) {
        // Jika sudah login di SSO, langsung minta token
        const tokenResponse = await axios.post(
          "http://sccic-ssoserver.test/oauth/token",
          {
            grant_type: "password",
            client_id: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_SSO_CLIENT_SECRET,
            username: checkResponse.data.user.email,
          }
        );

        if (tokenResponse.data?.access_token) {
          Cookies.set("token", tokenResponse.data.access_token, {
            expires: 1,
            path: "/",
          });
          router.push("/dashboard");
          return;
        }
      }

      // Jika belum login, lanjut ke flow SSO normal
      const state = generateState();
      Cookies.set("oauth_state", state, {
        expires: 1 / 24,
        path: "/",
        sameSite: "lax",
      });

      const ssoParams = {
        client_id: process.env.NEXT_PUBLIC_SSO_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_SSO_REDIRECT_URI,
        response_type: "code",
        scope: "*",
        state: state,
      };

      const ssoUrl =
        "http://sccic-ssoserver.test/oauth/authorize?" +
        new URLSearchParams(ssoParams).toString();

      window.location.href = ssoUrl;
    } catch (error) {
      console.error("SSO Login error:", error);
    }
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

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Atau</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSSOLogin}
              className="w-full inline-flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Login dengan SSO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
