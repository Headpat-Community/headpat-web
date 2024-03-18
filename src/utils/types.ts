/**
 * This data is needed in all documents endpoints.
 */
interface MainTypes {
  $id: string
  $createdAt: Date
  $updatedAt: Date
  $permissions: string[]
  $databaseId: string
  $collectionId: string
}

/**
 * This data is returned from the API by calling their own account data.
 */
export interface UserAccountType {
  $id: string
  name: string
  registration: Date
  status: boolean
  labels: string[]
  passwordUpdate: Date
  email: string
  phone: string
  emailVerification: boolean
  phoneVerification: boolean
  prefs: Record<string, unknown>
  accessedAt: Date
}

/**
 * This data is returned from the API by calling the userdata endpoint.
 */
export interface UserDataType {
  total: number
  documents: UserDataDocumentsType[]
}

/**
 * This data is returned from the API by calling the userData function.
 * @see UserDataType
 */
export interface UserDataDocumentsType extends MainTypes {
  status: string | null
  birthday: Date | null
  profileUrl: string
  pronouns: string | null
  discordname: string | null
  telegramname: string | null
  furaffinityname: string | null
  X_name: string | null
  twitchname: string | null
  pats: number | 0
  location: string | null
  displayName: string
  avatarId: string | null
  bio: string | null
}

/**
 * This data is returned from the API within the `documents` array.
 * @see AnnouncementDataType
 * @see UserDataType
 * @interface
 * @since 2.0.0
 */
export interface AnnouncementDocumentsType extends MainTypes {
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
export interface GalleryDocumentsType extends MainTypes {
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
