import { createSessionServerClient } from '@/app/appwrite-session'
import { Notifications } from '@/utils/types/models'
import { unstable_noStore } from 'next/cache'

export async function getUserNotifications(): Promise<Notifications.NotificationsType> {
  unstable_noStore()
  const { databases } = await createSessionServerClient()
  return await databases.listDocuments('hp_db', 'user-notifications')
}
