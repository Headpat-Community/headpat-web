import { Events } from '@/utils/types/models'
import { createSessionServerClient } from '@/app/appwrite-session'

/**
 * This function is used to get the events data
 * @example
 * const events = await getEvents()
 */
export async function getEvents(): Promise<Events.EventsType> {
  const { databases } = await createSessionServerClient()
  return await databases.listDocuments('hp_db', 'events').catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}
