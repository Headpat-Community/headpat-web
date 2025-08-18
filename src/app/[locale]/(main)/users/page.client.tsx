'use client'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { databases, Query } from '@/app/appwrite-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import UserCard from '@/components/user/userCard'
import { UserDataDocumentsType, UserDataType } from '@/utils/types/models'
import { useTranslations } from 'gt-next/client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const USERS_PER_PAGE = 50 // Reduced from 250 to improve performance

export default function ClientPage() {
  const t = useTranslations('UsersPage')
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clean up queries when component unmounts
      queryClient.removeQueries({ queryKey: ['users'] })
    }
  }, [queryClient])

  const {
    data: users,
    isLoading,
    isError
  } = useQuery<UserDataDocumentsType[]>({
    queryKey: ['users', currentPage],
    queryFn: async () => {
      try {
        const response: UserDataType = await databases.listDocuments(
          'hp_db',
          'userdata',
          [
            Query.orderDesc('$createdAt'),
            Query.limit(USERS_PER_PAGE),
            Query.offset(currentPage * USERS_PER_PAGE)
          ]
        )

        // Update total count on first page
        if (currentPage === 0) {
          setTotalUsers(response.total)
        }

        return response.documents
      } catch (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users. Please try again later.')
        return []
      }
    },
    staleTime: 300 * 1000, // 5 minutes
    refetchOnMount: false, // Prevent unnecessary refetches
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnReconnect: false, // Prevent refetch on reconnect
    gcTime: 600 * 1000, // 10 minutes garbage collection time
    retry: 2, // Limit retry attempts
    retryDelay: 1000 // 1 second delay between retries
  })

  // Memoize pagination calculations
  const paginationInfo = useMemo(() => {
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE)
    const hasNextPage = currentPage < totalPages - 1
    const hasPrevPage = currentPage > 0

    return {
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPage: currentPage + 1
    }
  }, [currentPage, totalUsers])

  // Memoize pagination handlers
  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1)
  }, [])

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }, [])

  // Memoize the users grid to prevent unnecessary re-renders
  const usersGrid = useMemo(() => {
    if (!users) return null

    return (
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
        }
      >
        {users.map((user) => (
          <Card className={'border-none h-40 w-40 mx-auto'} key={user.$id}>
            <UserCard user={user} isChild>
              <div className={'h-full w-full'}>
                {user.avatarId ? (
                  <Image
                    src={
                      getAvatarImageUrlPreview(
                        user.avatarId,
                        'width=250&height=250'
                      ) || null
                    }
                    alt={user.displayName}
                    className="object-cover rounded-md"
                    width={250}
                    height={250}
                    loading="lazy" // Add lazy loading for better performance
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center text-wrap truncate">
                    <p className="px-2 text-gray-400 text-center truncate">
                      {user.displayName}
                    </p>
                  </div>
                )}
              </div>
            </UserCard>
          </Card>
        ))}
      </div>
    )
  }, [users])

  if (isLoading) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>{t('loading')}</h1>
        </div>
      </div>
    )
  }

  if (isError || !users || users.length === 0) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>{t('noUsers')}</h1>
          <p className={'text-muted-foreground'}>{t('noUsersDescription')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Users Grid */}
      {usersGrid}

      {/* Pagination */}
      {paginationInfo.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 pb-6">
          <Button
            onClick={handlePrevPage}
            disabled={!paginationInfo.hasPrevPage}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-muted-foreground">
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
          </span>

          <Button
            onClick={handleNextPage}
            disabled={!paginationInfo.hasNextPage}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
