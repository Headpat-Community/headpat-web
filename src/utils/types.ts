import type { Models } from 'node-appwrite'
import { UserDataDocumentsType } from '@/utils/types/userData'

/**
 * This data is returned from the API by calling the userAvatars function.
 * @see UserAvatarsDocumentType
 * @interface
 * @since 2.0.0
 */
export interface UserAvatarsType {
  total: number
  documents: UserAvatarsDocumentType[]
}

/**
 * This data is returned from the API within the `documents` array.
 * @see UserAvatarsType
 * @interface
 * @since 2.0.0
 */
export interface UserAvatarsDocumentType extends Models.Document {
  galleryId: string
  imgAlt: string
  mimeType: string
  userId: string
  sizeOriginal: number
}

/**
 * This data is returned from the API within the `documents` array.
 * @see AnnouncementDataType
 * @see UserDataType
 * @interface
 * @since 2.0.0
 */
export interface AnnouncementDocumentsType extends Models.Document {
  title: string | null
  sideText: string | null
  description: string
  validUntil: Date
  userData: UserDataDocumentsType
}

/**
 * This data is returned from the API by calling the getAnnouncements function.
 * @see AnnouncementDocumentsType
 */
export interface AnnouncementDataType {
  total: number
  documents: AnnouncementDocumentsType[]
}

/**
 * This data is returned from the API by calling the gallery endpoint.
 * @see GalleryDocumentsType
 * @interface
 * @since 2.0.0
 */
export interface GalleryType {
  total: number
  documents: GalleryDocumentsType[]
}

/**
 * This data is returned from the API within the `documents` array.
 * @see GalleryType
 * @interface
 * @since 2.0.0
 */
export interface GalleryDocumentsType extends Models.Document {
  galleryId: string
  name: string
  mimeType: string
  sizeOriginal: number
  userId: string
  imgAlt: string
  longText: string
  nsfw: boolean
  tags: string[]
}
