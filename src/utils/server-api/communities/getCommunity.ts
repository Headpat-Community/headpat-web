import { Community } from '@/utils/types/models'
import { createSessionServerClient } from '@/app/appwrite-session'

/**
 * This function is used to get a list of the communities
 * @example
 * const events = await getEvents()
 */
export async function getCommunities(): Promise<Community.CommunityType> {
  const { databases } = await createSessionServerClient()
  return await databases.listDocuments('hp_db', 'community').catch((error) => {
    return error
  })
}

/**
 * This function is used to get a community by id
 * @example
 * const events = await getEvents()
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
