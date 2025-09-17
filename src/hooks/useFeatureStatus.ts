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
          databaseId: "hp_db",
          tableId: "config",
          rowId: feature,
        })
        setFeatureStatus(data)
      } catch {
        toast.error("Error fetching feature status")
      }
    }

    fetchFeatureStatus().then()
  }, [feature])

  return featureStatus
}
