import Client from './page.client'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/app/appwrite-session'
import { Gallery } from '@/utils/types/models'
import PageLayout from '@/components/pageLayout'
import { getUser } from '@/utils/server-api/account/user'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export const metadata = {
  title: 'Account Gallery',
}

export default async function AccountSingleGalleryPage(props) {
  const params = await props.params
  const locale = await props.locale

  const { galleryId } = params

  let userData = null
  try {
    userData = await getUser()
  } catch (error) {
    return redirect('/login')
  }

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
