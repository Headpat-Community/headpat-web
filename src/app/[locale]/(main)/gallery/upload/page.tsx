import PageLayout from '@/components/pageLayout'
import UploadImage from '@/components/gallery/uploadImage'
import { getUser } from '@/utils/server-api/account/user'
import { redirect } from '@/navigation'

export const runtime = 'edge'

export default async function Page() {
  let user = null
  try {
    user = await getUser()
  } catch (e) {
    return redirect('/login')
  }

  return (
    <PageLayout title={'Upload'}>
      <UploadImage userId={user.$id} />
    </PageLayout>
  )
}
