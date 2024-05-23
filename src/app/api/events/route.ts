import { createSessionClient } from '@/app/appwrite-session'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { databases } = await createSessionClient(request)

  try {
    const eventList = await databases.listDocuments('hp_db', 'events')
    return Response.json(eventList)
  } catch (error) {
    return Response.json(error)
  }
}
