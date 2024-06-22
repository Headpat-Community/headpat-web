'use server'

import { createSessionServerClient } from '@/app/appwrite-session'
import { ID } from 'node-appwrite'
import { getUser } from '@/utils/server-api/account/user'

export async function addFollow(followerId: string) {
  try {
    const { databases } = await createSessionServerClient()
    const account = await getUser()
    if (account.$id === followerId) {
      return { code: 409 }
    }
    return await databases.createDocument('hp_db', 'followers', ID.unique(), {
      userId: account.$id,
      followerId: followerId,
    })
  } catch (error) {
    return JSON.parse(JSON.stringify(error))
  }
}
