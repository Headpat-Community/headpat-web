'use server'

import { createSessionServerClient } from '@/app/appwrite-session'
import { getUser } from '@/utils/server-api/account/user'
import { getIsFollowingCommunity } from '@/utils/server-api/community-followers/getIsFollowingCommunity'

export async function removeFollow(userId: string, communityId: string) {
  try {
    const { databases } = await createSessionServerClient()
    const account = await getUser()
    if (!account.$id) {
      return { code: 401 }
    }
    const following = await getIsFollowingCommunity(userId, communityId)
    if (following.documents.length === 0) {
      return { code: 403 }
    }

    return await databases.deleteDocument(
      'hp_db',
      'community-followers',
      following.documents[0].$id
    )
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
