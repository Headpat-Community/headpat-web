import { createSessionServerClient } from '@/app/appwrite-session'
import { FriendDocumentsType } from '@/utils/types/friends'

export async function getFriends(userId: string) {
  const { databases } = await createSessionServerClient()
  const data: FriendDocumentsType = await databases
    .getDocument('hp_db', 'friends', `${userId}`)
    .catch((error) => {
      return error
    })
  return data
}
