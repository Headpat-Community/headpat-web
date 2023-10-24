import { NextResponse } from "next/server";

export const runtime = "edge";

export async function DELETE(request) {
  try {
    // Assume the last segment of the URL is the image ID
    const imageId = request.url.split("/").pop();

    if (!imageId) {
      throw new Error("Image ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/upload/files/${imageId}`;

    const response = await fetch(fetchURL, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete data");
    }

    return new NextResponse(200);
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
