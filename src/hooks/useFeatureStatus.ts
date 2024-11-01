'use client'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { databases } from '@/app/appwrite-client'
import { Config } from '@/utils/types/models'

export const useFeatureStatus = (feature: string) => {
  const [featureStatus, setFeatureStatus] =
    useState<Config.ConfigFeaturesDocumentsType>(null)

  useEffect(() => {
    const fetchFeatureStatus = async () => {
      try {
        const data: Config.ConfigFeaturesDocumentsType =
          await databases.getDocument('config', 'features', feature)
        setFeatureStatus(data)
      } catch (error) {
        toast.error('Error fetching feature status')
      }
    }

    fetchFeatureStatus().then()
  }, [feature])

  return featureStatus
}
