'use server'

import { createSessionServerClient } from '@/app/appwrite-session'
import { getUser } from '@/utils/server-api/account/user'
import { getIsFollowing } from '@/utils/server-api/followers/getFollowing'

export async function removeFollow(followerId: string, userId: string) {
  try {
    const { databases } = await createSessionServerClient()
    const account = await getUser()

    if (!account.$id) {
      return { code: 401 }
    }
    if (account.$id === followerId) {
      return { code: 409 }
    }
    const following = await getIsFollowing(userId, followerId)
    if (following.documents.length === 0) {
      return { code: 403 }
    }

    return await databases.deleteDocument(
      'hp_db',
      'followers',
      following.documents[0].$id
    )
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
