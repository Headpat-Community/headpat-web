import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Assume the last segment of the URL is the user ID
    const userId = request.url.split("/").pop();

    const requestData = await request.arrayBuffer();

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/user-data/${userId}`;
    const uploadUrl = `${process.env.NEXT_PUBLIC_DOMAIN_API}/v1/storage/buckets/655842922bac16a94a25/files`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        "Content-Type":
          request.headers.get("Content-Type") || "multipart/form-data",
        Cookie: cookieHeader,
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
