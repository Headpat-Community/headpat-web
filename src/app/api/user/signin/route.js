import { createAdminClient } from '../../../appwrite-session'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request) {
  const { account } = await createAdminClient()

  // if POST is not json, return 400
  if (request.headers.get('content-type') !== 'application/json') {
    return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
  }

  if (!request.body) {
    return NextResponse.json({ error: 'No body provided' }, { status: 400 })
  }

  const { email, password } = await request.json()

  try {
    const session = await account.createEmailPasswordSession(email, password)

    // Set cookie for headpat.de
    const headpatCookie = `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}=${session.secret}; Path=/; Domain=${process.env.NEXT_PUBLIC_COOKIE_DOMAIN}; Max-Age=${session.expire}; Secure; HttpOnly; SameSite=Strict`

    return NextResponse.json(
      {},
      {
        status: 200,
        headers: {
          'Set-Cookie': [headpatCookie],
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: error.code })
  }
}
