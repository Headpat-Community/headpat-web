import { createSessionServerClient } from '@/app/appwrite-session'
import { Followers } from '@/utils/types/models'
import { Query } from 'node-appwrite'
import { unstable_noStore } from 'next/cache'

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
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'followers', [Query.equal('userId', userId)])
    .catch((error) => {
      return error
    })
}

/**
 * This function is used to check if a user is following another user.
 * @param {string} userId The user id.
 * @param {string} followerId The follower id.
 * @returns {Promise<Followers.FollowerType>} The follower document.
 * @example
 * const following = await isFollowing('user_id', 'follower_id')
 * if (following.documents.length > 0) {
 *  console.log('User is following')
 *  return
 * }
 */
export async function getIsFollowing(
  userId: string,
  followerId: string
): Promise<Followers.FollowerType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'followers', [
      Query.and([
        Query.equal('userId', userId),
        Query.equal('followerId', followerId),
      ]),
    ])
    .catch((error) => {
      return error
    })
}
