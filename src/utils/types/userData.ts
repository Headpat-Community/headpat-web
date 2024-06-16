import { Models } from 'node-appwrite'

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
