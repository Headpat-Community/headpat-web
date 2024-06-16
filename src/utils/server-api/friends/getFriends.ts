import { createSessionServerClient } from '@/app/appwrite-session'
import { FriendDocumentsType } from '@/utils/types/friends'

/**
 * This function is used to get the friends of a user.
 * @param {string} userId The user id.
 * @returns {Promise<FriendDocumentsType>} The friends of the user.
 * @example
 * const friends = await getFriends('user_id')
 */
export async function getFriends(userId: string) {
  const { databases } = await createSessionServerClient()
  const data: FriendDocumentsType = await databases
    .getDocument('hp_db', 'friends', `${userId}`)
    .catch((error) => {
      return error
    })
  return data
}
