import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CakeIcon, CalendarDays } from 'lucide-react'
import { UserData } from '@/utils/types/models'
import { formatDate } from '@/components/calculateTimeLeft'
import React from 'react'
import { Link } from '@/i18n/routing'

export default function UserCard({
  user,
  isChild,
  children,
}: {
  user: UserData.UserDataDocumentsType
  isChild?: boolean
  children: React.ReactNode
}) {
  const today = formatDate(new Date())
  const birthday = user?.birthday
    ? formatDate(new Date(user?.birthday))
    : '01/01/1900'

  const isBirthday = birthday !== '01/01/1900' && birthday === today

  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <Link
        href={{
          pathname: `/user/[profileUrl]`,
          params: {
            profileUrl: user?.profileUrl,
          },
        }}
      >
        <HoverCardTrigger {...(isChild ? { asChild: true } : {})}>
          {children}
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex space-x-4">
            <Avatar>
              <AvatarImage
                src={
                  getAvatarImageUrlPreview(
                    user?.avatarId,
                    'width=250&height=250'
                  ) || null
                }
                alt={user?.displayName}
              />
              <AvatarFallback>
                {user?.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">{`@${user?.displayName}`}</h4>
              <p className="text-sm flex-wrap">{user?.status}</p>
              {isBirthday && (
                <div className="flex items-center pt-2">
                  <CakeIcon className="mr-2 h-4 w-4 opacity-70" />{' '}
                  <span className="text-xs text-muted-foreground">
                    Today is my birthday!
                  </span>
                </div>
              )}
              <div className="flex items-center pt-2">
                <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                <span className="text-xs text-muted-foreground">
                  Joined {formatDate(new Date(user?.$createdAt))}
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </Link>
    </HoverCard>
  )
}
