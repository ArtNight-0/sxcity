"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");

        if (!code) {
          throw new Error("Authorization code not found");
        }

        // Gunakan API route internal
        const response = await axios.post("/api/auth/token", {
          code,
        });

        if (response.data?.access_token) {
          Cookies.set("token", response.data.access_token, {
            expires: 1,
            path: "/",
          });
          localStorage.setItem("access_token", response.data.access_token);
          router.push("/dashboard");
        } else {
          throw new Error("No access token received");
        }
      } catch (error) {
        console.error("SSO Callback error:", error);
        router.push("/login?error=sso_failed");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Processing SSO Login...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}
