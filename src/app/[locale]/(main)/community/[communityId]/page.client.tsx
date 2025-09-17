"use client"
import { Button } from "@/components/ui/button"
import { useCallback, useEffect, useState, useMemo, memo } from "react"
import { functions } from "@/app/appwrite-client"
import { ExecutionMethod } from "node-appwrite"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import {
  getCommunityAvatarUrlView,
  getCommunityBannerUrlPreview,
} from "@/components/getStorageItem"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { hasAdminPanelAccess } from "@/utils/actions/community/checkRoles"
import { useUser } from "@/components/contexts/UserContext"
import NoAccessNsfw from "@/components/static/noAccessNsfw"
import { notFound, useRouter } from "next/navigation"
import type { CommunityDocumentsType } from "@/utils/types/models"

// Constants to prevent recreation
const COMMUNITY_ENDPOINT = "community-endpoints"
const EXECUTION_METHOD = ExecutionMethod.GET

// Memoized follower button component
const FollowerButton = memo(function FollowerButton({
  displayName,
  communityId,
}: {
  displayName: string
  communityId: string
}) {
  const [isFollowingState, setIsFollowingState] = useState<boolean>(false)
  const [hasPermissions, setHasPermissions] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Memoized API endpoints to prevent recreation
  const apiEndpoints = useMemo(
    () => ({
      isFollowing: `/community/isFollowing?communityId=${communityId}`,
      follow: `/community/follow?communityId=${communityId}`,
      unfollow: `/community/follow?communityId=${communityId}`,
    }),
    [communityId]
  )

  const getIsFollowing = useCallback(async () => {
    try {
      const data = await functions.createExecution(
        COMMUNITY_ENDPOINT,
        "",
        false,
        apiEndpoints.isFollowing,
        EXECUTION_METHOD
      )

      const response = JSON.parse(data.responseBody)
      setIsFollowingState(response.isFollowing)
      setHasPermissions(await hasAdminPanelAccess(response.roles))
    } catch (error) {
      console.error("Failed to check following status:", error)
    }
  }, [apiEndpoints.isFollowing])

  useEffect(() => {
    getIsFollowing().then(() => setIsLoading(false))
  }, [getIsFollowing])

  const handleFollow = useCallback(async () => {
    try {
      const data = await functions.createExecution(
        COMMUNITY_ENDPOINT,
        "",
        false,
        apiEndpoints.follow,
        ExecutionMethod.POST
      )
      const response = JSON.parse(data.responseBody)

      if (response.code === 400) {
        toast.error("Community ID is missing. Please try again later.")
      } else if (response.code === 401) {
        toast.error("You must be logged in to follow a community")
      } else if (response.code === 403) {
        setIsFollowingState(true)
        toast.error("You are already following this community")
      } else {
        toast.success(`You have joined ${displayName}`)
        setIsFollowingState(true)
      }
    } catch (error) {
      console.error("Failed to follow community:", error)
      toast.error("Failed to follow community. Please try again.")
    }
  }, [apiEndpoints.follow, displayName])

  const handleUnfollow = useCallback(async () => {
    try {
      const data = await functions.createExecution(
        COMMUNITY_ENDPOINT,
        "",
        false,
        apiEndpoints.unfollow,
        ExecutionMethod.DELETE
      )
      const response = JSON.parse(data.responseBody)

      if (response.type === "community_unfollow_missing_id") {
        toast.error("Community ID is missing. Please try again later.")
      } else if (response.type === "community_unfollow_owner") {
        toast.error("You cannot unfollow a community you own")
      } else if (response.type === "community_unfollow_unauthorized") {
        toast.error("You must be logged in to unfollow a community")
      } else if (response.type === "community_unfollow_not_following") {
        setIsFollowingState(false)
        toast.error("You are not following this community")
      } else if (response.type === "community_unfollow_error") {
        toast.error("An error occurred while unfollowing the community")
      } else {
        toast.success(`You have left ${displayName}`)
        setIsFollowingState(false)
      }
    } catch (error) {
      console.error("Failed to unfollow community:", error)
      toast.error("Failed to unfollow community. Please try again.")
    }
  }, [apiEndpoints.unfollow, displayName])

  const handleManage = useCallback(() => {
    router.push(`/community/${communityId}/admin`)
  }, [router, communityId])

  if (isLoading) {
    return <Skeleton className={"h-10 w-full"} />
  }

  const buttonText = hasPermissions
    ? "Manage"
    : isFollowingState
      ? "Leave"
      : "Join"
  const handleClick = hasPermissions
    ? handleManage
    : isFollowingState
      ? handleUnfollow
      : handleFollow

  return <Button onClick={handleClick}>{buttonText}</Button>
})

