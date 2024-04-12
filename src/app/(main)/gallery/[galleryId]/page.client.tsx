import { storage } from '@/app/appwrite-client'

export default function FetchGallery({ name, gallery }) {
  const getGalleryImageUrl = (galleryId: string) => {
    console.log(galleryId)
    if (!galleryId) return
    const imageId = storage.getFileView('655ca6663497d9472539', `${galleryId}`)
    return imageId.href
  }

  const url = getGalleryImageUrl(gallery?.galleryId)
  console.log(url)

  // The rest of the component remains unchanged with conditional rendering based on the data's availability.
  return (
    <img
      src={url}
      alt={name || 'Headpat Community Image'}
      className={`imgsinglegallery mx-auto h-[400px] w-auto max-w-full rounded-lg object-contain`}
    />
  )
}
