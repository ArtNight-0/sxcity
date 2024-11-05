import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST() {
  try {
    const headersList = headers();
    const token = headersList.get("authorization");

    const response = await fetch(
      "http://sccic-ssoserver.test/api/auth/logout",
      {
        method: "POST",
        headers: {
          Authorization: token || "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
