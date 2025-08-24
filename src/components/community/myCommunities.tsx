"use client"
import Link from "next/link"
import { useCallback, useEffect, useState, useMemo, memo } from "react"
import { functions } from "@/app/appwrite-client"
import { ExecutionMethod } from "node-appwrite"
import { toast } from "sonner"
import { useUser } from "@/components/contexts/UserContext"
import { Button } from "@/components/ui/button"
import AddCommunity from "@/components/community/addCommunity"
import { useDataCache } from "@/components/contexts/DataCacheContext"
import type { CommunityDocumentsType } from "@/utils/types/models"
import CommunityList from "./CommunityList"

// Constants to prevent recreation
const COMMUNITY_ENDPOINT = "community-endpoints"
const JOINED_COMMUNITIES_PATH = "/communities/joined?limit=250"
const EXECUTION_METHOD = ExecutionMethod.GET

// Memoized sign-in prompt component to prevent unnecessary re-renders
const SignInPrompt = memo(function SignInPrompt() {
  return (
    <div className={"flex h-full flex-1 items-center justify-center"}>
      <div className={"gap-6 p-4 text-center"}>
        <h1 className={"text-2xl font-semibold"}>You are not signed in.</h1>
        <p className={"text-gray-400 dark:text-gray-300"}>
          Please{" "}
          <Link className={"text-primary"} href={"/login"}>
            sign in
          </Link>{" "}
          to view your communities.
        </p>
      </div>
    </div>
  )
})

export default memo(function MyCommunities() {
  const [communities, setCommunities] = useState<CommunityDocumentsType[]>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const { current } = useUser()
  const { saveAllCache } = useDataCache()

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchCommunities = useCallback(async () => {
    if (!current) return

    setIsFetching(true)
    try {
      const data = await functions.createExecution(
        COMMUNITY_ENDPOINT,
        "",
        false,
        JOINED_COMMUNITIES_PATH,
        EXECUTION_METHOD
      )

      const response = JSON.parse(data.responseBody)

      if (response.code === 401) {
        toast.error(
          "You are not signed in. Please sign in to view your communities."
        )
        return
      }

      setCommunities(response)
      saveAllCache("communities", response)
    } catch (error) {
      console.error("Failed to fetch communities:", error)
      toast.error("Failed to fetch communities. Please try again later.")
    } finally {
      setIsFetching(false)
    }
  }, [current, saveAllCache])

  // Memoized effect to prevent unnecessary re-runs
  useEffect(() => {
    if (!current) {
      setCommunities(null)
      setIsFetching(false)
      return
    }
    fetchCommunities()
  }, [fetchCommunities, current])

  // Memoized create button content to prevent unnecessary re-renders
  const createButtonContent = useMemo(
    () => (
      <AddCommunity>
        <Button className={"w-4xl mx-auto mb-4 mt-8 flex"}>
          Create new community
        </Button>
      </AddCommunity>
    ),
    []
  )

  // Memoized props to prevent unnecessary re-renders of CommunityList
  const communityListProps = useMemo(
    () => ({
      communities,
      isFetching,
      showCreateButton: true,
      createButtonContent,
      emptyStateMessage: "No communities found",
      loadingMessage: "Loading...",
    }),
    [communities, isFetching, createButtonContent]
  )

  // Early return for unauthenticated users
  if (!current) {
    return <SignInPrompt />
  }

  return <CommunityList {...communityListProps} />
})
