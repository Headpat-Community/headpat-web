import Client from './page.client'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/appwrite-session'
import PageLayout from '@/components/pageLayout'
import { getUser } from '@/utils/server-api/account/user'
import { redirect } from 'next/navigation'
import { GalleryDocumentsType } from '@/utils/types/models'

export const metadata = {
  title: 'Account Gallery',
}

export default async function AccountSingleGalleryPage(props) {
  const params = await props.params

  const { galleryId } = params

  let userData = null
  try {
    userData = await getUser()
  } catch {
    return redirect('/login')
  }

  const userId = userData?.$id

  const { databases } = await createAdminClient()

  let singleGallery: GalleryDocumentsType

  try {
    singleGallery = await databases.getDocument(
      'hp_db',
      'gallery-images',
      galleryId
    )

    const galleryUserId = singleGallery?.userId

    if (!galleryUserId) return notFound() // Wait for userId to be available

    if (userId !== galleryUserId) {
      return notFound()
    }

    if (!singleGallery) return notFound()
  } catch {
    return notFound()
  }

  return (
    <PageLayout title={'Account Gallery'}>
      <Client singleGallery={singleGallery} galleryId={galleryId} />
    </PageLayout>
  )
}
