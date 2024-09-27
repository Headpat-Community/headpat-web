import { Community } from '@/utils/types/models'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Query } from 'node-appwrite'

/**
 * This function is used to get a community by id
 * @example
 * const community = await getCommunity()
 */
export async function getCommunity(
  communityId: string
): Promise<Community.CommunityDocumentsType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .getDocument('hp_db', 'community', communityId)
    .catch((error) => {
      return error
    })
}
