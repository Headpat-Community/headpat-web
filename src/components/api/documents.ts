'use client'
import { databases, Query } from '@/app/appwrite-client'
import { Models } from 'node-appwrite'

export function getDocument<T extends Models.Document>(
  collectionId: string,
  documentId: string
): Promise<T> {
  return databases.getDocument(`hp_db`, `${collectionId}`, `${documentId}`)
}

export function listDocuments<T extends Models.Document>(
  collectionId: string,
  query?: any
): Promise<Models.DocumentList<T>> {
  return databases.listDocuments(`hp_db`, `${collectionId}`, query)
}

export function updateDocument<T extends Models.Document>(
  collectionId: string,
  documentId: string,
  body: any
): Promise<T> {
  return databases.updateDocument(
    `hp_db`,
    `${collectionId}, ${documentId}`,
    body
  )
}
