'use client'
import { databases, Query } from '@/app/appwrite-client'

export function getDocument(collectionId: string, documentId: string) {
  return databases.getDocument(`hp_db`, `${collectionId}`, `${documentId}`)
}

export function listDocuments(collectionId: string) {
  return databases.listDocuments(`hp_db`, `${collectionId}`, [Query.limit(50)])
}

export function updateDocument(
  collectionId: string,
  documentId: string,
  body: any
) {
  return databases.updateDocument(
    `hp_db`,
    `${collectionId}, ${documentId}`,
    body
  )
}
