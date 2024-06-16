'use client'
import { storage } from '@/app/appwrite-client'

export default function FetchGallery({ name, gallery }) {
  const getGalleryImageUrl = (galleryId: string) => {
    if (!galleryId) return
    const imageId = storage.getFileView('gallery', `${galleryId}`)
    return imageId.href
  }

  const url = getGalleryImageUrl(gallery?.galleryId)

  // The rest of the component remains unchanged with conditional rendering based on the data's availability.
  return (
    <img
      src={url}
      alt={name || 'Headpat Community Image'}
      className={`imgsinglegallery mx-auto h-[400px] w-auto max-w-full rounded-lg object-contain`}
    />
  )
}
