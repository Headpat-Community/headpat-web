import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function PATCH(request) {
  try {
    const requestBody = await request.json();

    const cookieStore = cookies();
    const jwtCookie = cookieStore.get(
      `a_session_` + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
    );

    if (!jwtCookie) {
      return NextResponse.json({ error: "No JWT Token" }, { status: 403 });
    }

    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/users/6553c91d403c07c5e8e8/password`;

    const response = await fetch(fetchURL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
      },
      body: JSON.stringify(requestBody),
    });

    console.log(response.status + " " + response.statusText);

    if (response.status === 400) {
      const data = await response.json();
      return NextResponse.json(data, { status: 400 });
    }

    if (response.status === 401) {
      const data = await response.json();
      return NextResponse.json(data, { status: 401 });
    }

    if (!response.ok) {
      console.log(response.status + " " + response.statusText);
      throw new Error("Failed to update data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
