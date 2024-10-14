import { Events } from '@/utils/types/models'
import {
  createAdminClient,
  createSessionServerClient,
} from '@/app/appwrite-session'

/**
 * This function is used to get the events data
 * @example
 * const events = await getEvents()
 */
export async function getEvents(): Promise<Events.EventsType> {
  const { databases } = await createAdminClient()
  return await databases.listDocuments('hp_db', 'events').catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}
