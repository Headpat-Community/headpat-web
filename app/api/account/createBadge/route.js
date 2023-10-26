import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    // Get the raw body data as ArrayBuffer
    const requestData = await request.arrayBuffer();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/badges`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": request.headers.get("Content-Type") || "multipart/form-data",
      },
      body: requestData, // Use the ArrayBuffer directly
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in createBadge API route:", error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
