import { getCommunities } from '@/utils/server-api/communities/getCommunity'
import PageLayout from '@/components/pageLayout'
import {
  ChevronRight,
  HeartHandshakeIcon,
  MessageCircleIcon,
  UserRoundIcon,
} from 'lucide-react'
import { Link } from '@/navigation'
import { getCommunityFollowers } from '@/utils/server-api/community-followers/getCommunityFollowers'
import { getCommunityAvatarUrlPreview } from '@/components/getStorageItem'
import Image from 'next/image'

export const runtime = 'edge'

export default async function Page() {
  const communities = await getCommunities(0)

  return (
    <PageLayout title={'Communities'}>
      <ul
        role="list"
        className="mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:rounded-xl"
      >
        {communities.documents.map(async (community) => {
          const followers = await getCommunityFollowers(community.$id)
          return (
            <li
              key={community.$id}
              className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50/90 dark:hover:bg-gray-50/10 sm:px-6"
            >
              <div className="flex min-w-0 gap-x-4 items-center">
                <Image
                  className="mr-4 h-16 w-16 flex-none rounded-full"
                  src={getCommunityAvatarUrlPreview(
                    community.avatarId,
                    'width=200&output=webp&quality=75'
                  )}
                  alt={community.name}
                  width={200}
                  height={200}
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6">
                    <Link
                      href={{
                        pathname: '/community/[communityId]',
                        params: { communityId: community.$id },
                      }}
                    >
                      <span className="absolute inset-x-0 -top-px bottom-0" />
                      {community.name}
                    </Link>
                  </p>
                  <p className="mt-1 flex text-xs leading-5 text-gray-400 dark:text-gray-300 truncate">
                    {community.description}
                  </p>
                  <div className={'flex gap-4'}>
                    <p className="mt-1 flex text-xs leading-5 text-gray-400 dark:text-gray-300 gap-1">
                      <UserRoundIcon size={16} /> {followers.documents.length}
                    </p>
                    <p className="mt-1 flex text-xs leading-5 text-gray-400 dark:text-gray-300 gap-1">
                      <MessageCircleIcon size={16} /> 0
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">
                <ChevronRight
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </li>
          )
        })}
      </ul>
    </PageLayout>
  )
}
