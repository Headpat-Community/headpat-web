import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  try {
    // Use the URL object to parse and get query parameters
    const requestURL = new URL(request.url);
    const queryParams = requestURL.search;

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/users${queryParams}`;

    let response;
    try {
      response = await fetch(fetchURL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.error(500, "Error fetching data");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch data. Status: ${response.status}. Message: ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.error(500, error.message);
  }
}
