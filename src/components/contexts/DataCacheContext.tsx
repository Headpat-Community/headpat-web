'use client'
import React, { createContext, useContext, useState, useCallback } from 'react'
import { databases } from '@/app/appwrite-client'
import { UserData, Community } from '@/utils/types/models'

type DataCacheContextType = {
  userCache: Record<string, UserData.UserDataDocumentsType>
  communityCache: Record<string, Community.CommunityDocumentsType>
  fetchUserData: (
    userId: string
  ) => Promise<UserData.UserDataDocumentsType | null>
  fetchCommunityData: (
    communityId: string
  ) => Promise<Community.CommunityDocumentsType | null>
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(
  undefined
)

export const DataCacheProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userCache, setUserCache] = useState<
    Record<string, UserData.UserDataDocumentsType>
  >({})
  const [communityCache, setCommunityCache] = useState<
    Record<string, Community.CommunityDocumentsType>
  >({})

  const fetchUserData = useCallback(
    async (userId: string) => {
      if (userCache[userId]) {
        return userCache[userId]
      }

      try {
        const userData = (await databases.getDocument(
          'hp_db',
          'userdata',
          userId
        )) as UserData.UserDataDocumentsType
        setUserCache((prevCache) => ({ ...prevCache, [userId]: userData }))
        return userData
      } catch (error) {
        console.error('Error fetching user data:', error)
        return null
      }
    },
    [userCache]
  )

  const fetchCommunityData = useCallback(
    async (communityId: string) => {
      if (communityCache[communityId]) {
        return communityCache[communityId]
      }

      try {
        const communityData = (await databases.getDocument(
          'hp_db',
          'community',
          communityId
        )) as Community.CommunityDocumentsType
        setCommunityCache((prevCache) => ({
          ...prevCache,
          [communityId]: communityData,
        }))
        return communityData
      } catch (error) {
        console.error('Error fetching community data:', error)
        return null
      }
    },
    [communityCache]
  )

  return (
    <DataCacheContext.Provider
      value={{ userCache, communityCache, fetchUserData, fetchCommunityData }}
    >
      {children}
    </DataCacheContext.Provider>
  )
}

export const useDataCache = () => {
  const context = useContext(DataCacheContext)
  if (context === undefined) {
    throw new Error('useDataCache must be used within a DataCacheProvider')
  }
  return context
}
