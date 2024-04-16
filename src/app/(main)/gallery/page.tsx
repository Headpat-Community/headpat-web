import Client from './page.client'
import { getUserSelf } from '@/utils/actions/user-actions'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Gallerie',
  description:
    'Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.',
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
  const enableNsfw = userData?.prefs?.enableNsfw

  return (
    <div>
      <Client enableNsfw={enableNsfw || false} />
    </div>
  )
}
