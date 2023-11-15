import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request) {
  try {
    // Assume the last segment of the URL is the user ID
    const userId = request.url.split("/").pop();

    const requestData = await request.arrayBuffer();
    
    if (!userId) {
      throw new Error("User ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/user-data/${userId}`;

    const response = await fetch(fetchURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": request.headers.get("Content-Type") || "multipart/form-data",
      },
      body: requestData,
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
