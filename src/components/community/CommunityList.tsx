"use client"
import Image from "next/image"
import { getCommunityAvatarUrlPreview } from "@/components/getStorageItem"
import Link from "next/link"
import { ChevronRight, MessageCircleIcon, UserRoundIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useMemo, memo } from "react"
import type { CommunityDocumentsType } from "@/utils/types/models"

interface CommunityListProps {
  communities: CommunityDocumentsType[] | null
  isFetching: boolean
  showCreateButton?: boolean
  createButtonContent?: ReactNode
  emptyStateMessage?: string
  loadingMessage?: string
}

// Memoized community item component to prevent unnecessary re-renders
const CommunityItem = memo(function CommunityItem({
  community,
}: {
  community: CommunityDocumentsType
}) {
  const avatarUrl = useMemo(
    () =>
      getCommunityAvatarUrlPreview(
        community.avatarId,
        "width=200&output=webp&quality=75"
      ),
    [community.avatarId]
  )

  const communityLink = useMemo(
    () => `/community/${community.$id}`,
    [community.$id]
  )

  return (
    <li className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-950/10 sm:px-6 dark:hover:bg-gray-50/10">
      <div className="flex min-w-0 items-center gap-x-4">
        <Image
          className="mr-4 h-16 w-16 flex-none rounded-full"
          src={avatarUrl}
          alt={community.name}
          width={200}
          height={200}
          unoptimized={true}
          draggable={false}
          loading="lazy"
        />
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6">
            <Link href={communityLink}>
              <span className="absolute inset-x-0 -top-px bottom-0" />
              {community.name}
            </Link>
          </p>
          <p className="mt-1 flex truncate text-xs leading-5 text-gray-400 dark:text-gray-300">
            {community.description}
          </p>
          <div className={"flex gap-4"}>
            <p className="mt-1 flex gap-1 text-xs leading-5 text-gray-400 dark:text-gray-300">
              <UserRoundIcon size={16} /> {community.followersCount}
            </p>
            <p className="mt-1 flex gap-1 text-xs leading-5 text-gray-400 dark:text-gray-300">
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
})

// Memoized loading state component
const LoadingState = memo(function LoadingState({
  message,
}: {
  message: string
}) {
  return (
    <div className={"flex h-full flex-1 items-center justify-center"}>
      <div className={"gap-6 p-4 text-center"}>
        <h1 className={"text-2xl font-semibold"}>{message}</h1>
      </div>
    </div>
  )
})

// Memoized empty state component
const EmptyState = memo(function EmptyState({ message }: { message: string }) {
  return (
    <div className={"flex h-full flex-1 items-center justify-center"}>
      <div className={"gap-6 p-4 text-center"}>
        <h1 className={"text-2xl font-semibold"}>{message}</h1>
      </div>
    </div>
  )
})

// Memoized communities list component
const CommunitiesList = memo(function CommunitiesList({
  communities,
}: {
  communities: CommunityDocumentsType[]
}) {
  return (
    <ul
      role="list"
      className="shadow-xs mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 overflow-hidden ring-1 ring-black/95 sm:rounded-xl dark:ring-white/95"
    >
      {communities.map((community) => (
        <CommunityItem key={community.$id} community={community} />
      ))}
    </ul>
  )
})

function CommunityList({
  communities,
  isFetching,
  showCreateButton = false,
  createButtonContent,
  emptyStateMessage = "No communities found",
  loadingMessage = "Loading...",
}: CommunityListProps) {
  // Memoize the create button wrapper to prevent unnecessary re-renders
  const createButtonWrapper = useMemo(() => {
    if (!showCreateButton || !createButtonContent) return null
    return <div className="flex justify-center">{createButtonContent}</div>
  }, [showCreateButton, createButtonContent])

  // Early return for loading state
  if (isFetching) {
    return <LoadingState message={loadingMessage} />
  }

  // Early return for empty state
  if (!communities) {
    return <EmptyState message={emptyStateMessage} />
  }

  return (
    <>
      {createButtonWrapper}
      <CommunitiesList communities={communities} />
    </>
  )
}

export default memo(CommunityList)
