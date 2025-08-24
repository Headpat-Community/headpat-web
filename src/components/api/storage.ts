"use client"
import { storage } from "@/app/appwrite-client"

export function getFile(bucketId: string, fileId: string) {
  return storage.getFile(`${bucketId}`, `${fileId}`)
}
