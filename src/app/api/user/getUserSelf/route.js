import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "edge";

export async function GET() {
  try {
    // Construct the URL for the external fetch
    const fetchURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents`;
    const postURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/databases/65527f2aafa5338cdb57/collections/655ad3d280feee3296b5/documents`;
    const accountURL = `${process.env.NEXT_PUBLIC_API_URL}/v1/account`;

    const cookieStore = cookies();
    const jwtCookie = cookieStore.get(
      `a_session_` + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
    );

    if (!jwtCookie) {
      return NextResponse.json({ error: "No JWT Token" }, { status: 403 });
    }

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

    const data = await response.json();

    if (data.documents.length === 0) {
      const getAccountResponse = await fetch(accountURL, {
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

      const getAccountData = await getAccountResponse.json();

      const postResponse = await fetch(postURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Project": `${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
          "X-Appwrite-Response-Format": "1.4.0",
          Cookie:
            `a_session_` +
            process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID +
            `=${jwtCookie.value}`,
        },
        body: JSON.stringify({
          documentId: getAccountData.$id,
          data: {
            name: getAccountData.name,
          },
        }),
      });

      const postData = await postResponse.json();
      //console.log(postData);
      return NextResponse.json(postData.documents, { status: 201 });
    }

    if (response.status === 403) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } else if (response.status === 401) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    } else if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    //console.log(data.documents);
    return NextResponse.json(data.documents, { status: 201 });
  } catch (error) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
