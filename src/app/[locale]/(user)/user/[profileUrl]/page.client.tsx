'use client'
import { databases } from '@/app/appwrite-client'
import { useUser } from '@/components/contexts/UserContext'
import {
  getAvatarImageUrlView,
  getBannerImageUrlPreview
} from '@/components/getStorageItem'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { addFollow } from '@/utils/actions/followers/addFollow'
import { removeFollow } from '@/utils/actions/followers/removeFollow'
import { UserProfileDocumentsType } from '@/utils/types/models'
import {
  SiDiscord,
  SiFuraffinity,
  SiTelegram,
  SiTwitch,
  SiX
} from '@icons-pack/react-simple-icons'
import * as Sentry from '@sentry/nextjs'
import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Query } from 'node-appwrite'
import { useState } from 'react'
import sanitizeHtml from 'sanitize-html'
import { toast } from 'sonner'

function FollowerButton({ displayName, followerId, isFollowing }) {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing || false)

  const handleFollow = async () => {
    const data = await addFollow(followerId)

    if (data.type === 'addfollow_missing_id') {
      return toast.error('No user ID provided')
    } else if (data.type === 'addfollow_unauthorized') {
      return toast.error('You must be logged in to follow users')
    } else if (data.type === 'addfollow_same_user') {
      return toast.error('You cannot follow yourself')
    } else if (data.type === 'addfollow_already_following') {
      return toast.error('You are already following this user')
    } else if (data.type === 'addfollow_delete_error') {
      return toast.error('There was an error following this user.')
    } else {
      toast.success(`You have followed ${displayName}`)
      setIsFollowingState(true)
    }
  }

  const handleUnfollow = async () => {
    const data = await removeFollow(followerId)

    if (data.type === 'removefollow_missing_id') {
      return toast.error('No user ID provided')
    } else if (data.type === 'removefollow_unauthorized') {
      return toast.error('You must be logged in to follow users')
    } else if (data.type === 'removefollow_same_user') {
      return toast.error('You cannot unfollow yourself')
    } else if (data.type === 'removefollow_not_following') {
      return toast.error('You are not following this user')
    } else if (data.type === 'removefollow_delete_error') {
      return toast.error('There was an error unfollowing this user.')
    } else {
      toast.success(`You have unfollowed ${displayName}`)
      setIsFollowingState(false)
    }
  }

  return (
    <>
      <Button onClick={isFollowingState ? handleUnfollow : handleFollow}>
        {isFollowingState ? 'Unfollow' : 'Follow'}
      </Button>
    </>
  )
}

