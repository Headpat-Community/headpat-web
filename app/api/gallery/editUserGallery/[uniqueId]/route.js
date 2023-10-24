import { NextResponse } from "next/server";

export const runtime = "edge";

export async function PUT(request) {
  try {
    // Assume the last segment of the URL is the gallery ID
    const uniqueId = request.url.split("/").pop();

    // Capture the incoming request data
    const requestData = await new Promise((resolve, reject) => {
      const chunks = [];
      request.on("data", (chunk) => chunks.push(chunk));
      request.on("end", () => resolve(Buffer.concat(chunks)));
      request.on("error", reject);
    });

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/galleries/${uniqueId}`;

    const response = await fetch(fetchURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "multipart/form-data", // Important to set the content type
      },
      body: requestData, // Use the captured request data
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
