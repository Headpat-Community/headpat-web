import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    // Capture the incoming request data
    const requestData = await new Promise((resolve, reject) => {
      const chunks = [];
      request.on("data", (chunk) => chunks.push(chunk));
      request.on("end", () => resolve(Buffer.concat(chunks)));
      request.on("error", reject);
    });

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/galleries`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "multipart/form-data", // Important to set the content type
      },
      body: requestData, // Use the captured request data
    });

    if (!response.ok) {
      throw new Error("Failed to forward data");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
