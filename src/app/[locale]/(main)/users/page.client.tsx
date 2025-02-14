'use client'
import { UserData } from '@/utils/types/models'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { databases, Query } from '@/app/appwrite-client'
import PageLayout from '@/components/pageLayout'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import UserCard from '@/components/user/userCard'
import { useDataCache } from '@/components/contexts/DataCacheContext'

export default function ClientPage({ locale }: { locale: string }) {
  const [users, setUsers] = useState<UserData.UserDataDocumentsType[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const { getAllCache, saveAllCache } = useDataCache()

  const fetchUsers = useCallback(
    async (limit: number, offset: number) => {
      setIsFetching(true)
      const cache = await getAllCache<UserData.UserDataDocumentsType[]>('users')
      const usersMapping = cache.map((item) => item.data) // Assuming each CacheItem has a 'data' property
      if (usersMapping.length > 0) {
        const sortedUsers = usersMapping
          .flat()
          .sort(
            (a, b) =>
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime()
          )
        setUsers(sortedUsers)
        setIsFetching(false)
      }
      try {
        const response: UserData.UserDataType = await databases.listDocuments(
          'hp_db',
          'userdata',
          [
            Query.orderDesc('$createdAt'),
            Query.limit(limit),
            Query.offset(offset),
          ]
        )
        setUsers(response.documents)
        saveAllCache('users', response.documents)
      } catch (error) {
        toast.error('Failed to fetch users. Please try again later.')
      } finally {
        setIsFetching(false)
      }
    },
    [getAllCache, saveAllCache]
  )

  useEffect(() => {
    fetchUsers(250, 0).then()
  }, [fetchUsers])

  if (isFetching && users.length === 0) {
    return (
      <PageLayout title={'Users'}>
        <div className={'flex flex-1 justify-center items-center h-full'}>
          <div className={'p-4 gap-6 text-center'}>
            <h1 className={'text-2xl font-semibold'}>Loading...</h1>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!isFetching && users.length === 0) {
    return (
      <PageLayout title={'Users'}>
        <div className={'flex flex-1 justify-center items-center h-full'}>
          <div className={'p-4 gap-6 text-center'}>
            <h1 className={'text-2xl font-semibold'}>No users!</h1>
            <p className={'text-muted-foreground'}>
              There are no users to show at the moment.
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={'Users'}>
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
        }
      >
        {users.map((user) => {
          return (
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
          )
        })}
      </div>
    </PageLayout>
  )
}
