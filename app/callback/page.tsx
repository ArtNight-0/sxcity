"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "../services/auth.service";

export default function Callback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      authService
        .handleCallback(code)
        .then(() => {
          router.push("/"); // redirect ke homepage setelah login berhasil
        })
        .catch((error) => {
          console.error("Login error:", error);
          router.push("/login?error=auth_failed");
        });
    }
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2>Memproses autentikasi...</h2>
        {/* Tambahkan loading spinner jika diperlukan */}
      </div>
    </div>
  );
}
