'use client'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import PageLayout from '@/components/pageLayout'
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
import { useEffect, useState } from 'react'

export default function PageClient({ communityId }: { communityId: string }) {
  const [followers, setFollowers] =
    useState<UserData.UserDataDocumentsType[]>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const fetchFollowers = async () => {
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
    } catch (error) {
      // Do nothing
    }
  }

  useEffect(() => {
    fetchFollowers().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isFetching || !followers) {
    return (
      <PageLayout title={'Friends'}>
        <div className={'flex flex-1 justify-center items-center h-full'}>
          <div className={'p-4 gap-6 text-center'}>
            <h1 className={'text-2xl font-semibold'}>Loading...</h1>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (followers.length === 0) {
    return (
      <PageLayout title={'Friends'}>
        <div className={'flex flex-1 justify-center items-center h-full'}>
          <div className={'p-4 gap-6 text-center'}>
            <h1 className={'text-2xl font-semibold'}>No followers found</h1>
            <p className={'text-muted-foreground'}>
              They don&apos;t have any followers yet.
            </p>
          </div>
        </div>
      </PageLayout>
    )
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 10).replace(/-/g, '.')

  return (
    <PageLayout title={'Followers'}>
      <div
        className={
          'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 5xl:grid-cols-10 gap-4 xl:gap-6 p-4 mx-auto'
        }
      >
        {followers.map((user: UserData.UserDataDocumentsType) => {
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
