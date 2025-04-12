export const getAvatarImageUrlView = (
  galleryId: string,
  defaultImage: string = '/logos/hp_logo_x512.webp'
) => {
  if (!galleryId) {
    return defaultImage
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${galleryId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}

export const getAvatarImageUrlPreview = (
  galleryId: string,
  attributes: string
) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${galleryId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&${attributes}`
}

export const getBannerImageUrlView = (galleryId: string) => {
  if (!galleryId) {
    return
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/banners/files/${galleryId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}

export const getBannerImageUrlPreview = (
  galleryId: string,
  attributes: string
) => {
  if (!galleryId) {
    return
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/banners/files/${galleryId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&${attributes}`
}

export const getGalleryImageUrlView = (galleryId: string) => {
  if (!galleryId) return
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/gallery/files/${galleryId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}

export const getGalleryImageUrlPreview = (
  galleryId: string,
  attributes: string
) => {
  if (!galleryId) return
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/gallery/files/${galleryId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&${attributes}`
}

export const getCommunityAvatarUrlView = (
  galleryId: string,
  defaultImage: string = '/logos/hp_logo_x512.webp'
) => {
  if (!galleryId) {
    return defaultImage
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/community-avatars/files/${galleryId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}

export const getCommunityAvatarUrlPreview = (
  galleryId: string,
  attributes: string,
  defaultImage: string = '/logos/hp_logo_x512.webp'
) => {
  if (!galleryId) {
    return defaultImage
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/community-avatars/files/${galleryId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&${attributes}`
}

export const getCommunityBannerUrlView = (galleryId: string) => {
  if (!galleryId) return
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/community-banners/files/${galleryId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}

export const getCommunityBannerUrlPreview = (
  galleryId: string,
  attributes: string,
  defaultImage: string = '/logos/hp_logo_x512.webp'
) => {
  if (!galleryId) return defaultImage
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/community-banners/files/${galleryId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&${attributes}`
}

export const getEventImageUrlPreview = (
  galleryId: string,
  attributes: string
) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/event-images/files/${galleryId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&${attributes}`
}

export const getEventImageUrlView = (galleryId: string) => {
  if (!galleryId) return
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/event-images/files/${galleryId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
}
