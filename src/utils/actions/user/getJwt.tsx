'use server'
import { headers } from 'next/headers'

export async function getJwt() {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')
  const cookies = cookieHeader ? cookieHeader.split('; ') : []
  return cookies.find((cookie) =>
    cookie.startsWith(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    )
  )
}
