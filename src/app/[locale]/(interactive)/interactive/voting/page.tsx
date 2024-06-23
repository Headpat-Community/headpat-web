import PageLayout from '@/components/pageLayout'
import VotingClient from '@/app/[locale]/(interactive)/interactive/voting/page.client'
import { getVotes } from '@/utils/server-api/interactive/votes/getVotes'
import { headers } from 'next/headers'
import { getQuestionId } from '@/utils/server-api/interactive/votes/getQuestionId'

export const runtime = 'edge'

export default async function VotingPage() {
  const questionId = await getQuestionId()
  const votes = await getVotes()
  const forwardedFor = headers().get('x-forwarded-for')

  return (
    <PageLayout title={'Voting'}>
      <VotingClient
        questionId={questionId}
        votes={votes}
        forwardedFor={forwardedFor}
      />
    </PageLayout>
  )
}
