'use client'
import React from 'react'

import { databases, storage } from '@/app/appwrite-client'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { UserDataDocumentsType } from '@/utils/types/models'
import { ImageUploader } from '../gallery/upload/ImageUploader'

export default function UploadAvatar({
  isUploading,
  setIsUploading,
  userId,
  userData,
}) {
  // Helper to get avatar image URL
  const getAvatarImageUrl = (avatarId: string) => {
    if (!avatarId) return undefined
    return storage.getFileView('avatars', `${avatarId}`)
  }

  // onAfterUpload callback for ImageUploader
  const handleAfterUpload = async (fileId: string, _file: File) => {
    try {
      // Get the user's avatar document
      const avatarDocument: UserDataDocumentsType = await databases.getDocument(
        'hp_db',
        'userdata',
        userId
      )
      // If the user already has an avatar, delete it
      if (avatarDocument.avatarId) {
        await storage
          .deleteFile('avatars', avatarDocument.avatarId)
          .catch((error) => {
            //console.error(error)
            Sentry.captureException('Failed to delete old avatar.', error)
          })
      }
      // Update the user's avatarId
      await databases.updateDocument('hp_db', 'userdata', userId, {
        avatarId: fileId,
      })
      toast.success('Your avatar has been uploaded successfully.')
    } catch (error) {
      toast.error('Failed to upload avatar.')
      Sentry.captureException(error)
    }
  }

  return (
    <ImageUploader
      isUploading={isUploading}
      setIsUploading={setIsUploading}
      aspect={1}
      maxSizeInBytes={1024 * 1024}
      storageBucket="avatars"
      currentImageId={userData?.avatarId}
      getImageUrl={getAvatarImageUrl}
      onAfterUpload={handleAfterUpload}
      label="Avatar image"
      description="JPG, PNG or WebP. 1MB max."
      recommendedResolution="512x512 resolution recommended."
      defaultImage="/logos/hp_logo_x512.webp"
    />
  )
}
