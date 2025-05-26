import { createAdminClient } from '@/app/appwrite-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { account } = await createAdminClient()
  // if POST is not json, return 400
  if (request.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Invalid content type', status: 400 })
  }
  if (!request.body) {
    return NextResponse.json({ error: 'No body provided', status: 400 })
  }
  const { email, password } = await request.json()

  try {
    const session = await account.createEmailPasswordSession(email, password)
    const cookieStore = await cookies()
    cookieStore.set(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      session.secret,
      {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(session.expire),
        path: '/',
        domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN
      }
    )

    return NextResponse.json(session)
  } catch (error) {
    return NextResponse.json({ error: error, status: error.code })
  }
}
