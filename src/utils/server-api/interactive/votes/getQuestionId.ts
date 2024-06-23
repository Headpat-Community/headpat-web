import { createAdminClient } from '@/app/appwrite-session'
import { Interactive } from '@/utils/types/models'

/**
 * This function is used to get the answers of the votes of Lighthase's EF Panel.
 * @returns The question ID.
 * @example
 * const questionId = await getQuestionId()
 */
export async function getQuestionId(): Promise<number> {
  const { databases } = await createAdminClient()
  const data: Interactive.VotesQuestionId = await databases
    .getDocument('interactive', 'questions', 'main')
    .catch((error) => {
      return error
    })
  return data.questionId
}