export default function PageClient({ userId }: { userId: string }) {
  const { current } = useUser()

  const { data: userData, isLoading } = useQuery<UserProfileDocumentsType>({
    queryKey: ['user', userId],
    queryFn: async () => {
      try {
        // Prepare the queries
        const queries = [
          databases.getDocument('hp_db', 'userdata', userId),
          databases.listDocuments('hp_db', 'followers', [
            Query.equal('followerId', userId),
            Query.limit(1)
          ]),
          databases.listDocuments('hp_db', 'followers', [
            Query.equal('userId', userId),
            Query.limit(1)
          ]),
          databases.getDocument('hp_db', 'userprefs', userId).catch(() => null)
        ]

        // Only add isFollowingResponse if user is logged in
        let isFollowingResponse = { total: 0 }
        if (current?.$id) {
          queries.splice(
            3,
            0, // insert before prefs
            databases.listDocuments('hp_db', 'followers', [
              Query.and([
                Query.equal('userId', current.$id),
                Query.equal('followerId', userId)
              ])
            ])
          )
        }

        // Await all queries
        const results = await Promise.all(queries)

        // Destructure results based on whether isFollowingResponse was included
        const [
          userData,
          followers,
          following,
          maybeIsFollowingResponse,
          prefs
        ] = results

        if (current?.$id) {
          isFollowingResponse = maybeIsFollowingResponse
        }

        const isFollowing = isFollowingResponse.total > 0 ? true : false

        // Combine the data
        const combinedData: UserProfileDocumentsType = {
          ...userData,
          followersCount: followers.total,
          followingCount: following.total,
          prefs: prefs,
          isFollowing
        }

        return combinedData
      } catch (error) {
        console.error('Error fetching user data:', error)
        Sentry.captureException(error)
        throw error
      }
    },
    enabled: !!userId,
    staleTime: 300 * 1000, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  if (isLoading || !userData) {
    return <>Loading, please wait.</>
  }

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 10).replace(/-/g, '.')

  const formatDayMonth = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 5).replace(/-/g, '.')

  const today = formatDayMonth(new Date())
  const birthday = userData?.birthday
    ? formatDate(new Date(userData.birthday))
    : '01/01/1900'

  const isBirthday = birthday === today

  const sanitizedBio = sanitizeHtml(userData?.bio)
  const bioWithLineBreaks = sanitizedBio.replace(/\n/g, '<br />')

  return (
    <main className={'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
      {/* Header */}
      {userData.profileBannerId && (
        <header className={'p-0 py-4'}>
          <div>
            <Image
              src={getBannerImageUrlPreview(
                userData.profileBannerId,
                'width=1200&height=250&output=webp'
              )}
              alt={'User Banner'}
              className={
                'rounded-md object-cover max-w-[1200px] max-h-[250px] w-full h-auto'
              }
              width={1200}
              height={250}
              priority={true}
            />
          </div>
        </header>
      )}

      {/* Grid */}
      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2 gap-y-8 lg:grid-cols-3 lg:gap-x-8',
          userData.profileBannerId ? 'mt-0' : 'mt-8'
        )}
      >
        {/* Left */}
        <div className={'col-span-1 lg:col-span-1'}>
          <AspectRatio ratio={1}>
            <Image
              src={getAvatarImageUrlView(userData.avatarId)}
              alt={'User Avatar'}
              className={cn('object-contain rounded-t-xl', {
                'rounded-b-xl': !(
                  userData.discordname ||
                  userData.telegramname ||
                  userData.furaffinityname ||
                  userData.X_name ||
                  userData.twitchname
                )
              })}
              fill={true}
              priority={true}
              unoptimized
            />
            {isBirthday && (
              <Badge className="absolute top-0 right-0 rounded-t rounded-b-none w-full justify-center">
                It&apos;s my birthday!
              </Badge>
            )}
          </AspectRatio>

          {(userData.discordname ||
            userData.telegramname ||
            userData.furaffinityname ||
            userData.X_name ||
            userData.twitchname) && (
              <Card className="border-border rounded-t-none">
                <CardContent className="p-4">
                  <ul>
                    {userData.discordname && (
                      <>
                        <ListSocialItem
                          IconComponent={SiDiscord}
                          userData={userData.discordname}
                          link={'#'}
                        />
                        {(userData.telegramname ||
                          userData.furaffinityname ||
                          userData.X_name ||
                          userData.twitchname) && <Separator />}
                      </>
                    )}
                    {userData.telegramname && (
                      <>
                        <ListSocialItem
                          IconComponent={SiTelegram}
                          userData={userData.telegramname}
                          link={`https://t.me/${userData.telegramname}`}
                        />
                        {(userData.furaffinityname ||
                          userData.X_name ||
                          userData.twitchname) && <Separator />}
                      </>
                    )}
                    {userData.furaffinityname && (
                      <>
                        <ListSocialItem
                          IconComponent={SiFuraffinity}
                          userData={userData.furaffinityname}
                          link={`https://www.furaffinity.net/user/${userData.furaffinityname}`}
                        />
                        {(userData.X_name || userData.twitchname) && (
                          <Separator />
                        )}
                      </>
                    )}
                    {userData.X_name && (
                      <>
                        <ListSocialItem
                          IconComponent={SiX}
                          userData={userData.X_name}
                          link={`https://x.com/${userData.X_name}`}
                        />
                        {userData.twitchname && <Separator />}
                      </>
                    )}
                    {userData.twitchname && (
                      <ListSocialItem
                        IconComponent={SiTwitch}
                        userData={userData.twitchname}
                        link={`https://www.twitch.tv/${userData.twitchname}`}
                      />
                    )}
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>

        {/* Center */}
        <Card className={'col-span-1 lg:col-span-2 border-none'}>
          <CardHeader>
            <div className={'grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-0'}>
              <CardTitle className={'col-span-1'}>
                {userData.displayName}
              </CardTitle>
              {current?.$id !== userData?.$id &&
                (userData.isFollowing !== undefined ? (
                  <FollowerButton
                    displayName={userData?.displayName}
                    followerId={userData.$id}
                    isFollowing={userData.isFollowing}
                  />
                ) : (
                  <Skeleton className="h-8 w-full" />
                ))}
            </div>
            <div className={'grid grid-cols-2'}>
              <CardDescription>{userData?.status}</CardDescription>
            </div>
            <CardDescription className={'flex pt-4 gap-4 items-center'}>
              <Link href={`/user/${userData?.profileUrl}/following`}>
                <Button variant={'link'} className={'p-0'}>
                  {userData.followingCount !== undefined ? (
                    <div className="flex items-center space-x-4">
                      <span className={'flex gap-1'}>
                        <span className={'font-bold text-foreground'}>
                          {userData.followingCount}
                        </span>{' '}
                        Following
                      </span>
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-[50px]" />
                  )}
                </Button>
              </Link>
              <Link href={`/user/${userData?.profileUrl}/followers`}>
                <Button variant={'link'} className={'p-0'}>
                  {userData.followersCount !== undefined ? (
                    <div className="flex items-center space-x-4">
                      <span className={'flex gap-1'}>
                        <span className={'font-bold text-foreground'}>
                          {userData.followersCount}
                        </span>{' '}
                        Followers
                      </span>
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-[50px]" />
                  )}
                </Button>
              </Link>
            </CardDescription>
          </CardHeader>
          <Separator className={'mb-6'} />
          <CardContent>
            <div className={'grid grid-cols-2 mx-auto gap-4'}>
              {userData?.pronouns && (
                <>
                  <div className={'col-span-1'}>Pronouns</div>
                  <div className="rounded-md border px-4 py-3 font-mono text-sm col-span-1">
                    {userData?.pronouns}
                  </div>
                </>
              )}
              {birthday !== '01/01/1900' && (
                <>
                  <div className={'col-span-1'}>Birthday</div>
                  <div className="rounded-md border px-4 py-3 font-mono text-sm col-span-1">
                    {birthday}
                  </div>
                </>
              )}
            </div>
            <div className={'border border-ring p-8 rounded-xl mt-8'}>
              <div className={'flex flex-wrap items-center'}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: bioWithLineBreaks || 'Nothing here yet!'
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

const ListSocialItem = ({ IconComponent, userData, link }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(userData).then(() => {
      toast.success('Copied to clipboard!')
    })
  }

  const isCopy = link === '#'

  return (
    <li>
      {isCopy ? (
        <button
          onClick={handleCopy}
          className="relative flex items-center space-x-4 py-4 px-2 w-full rounded-md"
        >
          <div className={'min-w-0 flex-auto'}>
            <div className="flex items-center gap-x-3">
              <div className={'flex-none rounded-full p-1'}>
                <IconComponent />
              </div>
              <span>{userData}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 flex-none" aria-hidden="true" />
        </button>
      ) : (
        <Link
          href={link}
          className="relative flex items-center space-x-4 py-4 px-2"
          target={'_blank'}
        >
          <div className={'min-w-0 flex-auto'}>
            <div className="flex items-center gap-x-3">
              <div className={'flex-none rounded-full p-1'}>
                <IconComponent />
              </div>
              <span>{userData}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 flex-none" aria-hidden="true" />
        </Link>
      )}
    </li>
  )
}
