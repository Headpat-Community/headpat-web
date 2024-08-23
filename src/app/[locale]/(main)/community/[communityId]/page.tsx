import PageLayout from '@/components/pageLayout'
import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import Image from 'next/image'
import {
  getCommunityAvatarUrlView,
  getCommunityBannerUrlPreview,
} from '@/components/getStorageItem'
import { cn } from '@/lib/utils'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import ContextMenuProfile from '@/components/user/contextMenuProfile'
import { FollowerButton } from '@/app/[locale]/(main)/community/[communityId]/page.client'
import { getCommunityFollowers } from '@/utils/server-api/community-followers/getCommunityFollowers'
import { getUser } from '@/utils/server-api/account/user'

export const runtime = 'edge'

export async function generateMetadata({
  params: { communityId },
}: {
  params: { communityId: string }
}) {
  const community = await getCommunity(communityId)

  return {
    title: community.name || 'Community',
    description: community.description,
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: community.name || 'Community',
      description: community.description,
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
  }
}

export default async function Page({
  params: { communityId },
}: {
  params: { communityId: string }
}) {
  const community = await getCommunity(communityId)
  const followers = await getCommunityFollowers(communityId)
  let userSelf = null
  try {
    userSelf = await getUser()
  } catch (error) {
    // Do nothing
  }

  return (
    <PageLayout title={community.name || 'Community'}>
      <ContextMenuProfile>
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
                  <div
                    className={'grid grid-cols-1 xl:grid-cols-2 gap-4 xl:gap-0'}
                  >
                    <CardTitle className={'col-span-1'}>
                      {community.name}
                    </CardTitle>
                    <FollowerButton
                      userSelf={userSelf}
                      displayName={community.name}
                      communityId={communityId}
                    />
                  </div>
                  <div className={'grid grid-cols-2'}>
                    <CardDescription>{community.status}</CardDescription>
                  </div>
                  <CardDescription className={'flex pt-4 gap-4'}>
                    <Link
                      href={{
                        pathname: '/community/[communityId]/followers',
                        params: { communityId },
                      }}
                    >
                      <Button variant={'link'} className={'p-0'}>
                        <p>
                          <span className={'font-bold text-foreground'}>
                            {followers.documents.length}
                          </span>{' '}
                          Follower{followers.documents.length > 1 ? 's' : ''}
                        </p>
                      </Button>
                    </Link>{' '}
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
      </ContextMenuProfile>
    </PageLayout>
  )
}
