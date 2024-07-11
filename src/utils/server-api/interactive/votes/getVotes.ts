'use server'
import { createAdminClient } from '@/app/appwrite-session'
import { Interactive } from '@/utils/types/models'
import { unstable_noStore } from 'next/cache'

/**
 * This function is used to get the answers of the votes of Lighthase's EF Panel.
 * @returns The answers from the votes.
 * @example
 * const votes = await getVotes()
 */
export async function getVotes(): Promise<Interactive.VotesAnswersType> {
  unstable_noStore()
  const { databases } = await createAdminClient()
  return await databases
    .listDocuments('interactive', 'answers')
    .catch((error) => {
      return error
    })
}
