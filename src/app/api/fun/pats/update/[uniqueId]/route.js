import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request) {
  try {
    // Assume the last segment of the URL is the user ID
    const patId = request.url.split("/").pop();

    const requestBody = await request.json();

    if (!patId) {
      throw new Error("Pat ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/pats/${patId}`;

    const response = await fetch(fetchURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody), // Serialize requestBody to JSON
    });

    if (!response.ok) {
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
