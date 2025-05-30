'use client'
import { Button } from '@/components/ui/button'
import { useCallback, useEffect, useState } from 'react'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import {
  getCommunityAvatarUrlView,
  getCommunityBannerUrlPreview
} from '@/components/getStorageItem'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { hasAdminPanelAccess } from '@/utils/actions/community/checkRoles'
import { useUser } from '@/components/contexts/UserContext'
import NoAccessNsfw from '@/components/static/noAccessNsfw'
import { notFound, useRouter } from 'next/navigation'
import { CommunityDocumentsType } from '@/utils/types/models'

export default function PageClient({
  communityId,
  communityData
}: {
  communityId: string
  communityData: CommunityDocumentsType
}) {
  const [community, setCommunity] =
    useState<CommunityDocumentsType>(communityData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { current } = useUser()

  useEffect(() => {
    const fetchCommunity = async () => {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community?communityId=${communityId}`,
        ExecutionMethod.GET
      )
      const response = JSON.parse(data.responseBody)

      setCommunity(response)
    }

    fetchCommunity().then(() => setIsLoading(false))
  }, [communityId])

  if (!community.$id) {
    return notFound()
  } else if (!community.communitySettings.hasPublicPage) {
    return notFound()
  } else if (!current?.prefs?.nsfw && community.communitySettings.nsfw) {
    return <NoAccessNsfw />
  }

  return (
    <main className={'max-w-7xl mx-auto'}>
      <>
        {/* Header */}
        {community.bannerId && (
          <header className={'p-0 lg:p-8'}>
            <div className={''}>
              <Image
                src={getCommunityBannerUrlPreview(
                  community.bannerId,
                  'width=1200&height=250&output=webp'
                )}
                alt={'User Banner'}
                className={
                  'rounded-md object-cover max-w-[1200px] max-h-[250px] px-8 lg:px-0 mt-8 lg:mt-0 w-full h-auto'
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
            'grid grid-cols-1 gap-x-2 md:gap-x-4 lg:gap-x-8 gap-y-8 lg:grid-cols-3 xl:gap-x-10 pr-8 pl-8 md:grid-cols-2',
            community.bannerId ? 'mt-0' : 'mt-8'
          )}
        >
          {/* Left */}
          <div
            className={
              'col-span-3 lg:col-span-1 lg:mt-0 mt-4 rounded-t-xl rounded-b-xl md:col-span-1'
            }
          >
            <AspectRatio ratio={2 / 2}>
              <Image
                src={getCommunityAvatarUrlView(community.avatarId)}
                alt={'User Avatar'}
                className={'object-contain rounded-xl'}
                fill={true}
                priority={true}
                unoptimized
              />
            </AspectRatio>
          </div>
          {/* Center */}
          <Card
            className={'col-span-3 border-none md:col-span-1 lg:col-span-2'}
          >
            <CardHeader>
              <div className={'grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-0'}>
                <CardTitle className={'col-span-1'}>{community.name}</CardTitle>
                <FollowerButton
                  displayName={community.name}
                  communityId={communityId}
                />
              </div>
              <div className={'grid grid-cols-2'}>
                <CardDescription>{community.status}</CardDescription>
              </div>
              <CardDescription className={'flex pt-4 gap-4'}>
                <Link href={`/community/${communityId}/followers`}>
                  <Button variant={'link'} className={'p-0'}>
                    {isLoading ? (
                      <Skeleton className={'w-full h-10'} />
                    ) : (
                      <p>
                        <span className={'font-bold text-foreground'}>
                          {community.followersCount}
                        </span>{' '}
                        Follower
                        {community.followersCount !== 1 ? 's' : ''}
                      </p>
                    )}
                  </Button>
                </Link>
              </CardDescription>
            </CardHeader>
            <Separator className={'mb-6'} />
            <CardContent>
              <div className={'border border-ring p-8 rounded-xl mt-8'}>
                <div className={'flex flex-wrap items-center'}>
                  <p>{community.description || 'Nothing here yet!'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Right */}
          {/* Posts here */}
        </div>
      </>
    </main>
  )
}

export function FollowerButton({ displayName, communityId }) {
  const [isFollowingState, setIsFollowingState] = useState<boolean>(null)
  const [hasPermissions, setHasPermissions] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const getIsFollowing = useCallback(async () => {
    try {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community/isFollowing?communityId=${communityId}`,
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)

      setIsFollowingState(response.isFollowing)
      setHasPermissions(await hasAdminPanelAccess(response.roles))
    } catch {
      // Do nothing
    }
  }, [communityId])

  useEffect(() => {
    getIsFollowing().then(() => setIsLoading(false))
  }, [communityId, getIsFollowing])

  const handleFollow = async () => {
    const data = await functions.createExecution(
      'community-endpoints',
      '',
      false,
      `/community/follow?communityId=${communityId}`,
      ExecutionMethod.POST
    )
    const response = JSON.parse(data.responseBody)

    if (response.code === 400) {
      return toast.error('Community ID is missing. Please try again later.')
    } else if (response.code === 401) {
      return toast.error('You must be logged in to follow a community')
    } else if (response.code === 403) {
      setIsFollowingState(true)
      return toast.error('You are already following this community')
    } else {
      toast.success(`You have joined ${displayName}`)
      setIsFollowingState(true)
    }
  }

  const handleUnfollow = async () => {
    const data = await functions.createExecution(
      'community-endpoints',
      '',
      false,
      `/community/follow?communityId=${communityId}`,
      ExecutionMethod.DELETE
    )
    const response = JSON.parse(data.responseBody)

    if (response.type === 'community_unfollow_missing_id') {
      return toast.error('Community ID is missing. Please try again later.')
    } else if (response.type === 'community_unfollow_owner') {
      return toast.error('You cannot unfollow a community you own')
    } else if (response.type === 'community_unfollow_unauthorized') {
      return toast.error('You must be logged in to unfollow a community')
    } else if (response.type === 'community_unfollow_not_following') {
      setIsFollowingState(false)
      return toast.error('You are not following this community')
    } else if (response.type === 'community_unfollow_error') {
      return toast.error('An error occurred while unfollowing the community')
    } else {
      toast.success(`You have left ${displayName}`)
      setIsFollowingState(false)
    }
  }

  const handleManage = () => {
    router.push(`/community/${communityId}/admin`)
  }

  return (
    <>
      {isLoading ? (
        <Skeleton className={'w-full h-10'} />
      ) : (
        <Button
          onClick={
            hasPermissions
              ? handleManage
              : isFollowingState
                ? handleUnfollow
                : handleFollow
          }
        >
          {hasPermissions ? 'Manage' : isFollowingState ? 'Leave' : 'Join'}
        </Button>
      )}
    </>
  )
}
