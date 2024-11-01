'use client'
import Image from 'next/image'
import { getCommunityAvatarUrlPreview } from '@/components/getStorageItem'
import { Link } from '@/i18n/routing'
import { ChevronRight, MessageCircleIcon, UserRoundIcon } from 'lucide-react'
import { Community } from '@/utils/types/models'
import { useCallback, useEffect, useState } from 'react'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { toast } from 'sonner'

export default function AllCommunities() {
  const [communities, setCommunities] =
    useState<Community.CommunityDocumentsType[]>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const fetchCommunities = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/communities?limit=250`, // You can specify a static limit here if desired
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)

      setCommunities(response)
    } catch (error) {
      toast.error('Failed to fetch communities. Please try again later.')
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchCommunities().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCommunities])

  if (isFetching) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (!isFetching && !communities) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>No communities found</h1>
        </div>
      </div>
    )
  }

  return (
    <ul
      role="list"
      className="mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:rounded-xl"
    >
      {communities.map((community) => {
        return (
          <li
            key={community.$id}
            className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-950/10 dark:hover:bg-gray-50/10 sm:px-6"
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
                    <UserRoundIcon size={16} /> {community.followersCount}
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
  )
}
