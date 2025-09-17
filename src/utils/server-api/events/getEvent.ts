import { createSessionServerClient } from "@/app/appwrite-session"
import type { EventsDocumentsType } from "@/utils/types/models"

/**
 * This function is used to get the event data
 * @example
 * const event = await getEvent()
 */
export async function getEvent(eventId: string): Promise<EventsDocumentsType> {
  const { databases } = await createSessionServerClient()
  return await databases
    .getRow({
      databaseId: "hp_db",
      tableId: "events",
      rowId: eventId,
    })
    .catch((error) => {
      return JSON.parse(JSON.stringify(error))
    })
}
