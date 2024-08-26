'use client'

import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'

export async function removeFollow(followerId: string) {
  const data = await functions.createExecution(
    'user-endpoints',
    '',
    false,
    `/user/follow?followerId=${followerId}`,
    ExecutionMethod.DELETE
  )

  return JSON.parse(data.responseBody)
}
