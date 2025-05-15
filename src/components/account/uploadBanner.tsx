'use client'
import React from 'react'
import { databases, storage } from '@/app/appwrite-client'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { UserDataDocumentsType } from '@/utils/types/models'
import { ImageUploader } from '../gallery/upload/ImageUploader'

export default function UploadBanner({
  isUploading,
  setIsUploading,
  userId,
  userData,
}) {
  const getBannerImageUrl = (bannerId: string) => {
    if (!bannerId) return undefined
    return storage.getFileView('banners', `${bannerId}`)
  }

  const handleAfterUpload = async (fileId: string, _file: File) => {
    try {
      // Get the user's banner document
      const bannerDocument: UserDataDocumentsType = await databases.getDocument(
        'hp_db',
        'userdata',
        userId
      )
      // If the user already has a banner, delete it
      if (bannerDocument.profileBannerId) {
        await storage
          .deleteFile('banners', bannerDocument.profileBannerId)
          .catch((error) => {
            Sentry.captureException('Failed to delete old banner.', error)
          })
      }
      // Update the user's bannerId
      await databases.updateDocument('hp_db', 'userdata', userId, {
        profileBannerId: fileId,
      })
      toast.success('Your banner has been uploaded successfully.')
    } catch (error) {
      toast.error('Failed to upload banner.')
      Sentry.captureException(error)
    }
  }

  return (
    <ImageUploader
      isUploading={isUploading}
      setIsUploading={setIsUploading}
      aspect={4.8}
      maxSizeInBytes={5 * 1024 * 1024}
      storageBucket="banners"
      currentImageId={userData?.profileBannerId}
      getImageUrl={getBannerImageUrl}
      onAfterUpload={handleAfterUpload}
      label="Banner image"
      description="JPG, PNG or WebP. 5MB max."
      recommendedResolution="1200x250 resolution recommended."
      defaultImage="/logos/hp_logo_x512.webp"
    />
  )
}
