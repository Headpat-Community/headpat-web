import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  try {
    const headersList = headers();
    const cookieHeader = headersList.get("cookie");

    // Read the entire stream and buffer it
    const requestData = await request.arrayBuffer();

    /*console.log(
      "Buffered request data (first 100 bytes):",
      requestData.slice(0, 100).toString()
    );*/

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files`;
    //console.log("Forwarding request to:", fetchURL);

    const uploadImage = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type":
          request.headers.get("Content-Type") || "multipart/form-data",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
      body: requestData,
    });

    const imageData = await uploadImage.json();

    const postURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655cb829dbf6102f2436/documents`;

    const response = await fetch(postURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        documentId: "unique()",
        data: {
          gallery_id: imageData.$id,
        },
      }),
    });

    //console.log("External API Response Status:", response.status);
    /*console.log(
      "External API Response Headers:",
      JSON.stringify([...response.headers])
    );*/

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to forward data: ${errorData}`);
    }

    const data = await response.json();
    //console.log("External API Response Body:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    //console.log("Error:", error.message);
    return NextResponse.json(error.message, { status: 500 });
  }
}
