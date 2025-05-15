'use client'
import React from 'react'
import { databases, functions, storage } from '@/app/appwrite-client'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { ExecutionMethod } from 'node-appwrite'
import { ImageUploader } from '../gallery/upload/ImageUploader'
import { CommunityDocumentsType } from '@/utils/types/models'

export default function UploadAvatar({
  isUploading,
  setIsUploading,
  communityData,
}) {
  const getAvatarImageUrl = (avatarId: string) => {
    if (!avatarId) return undefined
    return storage.getFileView('community-avatars', `${avatarId}`)
  }

  const handleBeforeUpload = async (file: File) => {
    // Pre-upload function call
    const data = await functions.createExecution(
      'community-endpoints',
      '',
      false,
      `/community/upload?communityId=${communityData.$id}&type=avatar`,
      ExecutionMethod.POST
    )
    const response = JSON.parse(data.responseBody)
    if (response.type === 'community_upload_missing_id') {
      toast.error('Community ID is missing. Please try again later.')
      return
    } else if (response.type === 'unauthorized') {
      toast.error('You are not authorized to upload.')
      return
    } else if (response.type === 'community_upload_missing_type') {
      toast.error('Missing upload type. Please try again later.')
      return
    }
  }

  const handleAfterUpload = async (
    fileId: string,
    _file: File
  ): Promise<void> => {
    try {
      // Get the community document
      const avatarDocument: CommunityDocumentsType =
        await databases.getDocument('hp_db', 'community', communityData.$id)
      // If the community already has an avatar, delete it
      if (avatarDocument.avatarId) {
        await storage
          .deleteFile('community-avatars', avatarDocument.avatarId)
          .catch((error) => {
            Sentry.captureException('Failed to delete old avatar.', error)
          })
      }
      // Update the community's avatarId
      await databases.updateDocument('hp_db', 'community', communityData.$id, {
        avatarId: fileId,
      })
      toast.success('Your avatar has been uploaded successfully.')
      // Post-upload function call
      await functions.createExecution(
        'community-endpoints',
        '',
        true,
        `/community/upload/finish?communityId=${communityData.$id}`,
        ExecutionMethod.POST
      )
      window.location.reload()
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
      storageBucket="community-avatars"
      currentImageId={communityData?.avatarId}
      getImageUrl={getAvatarImageUrl}
      onBeforeUpload={handleBeforeUpload}
      onAfterUpload={handleAfterUpload}
      label="Avatar image"
      description="JPG, PNG or WebP. 1MB max."
      recommendedResolution="512x512 resolution recommended."
      defaultImage="/logos/hp_logo_x512.webp"
    />
  )
}
