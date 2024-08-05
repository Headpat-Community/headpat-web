import VotingClient from './page.client'
import { getVotes } from '@/utils/server-api/interactive/votes/getVotes'
import { headers } from 'next/headers'
import { getQuestionId } from '@/utils/server-api/interactive/votes/getQuestionId'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'

export const runtime = 'edge'

export default async function VotingPage() {
  const questionId = await getQuestionId()
  const votes = await getVotes()
  const forwardedFor = headers().get('x-forwarded-for')

  return (
    <>
      <div className={'relative mb-4'}>
        <div className="flex flex-col lg:flex-row items-center px-4 py-1.5 justify-between align-middle">
          <h1 className="text-xl font-bold hidden sm:block">{'Voting'}</h1>
          <div className={'align-middle flex gap-2'}>
            <ThemeToggle />
          </div>
        </div>
        <Separator />
      </div>
      <VotingClient
        questionId={questionId}
        votes={votes}
        forwardedFor={forwardedFor}
      />
    </>
  )
}
