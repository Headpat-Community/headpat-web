import type { EventsDocumentsType } from "@/utils/types/models"
import { createSessionServerClient } from "@/app/appwrite-session"

/**
 * This function is used to get the event data
 * @example
 * const event = await getEvent()
 */
export async function getEvent(eventId: string): Promise<EventsDocumentsType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .getDocument("hp_db", "events", eventId)
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