function PageClient({
  communityId,
  communityData,
}: {
  communityId: string
  communityData: CommunityDocumentsType
}) {
  const [community, setCommunity] =
    useState<CommunityDocumentsType>(communityData)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { current } = useUser()

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchCommunity = useCallback(async () => {
    try {
      const data = await functions.createExecution({
        functionId: COMMUNITY_ENDPOINT,
        async: false,
        xpath: `/community?communityId=${communityId}`,
        method: EXECUTION_METHOD,
      })
      const response = JSON.parse(data.responseBody)
      setCommunity(response)
    } catch (error) {
      console.error("Failed to fetch community:", error)
    } finally {
      setIsLoading(false)
    }
  }, [communityId])

  // Memoized grid classes to prevent recalculation
  const gridClasses = useMemo(
    () =>
      cn(
        "grid grid-cols-1 gap-x-2 gap-y-8 pl-8 pr-8 md:grid-cols-2 md:gap-x-4 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-10",
        community.bannerId ? "mt-0" : "mt-8"
      ),
    [community.bannerId]
  )

  useEffect(() => {
    fetchCommunity()
  }, [fetchCommunity])

  // Early validation checks
  if (!community.$id) {
    return notFound()
  } else if (!community.communitySettings.hasPublicPage) {
    return notFound()
  } else if (!current?.prefs?.nsfw && community.communitySettings.nsfw) {
    return <NoAccessNsfw />
  }

  return (
    <main className={"mx-auto max-w-7xl"}>
      <>
        {/* Header */}
        {community.bannerId && (
          <header className={"p-0 lg:p-8"}>
            <div className={""}>
              <Image
                src={getCommunityBannerUrlPreview(
                  community.bannerId,
                  "width=1200&height=250&output=webp"
                )}
                alt={"Community Banner"}
                className={
                  "mt-8 h-auto max-h-[250px] w-full max-w-[1200px] rounded-md object-cover px-8 lg:mt-0 lg:px-0"
                }
                width={1200}
                height={250}
                priority={true}
              />
            </div>
          </header>
        )}

        {/* Grid */}
        <div className={gridClasses}>
          {/* Left - Avatar */}
          <div
            className={
              "col-span-3 mt-4 rounded-b-xl rounded-t-xl md:col-span-1 lg:col-span-1 lg:mt-0"
            }
          >
            <AspectRatio ratio={2 / 2}>
              <Image
                src={getCommunityAvatarUrlView(community.avatarId) || ""}
                alt={"Community Avatar"}
                className={"rounded-xl object-contain"}
                fill={true}
                priority={true}
                unoptimized
              />
            </AspectRatio>
          </div>

          {/* Center - Community Info */}
          <Card
            className={"col-span-3 border-none md:col-span-1 lg:col-span-2"}
          >
            <CardHeader>
              <div className={"grid grid-cols-1 gap-4 xl:grid-cols-2 xl:gap-0"}>
                <CardTitle className={"col-span-1"}>{community.name}</CardTitle>
                <FollowerButton
                  displayName={community.name}
                  communityId={communityId}
                />
              </div>
              <div className={"grid grid-cols-2"}>
                <CardDescription>{community.status}</CardDescription>
              </div>
              <CardDescription className={"flex gap-4 pt-4"}>
                <Link href={`/community/${communityId}/followers`}>
                  <Button variant={"link"} className={"p-0"}>
                    {isLoading ? (
                      <Skeleton className={"h-10 w-full"} />
                    ) : (
                      <p>
                        <span className={"text-foreground font-bold"}>
                          {community.followersCount}
                        </span>{" "}
                        {`Follower${community.followersCount !== 1 ? "s" : ""}`}
                      </p>
                    )}
                  </Button>
                </Link>
              </CardDescription>
            </CardHeader>
            <Separator className={"mb-6"} />
            <CardContent>
              <div className={"border-ring mt-8 rounded-xl border p-8"}>
                <div className={"flex flex-wrap items-center"}>
                  <p>{community.description || "Nothing here yet!"}</p>
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

export default memo(PageClient)
