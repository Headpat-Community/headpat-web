'use server'
import { ID } from 'node-appwrite'
import { storage } from '@/app/appwrite-server'

export async function UploadBannerServer(file: any) {
  return await storage.createFile('community-banners', ID.unique(), file)
}
