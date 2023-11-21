import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function POST(request) {
  const cookieStore = cookies();
  const jwtCookie = cookieStore.get(
    `a_session_` + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  );
  
  try {
    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account/jwt`;

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        "X-Appwrite-Response-Format": "1.4.0",
        Cookies:
          `a_session_` +
          process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID +
          `=${jwtCookie.value}`,
      },
    });
    console.log(response.status);

    if (!response.ok) {
      console.log(response.statusText);
      return NextResponse.json(response.statusText, { status: 500 });
    }

    const data = await response.json();

    cookies().set("jwt", data.jwt, {
      path: "/",
      secure: true,
      sameSite: "strict",
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    console.log(data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error.message, { status: 500 });
  }
}
