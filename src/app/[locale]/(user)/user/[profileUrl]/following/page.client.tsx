'use client'
import { UserData } from '@/utils/types/models'
import { Card } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Link } from '@/navigation'
import Image from 'next/image'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CakeIcon, CalendarDays } from 'lucide-react'
import { ExecutionMethod } from 'node-appwrite'
import { functions } from '@/app/appwrite-client'
import PageLayout from '@/components/pageLayout'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function ClientPage({
  userData,
}: {
  userData: UserData.UserDataType
}) {
  const [users, setUsers] = useState<UserData.UserDataDocumentsType[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const user = userData.documents[0]

  const fetchUsers = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await functions.createExecution(
        '65e2126d9e431eb3c473',
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
  }, [])

  useEffect(() => {
    fetchUsers().then()
  }, [fetchUsers])

  const formatDate = (date: Date) =>
    date
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '.')

  if (isFetching && users.length === 0) {
    return (
      <PageLayout title={`${user?.displayName}'s following`}>
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
      <PageLayout title={`${user?.displayName}'s following`}>
        <div className={'flex flex-1 justify-center items-center h-full'}>
          <div className={'p-4 gap-6 text-center'}>
            <h1 className={'text-2xl font-semibold'}>So lonely..</h1>
            <p className={'text-muted-foreground'}>
              {user?.displayName} is not following anyone at the moment. You
              could blackmail them into following you. Just a thought.
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title={`${user?.displayName}'s following`}>
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
        }
      >
        {users.map((user) => {
          const today = formatDate(new Date())
          const birthday = user.birthday
            ? formatDate(new Date(user.birthday))
            : '01/01/1900'

          const isBirthday = birthday !== '01/01/1900' && birthday === today

          return (
            <Card className={'border-none h-40 w-40 mx-auto'} key={user.$id}>
              <HoverCard openDelay={100} closeDelay={100}>
                <HoverCardTrigger>
                  <div className={'h-full w-full'}>
                    <Link
                      href={{
                        pathname: '/user/[profileUrl]',
                        params: { profileUrl: user.profileUrl },
                      }}
                    >
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
                    </Link>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={
                          getAvatarImageUrlPreview(
                            user.avatarId,
                            'width=250&height=250'
                          ) || null
                        }
                      />
                      <AvatarFallback>
                        {user.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{`@${user.displayName}`}</h4>
                      <p className="text-sm flex-wrap">{user.status}</p>
                      {isBirthday && (
                        <div className="flex items-center pt-2">
                          <CakeIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                          <span className="text-xs text-muted-foreground">
                            Today is my birthday!
                          </span>
                        </div>
                      )}
                      <div className="flex items-center pt-2">
                        <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                        <span className="text-xs text-muted-foreground">
                          Joined {formatDate(new Date(user.$createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          )
        })}
      </div>
    </PageLayout>
  )
}
