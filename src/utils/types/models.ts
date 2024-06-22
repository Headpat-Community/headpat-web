import { type AppwriteException, Models } from 'node-appwrite'

export namespace Account {
  export interface AccountType
    extends Models.User<Models.Preferences>,
      AppwriteException {}

  /**
   * This data is returned from the API by calling their own account data.
   * @see AccountType
   */
  export interface AccountPrefs extends AccountType {
    prefs: {
      nsfw: boolean
    }
  }
}

export namespace Followers {
  export interface FollowerType {
    total: number
    documents: FollowerDocumentsType[]
  }

  export interface FollowerDocumentsType extends Models.Document {
    userId: string
    followerId: string
  }
}

export namespace UserData {
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
  export interface UserDataDocumentsType extends Models.Document {
    avatarId: string | null
    profileBannerId: string | null
    status: string | null
    displayName: string
    bio: string | null
    birthday: string | null
    profileUrl: string
    pronouns: string | null
    discordname: string | null
    telegramname: string | null
    furaffinityname: string | null
    X_name: string | null
    twitchname: string | null
    pats: number | 0
    location: string | null
    hideLocation: boolean
    hideBirthday: boolean
    hidePats: boolean
  }
}

export namespace Announcements {
  /**
   * This data is returned from the API by calling the getAnnouncements function.
   * @see AnnouncementDocumentsType
   */
  export interface AnnouncementDataType {
    total: number
    documents: AnnouncementDocumentsType[]
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
    userData: UserData.UserDataDocumentsType
  }
}

export namespace Gallery {
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
    userId: string
    longText: string
    nsfw: boolean
    tags: string[]
    mimeType: string
  }
}
