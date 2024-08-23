import { createSessionServerClient } from '@/app/appwrite-session'
import { Followers } from '@/utils/types/models'
import { ExecutionMethod } from 'node-appwrite'

/**
 * This function is used to get the followers of a user.
 * @example
 * const followers = await getFollowers('user_id', 0, 20)
 */
export async function getFollowers(
  userId: string,
  offset: number = 0,
  limit: number = 20
): Promise<Followers.FollowerDocumentsType> {
  const { functions } = await createSessionServerClient()
  const data = await functions.createExecution(
    'user-endpoints',
    '',
    false,
    `/user/followers?userId=${userId}&limit=${limit}&offset=${offset}`,
    ExecutionMethod.GET
  )
  return JSON.parse(data.responseBody)
}
