import VotingClient from './page.client'
import { headers } from 'next/headers'
import { Interactive } from '@/utils/types/models'
import { createAdminClient } from '@/app/appwrite-session'
import { unstable_noStore } from 'next/cache'

export const runtime = 'edge'

export default async function VotingPage() {
  unstable_noStore()
  const { databases } = await createAdminClient()
  const voteSystem: Interactive.VotesSystem = await databases.getDocument(
    'interactive',
    'system-main',
    'main'
  )
  const votes: Interactive.VotesAnswersType = await databases.listDocuments(
    'interactive',
    'answers-main'
  )
  const forwardedFor = headers().get('x-forwarded-for')

  return (
    <>
      <VotingClient
        questionId={voteSystem.questionId}
        paused={voteSystem.paused}
        votes={votes}
        forwardedFor={forwardedFor}
      />
    </>
  )
}
