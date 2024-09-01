import { createSessionServerClient } from '@/app/appwrite-session'
import { Notifications } from '@/utils/types/models'
import { unstable_noStore } from 'next/cache'
import { ExecutionMethod } from 'node-appwrite'

export async function getUserNotifications(): Promise<
  Notifications.NotificationsDocumentsType[]
> {
  unstable_noStore()
  const { functions } = await createSessionServerClient()
  const data = await functions.createExecution(
    'user-endpoints',
    '',
    false,
    `/user/notifications`,
    ExecutionMethod.GET
  )
  const response: Notifications.NotificationsDocumentsType[] = JSON.parse(
    data.responseBody
  )
  console.log(response)
  return response
}
