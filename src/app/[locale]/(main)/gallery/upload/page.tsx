import UploadImage from '@/components/gallery/uploadImage'
import { getUser } from '@/utils/server-api/account/user'
import { redirect } from 'next/navigation'

export default async function Page() {
  let user = null
  try {
    user = await getUser()
  } catch {
    return redirect('/login')
  }

  return <UploadImage userId={user.$id} />
}
