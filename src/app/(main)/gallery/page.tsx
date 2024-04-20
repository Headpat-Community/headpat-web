import Client from './page.client'
import { headers } from 'next/headers'
import { createSessionServerClient } from '@/app/appwrite-session'
import { getLoggedInUser } from '@/lib/server-calls'

export const metadata = {
  title: 'Gallery',
  description:
    'The gallery page is where you can see all the images that have been uploaded to the site.',
}

export const runtime = 'edge'

export default async function Gallery() {
  const accountData = await getLoggedInUser()
  const enableNsfw = accountData?.prefs?.nsfw

  return (
    <div>
      <Client enableNsfw={enableNsfw || false} />
    </div>
  )
}
