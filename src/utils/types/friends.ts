import { Models } from 'node-appwrite'

export interface FriendDocumentsType extends Models.Document {
  friends: string[]
}
