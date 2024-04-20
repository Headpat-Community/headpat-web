import Client from './page.client'
import { headers } from 'next/headers'
import { createSessionServerClient } from '@/app/appwrite-session'

export const metadata = {
  title: 'Account Gallery',
}

export const runtime = 'edge'

export default async function FetchGallery() {
  const { account } = await createSessionServerClient()
  const userData = await account.get()

  const userId = userData?.$id
  let enableNsfw: boolean = userData?.prefs?.nsfw

  return <Client enableNsfw={enableNsfw || false} userId={userId} />
}
