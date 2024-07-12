import Client from './page.client'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createAdminClient } from '@/app/appwrite-session'
import { Gallery } from '@/utils/types/models'
import PageLayout from '@/components/pageLayout'
import { getUser } from '@/utils/server-api/account/user'

export const runtime = 'edge'

export const metadata = {
  title: 'Account Gallery',
}

export default async function AccountSingleGalleryPage({
  params: { galleryId },
}) {
  const userData = await getUser()
  const userId = userData?.$id

  const { databases } = await createAdminClient()

  let singleGallery: Gallery.GalleryDocumentsType

  try {
    singleGallery = await databases.getDocument(
      'hp_db',
      'gallery-images',
      galleryId
    )

    const galleryUserId = singleGallery?.userId

    if (!galleryUserId) return notFound() // Wait for userId to be available
    if (!userId) return notFound() // Wait for userId to be available

    if (userId !== galleryUserId) {
      return notFound()
    }

    if (!singleGallery) return notFound()
  } catch (error) {
    return notFound()
  }

  return (
    <PageLayout title={'Account Gallery'}>
      <Client singleGallery={singleGallery} galleryId={galleryId} />
    </PageLayout>
  )
}
