import { Followers } from '@/utils/types/models'
import { ExecutionMethod } from 'node-appwrite'
import { createSessionServerClient } from '@/app/appwrite-session'

export async function getFollowing(
  userId: string,
  offset: number = 0,
  limit: number = 20
): Promise<Followers.FollowerDocumentsType> {
  const { functions } = await createSessionServerClient()
  const data = await functions.createExecution(
    'user-endpoints',
    '',
    false,
    `/user/following?userId=${userId}&limit=${limit}&offset=${offset}`,
    ExecutionMethod.GET
  )
  return JSON.parse(data.responseBody)
}

export async function getIsFollowing(followerId: string) {
  const { functions } = await createSessionServerClient()
  const data = await functions.createExecution(
    'user-endpoints',
    '',
    false,
    `/user/isFollowing?followerId=${followerId}`,
    ExecutionMethod.GET
  )

  return JSON.parse(data.responseBody)
}
