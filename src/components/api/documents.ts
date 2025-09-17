"use client"
import { databases } from "@/app/appwrite-client"
import type { Models } from "node-appwrite"

/**
 * Get a document
 * @param databaseId
 * @param collectionId
 * @param documentId
 */
export function getDocument<T extends Models.Row>(
  databaseId: string,
  collectionId: string,
  documentId: string
): Promise<T> {
  return databases.getRow({
    databaseId: `${databaseId}`,
    tableId: `${collectionId}`,
    rowId: `${documentId}`,
  })
}

/**
 * List documents in a collection
 * @param databaseId
 * @param collectionId
 * @param query
 */
export function listDocuments<T extends Models.Row>(
  databaseId: string,
  collectionId: string,
  query?: any
): Promise<Models.RowList<T>> {
  return databases.listRows({
    databaseId: `${databaseId}`,
    tableId: `${collectionId}`,
    queries: query,
  })
}

/**
 * Update a document
 * @param databaseId
 * @param collectionId
 * @param documentId
 * @param body
 */
export function updateDocument<T extends Models.Row>(
  databaseId: string,
  collectionId: string,
  documentId: string,
  body: any
): Promise<T> {
  return databases.updateRow({
    databaseId: `${databaseId}`,
    tableId: `${collectionId}`,
    rowId: `${documentId}`,
    data: body,
  })
}
