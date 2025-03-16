import Client from './page.client'
import { createSessionServerClient } from '@/app/appwrite-session'
import PageLayout from '@/components/pageLayout'

export const metadata = {
  title: 'Account Gallery',
}

export default async function FetchGallery() {
  const { account } = await createSessionServerClient()
  const userData = await account.get()

  const userId = userData?.$id
  let enableNsfw: boolean = userData?.prefs?.nsfw

  return (
    <PageLayout title={'Account Gallery'}>
      <Client enableNsfw={enableNsfw || false} userId={userId} />
    </PageLayout>
  )
}
