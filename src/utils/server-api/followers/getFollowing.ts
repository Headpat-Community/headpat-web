import { createSessionServerClient } from '@/app/appwrite-session'
import { Followers } from '@/utils/types/models'
import { ExecutionMethod, Query } from 'node-appwrite'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the followers of a user.
 * @example
 * const following = await getFollowing('user_id', 0, 20)
 */
export async function getFollowing(
  userId: string,
  offset: number = 0,
  limit: number = 20
): Promise<Followers.FollowerDocumentsType> {
  const { functions } = await createSessionServerClient()
  const data = await functions.createExecution(
    'user-endpoints',
    '',
    false,
    `/user/following?userId=${userId}&limit=${limit}&offset=${offset}`,
    ExecutionMethod.GET
  )
  return JSON.parse(data.responseBody)
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
