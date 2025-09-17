import { formatDate } from "@/components/calculateTimeLeft"
import { getAvatarImageUrlPreview } from "@/components/getStorageItem"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import type { UserDataDocumentsType } from "@/utils/types/models"
import { CakeIcon, CalendarDays } from "lucide-react"
import Link from "next/link"
import React, { memo, useMemo } from "react"

interface UserCardProps {
  user: UserDataDocumentsType
  isChild?: boolean
  children: React.ReactNode
}

function UserCardComponent({ user, isChild, children }: UserCardProps) {
  // Memoize expensive date calculations
  const { isBirthday, joinedDate } = useMemo(() => {
    const today = formatDate(new Date())
    const birthday = user?.birthday
      ? formatDate(new Date(user?.birthday))
      : "01/01/1900"
    const isBirthday = birthday !== "01/01/1900" && birthday === today
    const joinedDate = formatDate(new Date(user?.$createdAt))

    return { isBirthday, joinedDate }
  }, [user?.birthday, user?.$createdAt])

  // Memoize avatar image URL
  const avatarImageUrl = useMemo(() => {
    return (
      getAvatarImageUrlPreview(user?.avatarId || "", "width=250&height=250") ||
      ""
    )
  }, [user?.avatarId])

  // Memoize user display name initial
  const userInitial = useMemo(() => {
    return user?.displayName?.charAt(0).toUpperCase() || "?"
  }, [user?.displayName])

  // Memoize the hover card content to prevent unnecessary re-renders
  const hoverCardContent = useMemo(
    () => (
      <HoverCardContent className="w-80">
        <div className="flex space-x-4">
          <Avatar>
            <AvatarImage src={avatarImageUrl} alt={user?.displayName || ""} />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{`${user?.displayName}`}</h4>
            <p className="flex-wrap text-sm">{user?.status}</p>
            {isBirthday && (
              <div className="flex items-center pt-2">
                <CakeIcon className="mr-2 size-4 opacity-70" />{" "}
                <span className="text-muted-foreground text-xs">
                  Today is my birthday!
                </span>
              </div>
            )}
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 size-4 opacity-70" />{" "}
              <span className="text-muted-foreground text-xs">
                Joined {joinedDate}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    ),
    [
      user?.displayName,
      user?.status,
      isBirthday,
      joinedDate,
      avatarImageUrl,
      userInitial,
    ]
  )

  // Memoize the link to prevent unnecessary re-renders
  const userLink = useMemo(
    () => `/user/${user?.profileUrl}`,
    [user?.profileUrl]
  )

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <Link href={userLink}>
        <HoverCardTrigger {...(isChild ? { asChild: true } : {})}>
          {children}
        </HoverCardTrigger>
        {hoverCardContent}
      </Link>
    </HoverCard>
  )
}

const UserCard = memo(UserCardComponent)

export default UserCard
