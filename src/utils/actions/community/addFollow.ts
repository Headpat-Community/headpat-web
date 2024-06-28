'use server'

import { createSessionServerClient } from '@/app/appwrite-session'
import { ID } from 'node-appwrite'
import { getUser } from '@/utils/server-api/account/user'
import { getIsFollowingCommunity } from '@/utils/server-api/community-followers/getIsFollowingCommunity'

export async function addFollow(userId: string, communityId: string) {
  try {
    const { databases } = await createSessionServerClient()
    const account = await getUser()
    if (!account) {
      return { code: 401 }
    }
    const following = await getIsFollowingCommunity(userId, communityId)
    if (following.documents.length > 0) {
      return { code: 404 }
    }

    return await databases.createDocument(
      'hp_db',
      'community-followers',
      ID.unique(),
      {
        userId: account.$id,
        communityId: communityId,
      }
    )
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
