import Client from './page.client'
import { getUser } from '@/utils/server-api/account/user'
import PageLayout from '@/components/pageLayout'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Gallery',
  description:
    'The gallery page is where you can see all the images that have been uploaded to the site.',
}

export const runtime = 'edge'

function UploadButton() {
  return (
    <Link href={'/gallery/upload'}>
      <Button>Upload</Button>
    </Link>
  )
}

export default async function Gallery() {
  const accountData = await getUser()
  const enableNsfw = accountData?.prefs?.nsfw

  return (
    <PageLayout title={'Gallery'} middleComponent={<UploadButton />}>
      <Client enableNsfw={enableNsfw || false} />
    </PageLayout>
  )
}
