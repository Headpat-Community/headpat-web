'use client'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { useCallback, useEffect, useState } from 'react'
import UserCard from '@/components/user/userCard'
import { UserDataDocumentsType } from '@/utils/types/models'

export default function PageClient({ communityId }: { communityId: string }) {
  const [followers, setFollowers] = useState<UserDataDocumentsType[]>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const fetchFollowers = useCallback(async () => {
    try {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community/followers?communityId=${communityId}`, // You can specify a static limit here if desired
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)
      setFollowers(response)
      setIsFetching(false)
    } catch {
      // Do nothing
    }
  }, [communityId])

  useEffect(() => {
    fetchFollowers().then()
  }, [fetchFollowers])

  if (isFetching || !followers) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (followers.length === 0) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>No followers found</h1>
          <p className={'text-muted-foreground'}>
            They don&apos;t have any followers yet.
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
      {followers.map((user: UserDataDocumentsType) => {
        return (
          <Card className={'border-none h-40 w-40 mx-auto'} key={user.$id}>
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
          </Card>
        )
      })}
    </div>
  )
}
