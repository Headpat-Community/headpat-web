"use client"
import React from "react"
import { databases, functions, storage } from "@/app/appwrite-client"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { ExecutionMethod } from "node-appwrite"
import type { CommunityDocumentsType } from "@/utils/types/models"
import { ImageUploader } from "../gallery/upload/ImageUploader"

export default function UploadBanner({
  isUploading,
  setIsUploading,
  communityData,
}: {
  isUploading: boolean
  setIsUploading: (isUploading: boolean) => void
  communityData: CommunityDocumentsType
}) {
  const getBannerImageUrl = (bannerId: string) => {
    if (!bannerId) return undefined
    return storage.getFileView("community-banners", `${bannerId}`)
  }

  const handleBeforeUpload = async () => {
    // Pre-upload function call
    const data = await functions.createExecution({
      functionId: "community-endpoints",
      async: false,
      xpath: `/community/upload?communityId=${communityData.$id}&type=banner`,
      method: ExecutionMethod.POST,
    })
    const response = JSON.parse(data.responseBody)
    if (response.type === "community_upload_missing_id") {
      toast.error("Community ID is missing. Please try again later.")
      return
    } else if (response.type === "unauthorized") {
      toast.error("You are not authorized to upload.")
      return
    } else if (response.type === "community_upload_missing_type") {
      toast.error("Missing upload type. Please try again later.")
      return
    }
  }

  const handleAfterUpload = async (fileId: string): Promise<void> => {
    try {
      // Get the community document
      const bannerDocument: CommunityDocumentsType = await databases.getRow({
        databaseId: "hp_db",
        tableId: "community",
        rowId: communityData.$id,
      })
      // If the community already has a banner, delete it
      if (bannerDocument.bannerId) {
        await storage
          .deleteFile("community-banners", bannerDocument.bannerId)
          .catch((error) => {
            Sentry.captureException("Failed to delete old banner.", error)
          })
      }
      // Update the community's bannerId
      await databases.updateRow({
        databaseId: "hp_db",
        tableId: "community",
        rowId: communityData.$id,
        data: {
          bannerId: fileId,
        },
      })
      toast.success("Your banner has been uploaded successfully.")
      // Post-upload function call
      await functions.createExecution({
        functionId: "community-endpoints",
        async: true,
        xpath: `/community/upload/finish?communityId=${communityData.$id}`,
        method: ExecutionMethod.POST,
      })
      window.location.reload()
    } catch (error) {
      toast.error("Failed to upload banner.")
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
