"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import UserCard from "@/components/user/userCard"
import { getAvatarImageUrlPreview } from "@/components/getStorageItem"
import { formatDate } from "@/components/calculateTimeLeft"
import React from "react"
import { ExecutionMethod } from "node-appwrite"
import { functions } from "@/app/appwrite-client"
import { useDataCache } from "@/components/contexts/DataCacheContext"
import { toast } from "sonner"
import { useUser } from "@/components/contexts/UserContext"
import { useRouter } from "next/navigation"
import type { NotificationsDocumentsType } from "@/utils/types/models"

export default function PageClient() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [notifications, setNotifications] = React.useState<
    NotificationsDocumentsType[]
  >([])
  const { current } = useUser()
  const { getAllCache, saveCache } = useDataCache()

  const fetchNotifications = React.useCallback(async () => {
    const cache =
      await getAllCache<NotificationsDocumentsType[]>("notifications")
    const notifications = cache.map((item) => item.data) // Assuming each CacheItem has a 'data' property
    if (notifications.length > 0) {
      setNotifications(notifications.flat()) // Flatten the array if necessary
      setLoading(false)
    }
    try {
      const data = await functions.createExecution(
        "user-endpoints",
        "",
        false,
        `/user/notifications`,
        ExecutionMethod.GET
      )
      const response = JSON.parse(data.responseBody)
      setNotifications(response)
      for (const notification of response) {
        saveCache("notifications", notification.$id, notification)
      }
      setLoading(false)
    } catch {
      toast.error("Failed to fetch notifications. Please try again later.")
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchNotifications().then()
  }, [])

  if (!current) {
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="mx-auto h-svh">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
          <h1 className="text-[3rem] font-bold leading-tight">Loading...</h1>
        </div>
      </div>
    )
  } else if (!loading && notifications.length === 0) {
    return (
      <div className="mx-auto h-svh">
        <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
          <h1 className="text-[3rem] font-bold leading-tight">Empty here...</h1>
          <p className="text-muted-foreground text-center">
            You have no notifications yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ul
      role="list"
      className="shadow-xs mx-8 mb-4 mt-8 max-w-4xl divide-y divide-gray-100 ring-1 ring-black/95 sm:rounded-xl lg:mx-auto dark:ring-white/95"
    >
      {notifications
        .sort(
          (a, b) =>
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        )
        .map((notification, index) => {
          return <Notification notification={notification} key={index} />
        })}
    </ul>
  )
}

const Notification = ({ notification }) => {
  const userData = notification.userData
  const isDeleted = !userData

  if (notification.type === "newFollower") {
    return (
      <li
        key={notification.$id}
        className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50/90 sm:px-6 dark:hover:bg-gray-50/10"
      >
        <div className="flex min-w-0 items-center gap-x-4">
          {isDeleted ? (
            <Avatar>
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
          ) : (
            <UserCard user={userData} isChild>
              <Avatar>
                <AvatarImage
                  src={
                    getAvatarImageUrlPreview(
                      userData?.avatarId,
                      "width=250&height=250"
                    ) || null
                  }
                />
                <AvatarFallback>
                  {userData?.displayName.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </UserCard>
          )}
          <div className="min-w-0 flex-auto">
            <p className="mt-1 flex leading-5 text-gray-400 dark:text-gray-300">
              {isDeleted ? (
                "Deleted Account"
              ) : (
                <UserCard user={userData} isChild>
                  <span className={"font-bold"}>
                    {userData?.displayName || "Unknown user"}
                  </span>
                </UserCard>
              )}
              &nbsp; followed you! 🎉
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-x-4">
          {formatDate(new Date(notification.$createdAt))}
        </div>
      </li>
    )
  }

  return null
}
