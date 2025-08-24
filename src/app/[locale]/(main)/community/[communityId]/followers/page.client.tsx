"use client"
import { functions } from "@/app/appwrite-client"
import { ExecutionMethod } from "node-appwrite"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { getAvatarImageUrlPreview } from "@/components/getStorageItem"
import { useCallback, useEffect, useState } from "react"
import UserCard from "@/components/user/userCard"
import type { UserDataDocumentsType } from "@/utils/types/models"

export default function PageClient({ communityId }: { communityId: string }) {
  const [followers, setFollowers] = useState<UserDataDocumentsType[]>(null)
  const [isFetching, setIsFetching] = useState<boolean>(true)

  const fetchFollowers = useCallback(async () => {
    try {
      const data = await functions.createExecution(
        "community-endpoints",
        "",
        false,
        `/community/followers?communityId=${communityId}`, // You can specify a static limit here if desired
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)
      setFollowers(response)
      setIsFetching(false)
    } catch {
      // Do nothing
    }
  }, [communityId])

  useEffect(() => {
    fetchFollowers().then()
  }, [fetchFollowers])

  if (isFetching || !followers) {
    return (
      <div className={"flex h-full flex-1 items-center justify-center"}>
        <div className={"gap-6 p-4 text-center"}>
          <h1 className={"text-2xl font-semibold"}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (followers.length === 0) {
    return (
      <div className={"flex h-full flex-1 items-center justify-center"}>
        <div className={"gap-6 p-4 text-center"}>
          <h1 className={"text-2xl font-semibold"}>No followers found</h1>
          <p className={"text-muted-foreground"}>
            They don&apos;t have any followers yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={
        "3xl:grid-cols-8 5xl:grid-cols-10 mx-auto grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 xl:gap-6 2xl:grid-cols-7"
      }
    >
      {followers.map((user: UserDataDocumentsType) => {
        return (
          <Card className={"mx-auto h-40 w-40 border-none"} key={user.$id}>
            <Card className={"mx-auto h-40 w-40 border-none"} key={user.$id}>
              <UserCard user={user} isChild>
                <div className={"h-full w-full"}>
                  {user.avatarId ? (
                    <Image
                      src={
                        getAvatarImageUrlPreview(
                          user.avatarId,
                          "width=250&height=250"
                        ) || null
                      }
                      alt={user.displayName}
                      className="rounded-md object-cover"
                      width={1000}
                      height={1000}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center truncate text-wrap rounded-md bg-gray-200">
                      <p className="text-center text-gray-400">
                        {user.displayName}
                      </p>
                    </div>
                  )}
                </div>
              </UserCard>
            </Card>
          </Card>
        )
      })}
    </div>
  )
}
