'use server'
import { createAdminClient } from '@/app/appwrite-session'
import { ID } from 'node-appwrite'
import { headers } from 'next/headers'

export async function createVote(questionId: string, optionId: number) {
  const forwardedFor = (await headers()).get('x-forwarded-for')

  const { databases } = await createAdminClient()
  return await databases.createDocument('interactive', 'answers', ID.unique(), {
    questionId: `${questionId}`,
    optionId: `${optionId}`,
    ipAddress: forwardedFor || null,
  })
}

export async function createVoteMain(questionId: string, optionId: number) {
  const forwardedFor = (await headers()).get('x-forwarded-for')

  const { databases } = await createAdminClient()
  return await databases.createDocument(
    'interactive',
    'answers-main',
    ID.unique(),
    {
      questionId: `${questionId}`,
      optionId: `${optionId}`,
      ipAddress: forwardedFor || null,
    }
  )
}
