import { createSessionServerClient } from '@/app/appwrite-session'
import { Community } from '@/utils/types/models'
import { Query } from 'node-appwrite'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to see if a user is following a community.
 * @param {string} userId The user id.
 * @param {string} communityId The community id.
 * @returns {Promise<Community.CommunityType>} If a user is in the community followers list.
 * @example
 * const followers = await getIsFollowingCommunity('userId', 'communityId')
 * userId:
 */
export async function getIsFollowingCommunity(
  userId: string,
  communityId: string
): Promise<Community.CommunityType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'community-followers', [
      Query.equal('userId', userId),
      Query.equal('communityId', communityId),
    ])
    .catch((error) => {
      return error
    })
}
