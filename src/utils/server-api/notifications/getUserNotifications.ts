import { createSessionServerClient } from '@/app/appwrite-session'
import { Notifications } from '@/utils/types/models'

export async function getUserNotifications(): Promise<Notifications.NotificationsType> {
  const { databases } = await createSessionServerClient()
  return await databases.listDocuments('hp_db', 'user-notifications')
}
