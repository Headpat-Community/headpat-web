import { createAdminClient } from '../../../appwrite-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get('userId')
  const secret = request.nextUrl.searchParams.get('secret')

  const { account } = await createAdminClient()
  const session = await account.createSession(userId, secret)

  cookies().set(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
    session.secret,
    {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: new Date(session.expire),
      path: '/',
      domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
    }
  )

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/account`)
}
