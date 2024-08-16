import PageLayout from '@/components/pageLayout'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Card } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CakeIcon, CalendarDays } from 'lucide-react'
import { UserData } from '@/utils/types/models'
import { getFollowers } from '@/utils/server-api/followers/getFollowers'
import { Link } from '@/navigation'
import { getUserDataFromProfileUrl } from '@/utils/server-api/user/getUserData'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { getCommunityFollowers } from '@/utils/server-api/community-followers/getCommunityFollowers'

export const runtime = 'edge'

export default async function FollowerPage({
  params: { locale, communityId },
}: {
  params: { locale: string; communityId: string }
}) {
  const { databases } = await createSessionServerClient()
  const followers = await getCommunityFollowers(communityId)

  // For each follower, look up their user data
  const followerData = await Promise.all(
    followers.documents.map(async (follower) => {
      return await databases.getDocument('hp_db', 'userdata', follower.userId)
    })
  )

  if (followerData.length === 0) {
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
        {followerData.map((user: UserData.UserDataDocumentsType) => {
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
