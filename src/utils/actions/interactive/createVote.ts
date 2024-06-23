'use server'
import { createAdminClient } from '@/app/appwrite-session'
import { ID } from 'node-appwrite'
import { headers } from 'next/headers'

export async function createVote(questionId: number, optionId: number) {
  const forwardedFor = headers().get('x-forwarded-for')

  const { databases } = await createAdminClient()
  return await databases.createDocument('interactive', 'answers', ID.unique(), {
    questionId: `${questionId}`,
    optionId: `${optionId}`,
    ipAddress: forwardedFor || null,
  })
}
