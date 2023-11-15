import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request) {
  try {
    //console.log("Starting uploadImage API route execution");

    // Read the entire stream and buffer it
    const requestData = await request.arrayBuffer();

    /*console.log(
      "Buffered request data (first 100 bytes):",
      requestData.slice(0, 100).toString()
    );*/

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/galleries`;
    //console.log("Forwarding request to:", fetchURL);

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type":
          request.headers.get("Content-Type") || "multipart/form-data",
      },

      body: requestData,
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
    //console.log("Data from external API:", data);
    return NextResponse.json(data);
  } catch (error) {
    //console.error("Error in uploadImage API route:", error);
    return NextResponse.error(500, error.message);
  }
}
