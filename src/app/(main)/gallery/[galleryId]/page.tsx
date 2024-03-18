import Client from './page.client'
import {
  getUserData,
  getUserDataSelf,
  getUserSelf,
} from 'utils/actions/user-actions'
import { getGallery } from 'utils/actions/gallery-actions'
import { notFound } from 'next/navigation'
import { GalleryDocumentsType, GalleryType } from 'utils/types'

export const runtime = 'edge'

export const metadata = {
  title: 'Gallerie',
  description:
    'Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.',
}

export default async function Gallery({ params: { galleryId } }) {
  const userSelf = await getUserDataSelf()
  const enableNsfw = userSelf?.enablensfw || false

  const gallery: GalleryType = await getGallery(
    `queries[]=equal("$id","${galleryId}")`
  )
  if (!gallery.documents) {
    return notFound()
  }
  const galleryData: GalleryDocumentsType = gallery.documents[0]

  const userId = galleryData?.userId
  const userData = await getUserData(`queries[]=equal("$id","${userId}")`)

  if (!userId) {
    return notFound()
  }

  return (
    <div>
      <Client
        userData={userData[0]}
        gallery={galleryData}
        enableNsfw={enableNsfw}
      />
    </div>
  )
}
