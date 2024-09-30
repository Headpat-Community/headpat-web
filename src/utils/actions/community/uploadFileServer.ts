'use server'
import { ID } from 'node-appwrite'
import { storage } from '@/app/appwrite-server'

export async function UploadFileServer(bucket: string, file: File) {
  return await storage.createFile(bucket, ID.unique(), file).catch((error) => {
    return JSON.parse(JSON.stringify(error))
  })
}
