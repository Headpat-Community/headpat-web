import PageClient from './page.client'
import { headers } from 'next/headers'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Models } from 'node-appwrite'

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

  let accountData: Models.User<Models.Preferences>
  const { account } = await createSessionServerClient()
  try {
    accountData = await account.get()
  } catch {
    // do nothing
  }

  console.log(sessionCookie)
  console.log(accountData)

  return <PageClient asc={sessionCookie} userId={accountData?.$id} />
}
