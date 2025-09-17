"use client"
import { functions } from "@/app/appwrite-client"
import { getAvatarImageUrlPreview } from "@/components/getStorageItem"
import { Card } from "@/components/ui/card"
import UserCard from "@/components/user/userCard"
import type { UserDataDocumentsType, UserDataType } from "@/utils/types/models"
import Image from "next/image"
import { ExecutionMethod } from "node-appwrite"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

export default function ClientPage({ userData }: { userData: UserDataType }) {
  const [users, setUsers] = useState<UserDataDocumentsType[]>([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const user = userData.rows[0]

  const fetchUsers = useCallback(async () => {
    setIsFetching(true)
    try {
      const data = await functions.createExecution(
        "user-endpoints",
        "",
        false,
        `/user/following?userId=${user.$id}&limit=250`, // You can specify a static limit here if desired
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)
      setUsers(response)
    } catch (error) {
      console.log(error)
      toast("Failed to fetch users. Please try again later.")
    } finally {
      setIsFetching(false)
    }
  }, [user.$id])

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  if (isFetching && users.length === 0) {
    return (
      <div className={"flex h-full flex-1 items-center justify-center"}>
        <div className={"gap-6 p-4 text-center"}>
          <h1 className={"text-2xl font-semibold"}>Loading...</h1>
        </div>
      </div>
    )
  }

  if (!isFetching && users.length === 0) {
    return (
      <div className={"flex h-full flex-1 items-center justify-center"}>
        <div className={"gap-6 p-4 text-center"}>
          <h1 className={"text-2xl font-semibold"}>So quiet here...</h1>
          <p className={"text-muted-foreground"}>
            {user?.displayName} hasn&apos;t followed anyone yet. Maybe they are
            just waiting for the perfect moment!
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
      {users.map((user) => {
        return (
          <Card className={"mx-auto h-40 w-40 border-none"} key={user.$id}>
            <UserCard user={user} isChild>
              <div className={"h-full w-full"}>
                {user.avatarId ? (
                  <Image
                    src={
                      getAvatarImageUrlPreview(
                        user.avatarId,
                        "width=250&height=250"
                      ) || ""
                    }
                    alt={user.displayName || ""}
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
        )
      })}
    </div>
  )
}
