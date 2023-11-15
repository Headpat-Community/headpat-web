import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(request) {
  try {
    // Extract query parameters from the incoming request
    const queryParams = new URLSearchParams(
      request.url.split("?")[1]
    ).toString();

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/pats?${queryParams}`;

    const response = await fetch(fetchURL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DOMAIN_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
