'use client'
import { getCookie } from '@/utils/common'
import { storage } from '@/app/appwrite-client'

export function getFile(bucketId: string, fileId: string) {
  const orgId = getCookie('orgId')
  const bucketName = orgId + '-' + bucketId
  return storage.getFile(`${bucketName}`, `${fileId}`)
}
