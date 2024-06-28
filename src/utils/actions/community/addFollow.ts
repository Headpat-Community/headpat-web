'use server'

import { createSessionServerClient } from '@/app/appwrite-session'
import { ID } from 'node-appwrite'
import { getUser } from '@/utils/server-api/account/user'
import { getIsFollowing } from '@/utils/server-api/followers/getFollowing'

export async function addFollow(userId: string, communityId: string) {
  try {
    const { databases } = await createSessionServerClient()
    const account = await getUser()
    if (account.$id === communityId) {
      return { code: 409 }
    }
    const following = await getIsFollowing(userId, communityId)
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
