"use client"
import { databases } from "@/app/appwrite-client"
import type { Models } from "node-appwrite"

/**
 * Get a document
 * @param databaseId
 * @param collectionId
 * @param documentId
 */
export function getDocument<T extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string
): Promise<T> {
  return databases.getDocument(
    `${databaseId}`,
    `${collectionId}`,
    `${documentId}`
  )
}

/**
 * List documents in a collection
 * @param databaseId
 * @param collectionId
 * @param query
 */
export function listDocuments<T extends Models.Document>(
  databaseId: string,
  collectionId: string,
  query?: any
): Promise<Models.DocumentList<T>> {
  return databases.listDocuments(`${databaseId}`, `${collectionId}`, query)
}

/**
 * Update a document
 * @param databaseId
 * @param collectionId
 * @param documentId
 * @param body
 */
export function updateDocument<T extends Models.Document>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  body: any
): Promise<T> {
  return databases.updateDocument(
    `${databaseId}`,
    `${collectionId}, ${documentId}`,
    body
  )
}
