import { CommunityDocumentsType } from '@/utils/types/models'
import { createAdminClient } from '@/app/appwrite-session'

/**
 * This function is used to get a community by id
 * @example
 * const community = await getCommunity()
 */
export async function getCommunity(
  communityId: string
): Promise<CommunityDocumentsType> {
  const { databases } = await createAdminClient()
  return await databases
    .getDocument('hp_db', 'community', communityId)
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
