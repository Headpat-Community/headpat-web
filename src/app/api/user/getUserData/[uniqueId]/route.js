import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const jwtCookie = cookieStore.get(
      `a_session_` + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
    );

    // Assume the last segment of the URL is the user ID
    const userId = request.url.split("/").pop();

    // Extract query parameters from the incoming request
    const queryParams = new URLSearchParams(
      request.url.split("?")[1]
    ).toString();

    // Construct the URL for the external fetch
    //const fetchURL = `${process.env.NEXT_PUBLIC_DOMAIN_API}/api/user-data/${userId}?${queryParams}`;
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/65564fa28d1942747a72/documents`;

    const response = await fetch(fetchURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie:
          `a_session_` +
          process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID +
          `=${jwtCookie.value}`,
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
