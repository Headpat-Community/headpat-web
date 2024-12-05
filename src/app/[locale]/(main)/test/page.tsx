import PageClient from './page.client'
import { headers } from 'next/headers'
import { createSessionServerClient } from '@/app/appwrite-session'

export const runtime = 'edge'

export default async function Page() {
  const headersList = await headers()
  const cookieHeader = headersList.get('cookie')
  const cookies = cookieHeader ? cookieHeader.split('; ') : []
  const sessionCookie = cookies.find((cookie) =>
    cookie.startsWith(
      `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    )
  )

  const { account } = await createSessionServerClient()
  const accountData = await account.get()

  return <PageClient asc={sessionCookie} userId={accountData.$id} />
}
