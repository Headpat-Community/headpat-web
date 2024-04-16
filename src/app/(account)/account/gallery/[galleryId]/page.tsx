import Client from './page.client'
import { getUserSelf } from '@/utils/actions/user-actions'
import { getSingleGallery } from '@/utils/actions/gallery-actions'
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { createAdminClient } from '@/app/appwrite-session'
import { GalleryDocumentsType } from '@/utils/types'

export const runtime = 'edge'

export const metadata = {
  title: 'Account Gallery',
}

export default async function AccountSingleGalleryPage({
  params: { galleryId },
}) {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN}/api/user/account`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    }
  )

  const userData = await response.json()

  const userId = userData?.$id

  const { databases } = await createAdminClient()
  const singleGallery: GalleryDocumentsType = await databases.getDocument(
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

  return <Client singleGallery={singleGallery} />
}
