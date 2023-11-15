import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request) {
  try {
    // Assume the last segment of the URL is the gallery ID
    const uniqueId = request.url.split("/").pop();

    if (!uniqueId) {
      return NextResponse.error(400, "Gallery ID is required");
    }

    // Capture the incoming request data
    const requestBody = await request.json();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/galleries/${uniqueId}`;

    const response = await fetch(fetchURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to update data: ${errorData}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in editUserGallery API route:", error);
    return NextResponse.error(500, error.message);
  }
}
