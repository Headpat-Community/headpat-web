import Client from './page.client'
import { headers } from 'next/headers'
import { createSessionServerClient } from '@/app/appwrite-session'

export const metadata = {
  title: 'Gallery',
  description:
    'The gallery page is where you can see all the images that have been uploaded to the site.',
}

export const runtime = 'edge'

export default async function Gallery() {
  const { account } = await createSessionServerClient()

  const accountData = await account.get()
  const enableNsfw = accountData?.prefs?.nsfw

  return (
    <div>
      <Client enableNsfw={enableNsfw || false} />
    </div>
  )
}
