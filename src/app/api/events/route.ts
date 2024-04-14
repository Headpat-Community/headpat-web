import { createSessionClient } from '@/app/appwrite-session'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { databases } = await createSessionClient(request)

  try {
    const eventData = await databases.listDocuments('hp_db', 'events')
    return Response.json({ databases: eventData })
  } catch (error) {
    return Response.json(error)
  }
}
