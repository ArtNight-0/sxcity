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
        client_id: "9dbf8547-185e-4660-b5fe-a66589f7f866",
        client_secret: "Y1Rv12APWRLqZkddrjk0YoP5ltF5uxjNEq7Lb3ay",
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
