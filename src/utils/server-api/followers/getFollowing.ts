import { createSessionServerClient } from '@/app/appwrite-session'
import { Followers } from '@/utils/types/models'
import { Query } from 'node-appwrite'

/**
 * This function is used to get the following users of a user.
 * @param {string} userId The user id.
 * @returns {Promise<Followers.FollowerDocumentsType>} The following users of the user.
 * @example
 * const following = await getFollowing('user_id')
 */
export async function getFollowing(
  userId: string
): Promise<Followers.FollowerType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'followers', [Query.equal('userId', userId)])
    .catch((error) => {
      return error
    })
}
