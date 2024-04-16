import Client from './page.client'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Account Gallery',
}

export const runtime = 'edge'

export default async function FetchGallery() {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/account`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    }
  )

  const userData = await response.json()

  const userId = userData?.$id
  let enableNsfw: boolean = userData?.prefs?.nsfw

  return <Client enableNsfw={enableNsfw || false} userId={userId} />
}
