import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'

export async function reportUserProfile(body: any) {
  try {
    const data = await functions.createExecution(
      'moderation-endpoints',
      JSON.stringify(body),
      false,
      `/moderation/report/profile`,
      ExecutionMethod.POST
    )
    return JSON.parse(data.responseBody)
  } catch (e) {
    console.error(e)
  }
}
