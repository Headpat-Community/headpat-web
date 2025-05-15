'use client'
import React from 'react'
import { databases, functions, storage } from '@/app/appwrite-client'
import { toast } from 'sonner'
import * as Sentry from '@sentry/nextjs'
import { ExecutionMethod } from 'node-appwrite'
import { CommunityDocumentsType } from '@/utils/types/models'
import { ImageUploader } from '../gallery/upload/ImageUploader'

export default function UploadBanner({
  isUploading,
  setIsUploading,
  communityData,
}) {
  const getBannerImageUrl = (bannerId: string) => {
    if (!bannerId) return undefined
    return storage.getFileView('community-banners', `${bannerId}`)
  }

  const handleBeforeUpload = async (file: File) => {
    // Pre-upload function call
    const data = await functions.createExecution(
      'community-endpoints',
      '',
      false,
      `/community/upload?communityId=${communityData.$id}&type=banner`,
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
      const bannerDocument: CommunityDocumentsType =
        await databases.getDocument('hp_db', 'community', communityData.$id)
      // If the community already has a banner, delete it
      if (bannerDocument.bannerId) {
        await storage
          .deleteFile('community-banners', bannerDocument.bannerId)
          .catch((error) => {
            Sentry.captureException('Failed to delete old banner.', error)
          })
      }
      // Update the community's bannerId
      await databases.updateDocument('hp_db', 'community', communityData.$id, {
        bannerId: fileId,
      })
      toast.success('Your banner has been uploaded successfully.')
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
      storageBucket="community-banners"
      currentImageId={communityData?.bannerId}
      getImageUrl={getBannerImageUrl}
      onBeforeUpload={handleBeforeUpload}
      onAfterUpload={handleAfterUpload}
      label="Banner image"
      description="JPG, PNG or WebP. 5MB max."
      recommendedResolution="1200x250 resolution recommended."
      defaultImage="/logos/hp_logo_x512.webp"
    />
  )
}
