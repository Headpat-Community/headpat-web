"use client"
import { databases } from "@/app/appwrite-client"
import type { ConfigFeaturesDocumentsType } from "@/utils/types/models"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export const useFeatureStatus = (feature: string) => {
  const [featureStatus, setFeatureStatus] =
    useState<ConfigFeaturesDocumentsType | null>(null)

  useEffect(() => {
    const fetchFeatureStatus = async () => {
      try {
        const data: ConfigFeaturesDocumentsType = await databases.getRow({
          databaseId: "config",
          tableId: "features",
          rowId: feature,
        })
        setFeatureStatus(data)
      } catch {
        toast.error("Error fetching feature status")
      }
    }

    void fetchFeatureStatus()
  }, [feature])

  return featureStatus
}
