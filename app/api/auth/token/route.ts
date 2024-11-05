import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch("http://sccic-ssoserver.test/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: "9d6a4488-0aa2-42b3-bc7d-2a296b4b5be4",
        client_secret: "26VDja09WcxfenMWAjquYyh51B7UteUXw6mh0Q9Q",
        redirect_uri: "http://localhost:3000/auth/callback",
        code: body.code,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Failed to exchange code for token" },
      { status: 500 }
    );
  }
}
