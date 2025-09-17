import { createAdminClient } from "@/app/appwrite-session"
import type { CommunityDocumentsType } from "@/utils/types/models"

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
    .getRow({
      databaseId: "hp_db",
      tableId: "community",
      rowId: communityId,
    })
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
