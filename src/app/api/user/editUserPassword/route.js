import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    const cookieStore = cookies();
    const jwtCookie = cookieStore.get("jwt");

    if (!jwtCookie) {
      return NextResponse.json({ error: "No JWT Token" }, { status: 403 });
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/auth/change-password/`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtCookie.value}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 400) {
      const data = await response.json();
      return NextResponse.json(data, { status: 400 });
    }

    if (!response.ok) {
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
