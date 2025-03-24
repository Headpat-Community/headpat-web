'use client'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { ExecutionMethod } from 'node-appwrite'
import { functions } from '@/app/appwrite-client'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import UserCard from '@/components/user/userCard'
import { UserDataDocumentsType, UserDataType } from '@/utils/types/models'

export default function ClientPage({ userData }: { userData: UserDataType }) {
  const [users, setUsers] = useState<UserDataDocumentsType[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const user = userData.documents[0]

  const fetchUsers = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await functions.createExecution(
        'user-endpoints',
        '',
        false,
        `/user/following?userId=${user.$id}&limit=250`, // You can specify a static limit here if desired
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)
      setUsers(response)
    } catch (error) {
      console.log(error)
      toast('Failed to fetch users. Please try again later.')
    } finally {
      setIsFetching(false)
    }
  }, [user.$id])

  useEffect(() => {
    fetchUsers().then()
  }, [fetchUsers])

  if (isFetching && users.length === 0) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (!isFetching && users.length === 0) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>So quiet here...</h1>
          <p className={'text-muted-foreground'}>
            {user?.displayName} hasn&apos;t followed anyone yet. Maybe they are
            just waiting for the perfect moment!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
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
                    width={1000}
                    height={1000}
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center text-wrap truncate">
                    <p className="text-gray-400 text-center">
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
  )
}
