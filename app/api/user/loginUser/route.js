import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/auth/local`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to update data");
    }

    const data = await response.json();

    cookies().set("jwt", data.jwt, {
      path: "/",
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return NextResponse.json(200, data);
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
