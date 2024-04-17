import Client from './page.client'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Gallery',
  description:
    'The gallery page is where you can see all the images that have been uploaded to the site.',
}

export const runtime = 'edge'

export default async function Gallery() {
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
  const enableNsfw = userData?.prefs?.nsfw

  return (
    <div>
      <Client enableNsfw={enableNsfw || false} />
    </div>
  )
}
