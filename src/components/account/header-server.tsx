import { getAccount, getUserDataSelf } from '@/utils/actions/user-actions'
import AnnouncementNotification from 'components/announcementNotification'
import Sidebar from './sidebar'
import { ThemeToggle } from 'components/ThemeToggle'
import { Avatar, AvatarFallback, AvatarImage } from 'components/ui/avatar'
import { UserAccountType, UserDataType } from 'utils/types'
import { Separator } from 'components/ui/separator'
import Link from 'next/link'

export default async function Header({ children }) {
  const accountData: UserAccountType = await getAccount()
  let userData: UserDataType = await getUserDataSelf()

  // TODO: Remove this when SDK is fixed
  if (userData) {
    userData = undefined
  }

  const getAvatarImageUrl = (galleryId: string) => {
    if (!galleryId) {
      return
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=400`
  }

  return (
    <main>
      <AnnouncementNotification />
      <header className="shrink-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={'/'}>
            <img
              className="h-10 w-auto"
              src="/logos/Headpat_new_logo.webp"
              alt="Headpat Logo"
            />
          </Link>
          <Link href={'/'}>
            <h3>Home</h3>
          </Link>
          <div className="flex items-center gap-x-4">
            <ThemeToggle />
            <span className="sr-only">Your profile</span>
            <Avatar>
              <AvatarImage
                src={getAvatarImageUrl(userData?.documents[0]?.avatarId)}
              />
              <AvatarFallback>HP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <Separator className={'bg-gray-200'} />

      <div className="mx-auto w-full max-w-screen-2xl grow lg:flex xl:px-2">
        <div className="flex-1 flex">
          {/* Left sidebar */}
          <div className="border-b border-gray-200 px-4 py-6 sm:px-6 lg:pl-8 xl:shrink-0 xl:border-b-0 xl:border-r xl:pl-6 w-96 hidden lg:block">
            <Sidebar />
          </div>

          {/* Main wrapper */}
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
