"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const savedState = localStorage.getItem("oauth_state");

      if (state !== savedState) {
        console.error("State tidak cocok");
        await router.push("/login");
        return;
      }

      try {
        const tokenResponse = await axios.post("/api/auth/token", {
          grant_type: "authorization_code",
          client_id: "9d6a2e59-525a-4825-a921-ba02d51cc4af",
          client_secret: "SW6goTFgpX0744WQFzTrHTEwm60na4m6V7SXW3wm",
          redirect_uri: "http://localhost:3000/auth/callback",
          code: code,
        });

        console.log("Token response:", tokenResponse.data);

        if (tokenResponse.data.access_token) {
          localStorage.setItem("access_token", tokenResponse.data.access_token);

          try {
            const userResponse = await axios
              .get("/api/auth/profile", {
                headers: {
                  Authorization: `Bearer ${tokenResponse.data.access_token}`,
                },
              })
              .catch((error) => {
                console.error("Profile request failed:", {
                  status: error.response?.status,
                  data: error.response?.data,
                  headers: error.response?.headers,
                });
                throw error;
              });

            console.log("User data:", userResponse.data);

            if (
              userResponse.data.status === "success" &&
              userResponse.data.data
            ) {
              localStorage.setItem(
                "user",
                JSON.stringify(userResponse.data.data)
              );
              console.log("Login SSO berhasil, redirect ke dashboard...");

              await router.replace("/dashboard");
              window.location.href = "/dashboard";
            } else {
              throw new Error("Invalid profile response format");
            }
          } catch (userError: any) {
            console.error("Error saat mengambil data user:", {
              message: userError.message,
              response: userError.response,
            });
            await router.push("/login");
          }
        }
      } catch (error: any) {
        console.error("Error saat pertukaran token:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        await router.push("/login");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold">Memproses autentikasi SSO...</h2>
        <p className="mt-2">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
}
