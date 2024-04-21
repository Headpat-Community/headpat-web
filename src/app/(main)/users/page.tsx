import Link from 'next/link'
import { createAdminClient } from '@/app/appwrite-session'
import { Card } from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { UserDataDocumentsType } from '@/utils/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CakeIcon, CalendarDays } from 'lucide-react'
import Image from 'next/image'

export const runtime = 'edge'

export default async function Users() {
  const { databases } = await createAdminClient()

  const usersData = await databases.listDocuments('hp_db', 'userdata')
  const users = usersData.documents

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 10).replace(/-/g, '.')

  const getAvatarUrl = (avatarId: string) => {
    if (!avatarId) return
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${avatarId}/preview?project=6557c1a8b6c2739b3ecf&width=228&height=228`
  }

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-16">
      <div className={'grid grid-cols-5 gap-4'}>
        {users.map((user: UserDataDocumentsType) => {
          const today = formatDate(new Date())
          const birthday = user.birthday
            ? formatDate(new Date(user.birthday))
            : '01/01/1900'

          const isBirthday = birthday !== '01/01/1900' && birthday === today

          return (
            <Card key={user.$id}>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Link href={`/user/${user.profileUrl}`}>
                    {user.avatarId ? (
                      <Image
                        src={getAvatarUrl(user.avatarId) || null}
                        alt={user.displayName}
                        className="h-full w-full object-cover rounded-md"
                        width={228}
                        height={228}
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 rounded-md flex items-center justify-center text-wrap truncate">
                        <p className="text-gray-400 text-center">
                          {user.displayName}
                        </p>
                      </div>
                    )}
                  </Link>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex space-x-4">
                    <Avatar>
                      <AvatarImage src="https://github.com/vercel.png" />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{`@${user.displayName}`}</h4>
                      <p className="text-sm flex-wrap">{user.status}</p>
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
                          Joined {formatDate(new Date(user.$createdAt))}
                        </span>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
