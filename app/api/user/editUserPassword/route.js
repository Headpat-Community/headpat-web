import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    const requestBody = await request.json();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/auth/change-password/`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
