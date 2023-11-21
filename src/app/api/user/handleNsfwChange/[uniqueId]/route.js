import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function PUT(request) {
  try {
    const cookieStore = cookies();
    const jwtCookie = cookieStore.get(
      `a_session_` + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
    );

    // Assume the last segment of the URL is the user ID
    const userId = request.url.split("/").pop();

    // get request json
    const requestBody = await request.json();

    if (!userId) {
      return NextResponse.json("User ID is required", { status: 400 });
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents/${userId}`;

    const response = await fetch(fetchURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookie:
          `a_session_` +
          process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID +
          `=${jwtCookie.value}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.log(response.status, response.statusText);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
