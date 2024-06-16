import Client from './page.client'
import { getUser } from '@/utils/server-api/account/user'

export const metadata = {
  title: 'Gallery',
  description:
    'The gallery page is where you can see all the images that have been uploaded to the site.',
}

export const runtime = 'edge'

export default async function Gallery() {
  const accountData = await getUser()
  const enableNsfw = accountData?.prefs?.nsfw

  return (
    <div>
      <Client enableNsfw={enableNsfw || false} />
    </div>
  )
}
