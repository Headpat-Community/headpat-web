'use client'
import { useCallback, useEffect, useState, useMemo, memo } from 'react'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { toast } from 'sonner'
import { useDataCache } from '@/components/contexts/DataCacheContext'
import { CommunityDocumentsType } from '@/utils/types/models'
import CommunityList from './CommunityList'

// Constants to prevent recreation
const COMMUNITY_ENDPOINT = 'community-endpoints'
const COMMUNITIES_PATH = '/communities?limit=250'
const EXECUTION_METHOD = ExecutionMethod.GET

export default memo(function AllCommunities() {
  const [communities, setCommunities] = useState<CommunityDocumentsType[]>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const { saveAllCache } = useDataCache()

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchCommunities = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await functions.createExecution(
        COMMUNITY_ENDPOINT,
        '',
        false,
        COMMUNITIES_PATH,
        EXECUTION_METHOD
      )

      const response = JSON.parse(data.responseBody)
      setCommunities(response)

      // Cache the communities data
      saveAllCache('communities', response)
    } catch (error) {
      console.error('Failed to fetch communities:', error)
      toast.error('Failed to fetch communities. Please try again later.')
    } finally {
      setIsFetching(false)
    }
  }, [saveAllCache])

  // Memoized effect to prevent unnecessary re-runs
  useEffect(() => {
    fetchCommunities()
  }, [fetchCommunities])

  // Memoized props to prevent unnecessary re-renders of CommunityList
  const communityListProps = useMemo(
    () => ({
      communities,
      isFetching,
      showCreateButton: false,
      emptyStateMessage: 'No communities found',
      loadingMessage: 'Loading...'
    }),
    [communities, isFetching]
  )

  return <CommunityList {...communityListProps} />
})
