import { createSessionServerClient } from '@/app/appwrite-session'
import { Community } from '@/utils/types/models'
import { Query } from 'node-appwrite'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the followers of a user.
 * @param {string} communityId The community id.
 * @returns {Promise<Community.CommunityType>} The followers of a community.
 * @example
 * const followers = await getCommunityFollowers('user_id')
 * userId:
 */
export async function getCommunityFollowers(
  communityId: string
): Promise<Community.CommunityType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases
    .listDocuments('hp_db', 'community-followers', [
      Query.equal('communityId', communityId),
    ])
    .catch((error) => {
      return error
    })
}
