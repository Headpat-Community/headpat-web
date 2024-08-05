import VotingClient from './page.client'
import { headers } from 'next/headers'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Separator } from '@/components/ui/separator'
import { Interactive } from '@/utils/types/models'
import { createAdminClient } from '@/app/appwrite-session'
import { unstable_noStore } from 'next/cache'

export const runtime = 'edge'

export default async function VotingPage() {
  unstable_noStore()
  const { databases } = await createAdminClient()
  const voteSystem: Interactive.VotesSystem = await databases.getDocument(
    'interactive',
    'system',
    'main'
  )
  const votes: Interactive.VotesAnswersType = await databases.listDocuments(
    'interactive',
    'answers'
  )
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
        questionId={voteSystem.questionId}
        paused={voteSystem.paused}
        votes={votes}
        forwardedFor={forwardedFor}
      />
    </>
  )
}
