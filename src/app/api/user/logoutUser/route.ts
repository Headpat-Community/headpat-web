import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import type { NextRequest } from "next/server"

import { createSessionClient } from "@/app/appwrite-session"

export async function POST(request: NextRequest) {
  try {
    const { account } = await createSessionClient(request)
    const cookie = await cookies()

    const redirect = request.nextUrl.searchParams.get("userId") === "true"

    // Delete the specified cookie
    cookie.set(`a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`, "", {
      path: "/",
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
      secure: true,
      httpOnly: true,
      expires: new Date(0),
    })

    if (redirect) {
      await account.deleteSession("current")
    } else {
      await account.deleteSessions()
    }

    return NextResponse.json({ status: 204 })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Failed to logout", status: 500 })
  }
}
