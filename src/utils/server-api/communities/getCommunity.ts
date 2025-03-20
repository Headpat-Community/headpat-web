import { CommunityDocumentsType } from '@/utils/types/models'
import { createAdminClient } from '@/app/appwrite-session'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get a community by id
 * @example
 * const community = await getCommunity()
 */
export async function getCommunity(
  communityId: string
): Promise<CommunityDocumentsType> {
  unstable_noStore()
  const { databases } = await createAdminClient()
  return await databases
    .getDocument('hp_db', 'community', communityId)
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
