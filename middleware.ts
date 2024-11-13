import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Mendapatkan token dari cookies
  const token = request.cookies.get("token")?.value;

  // Cek path saat ini
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isDashboardPage = request.nextUrl.pathname.startsWith("/dashboard");

  // Jika belum login dan bukan ke halaman login, redirect ke login
  // if (!token && !isLoginPage) {
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // // Jika sudah login dan di halaman login, redirect ke dashboard
  // if (token && isLoginPage) {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Mendapatkan response untuk API
  const response = NextResponse.next();

  // Update CORS headers
  response.headers.set(
    "Access-Control-Allow-Origin",
    "http://sccic-ssoserver.test"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );

  return response;
}

export const config = {
  // Tambahkan semua path ke matcher
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
