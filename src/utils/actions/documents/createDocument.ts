'use server'
import { createSessionServerClient } from '@/app/appwrite-session'

export async function createDocument(
  database: string,
  collection: string,
  documentId: string,
  body: any
) {
  const { databases } = await createSessionServerClient()
  return await databases.createDocument(database, collection, documentId, body)
}
