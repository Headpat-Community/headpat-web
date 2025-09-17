import { createAdminClient } from "@/app/appwrite-session"
import { cookies } from "next/headers"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId")
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }
  const secret = request.nextUrl.searchParams.get("secret")
  if (!secret) {
    return NextResponse.json({ error: "Secret is required" }, { status: 400 })
  }
  const { account } = await createAdminClient()
  const session = await account.createSession({
    userId: userId,
    secret: secret,
  })

  const cookieStore = await cookies()
  cookieStore.set(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
    session.secret,
    {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: new Date(session.expire),
      path: "/",
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    }
  )

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/login/oauth`)
}
