import Image from 'next/image'
import { notFound } from 'next/navigation'
import { UserDataType } from '@/utils/types'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { ChevronRight } from 'lucide-react'
import {
  SiDiscord,
  SiFuraffinity,
  SiTelegram,
  SiTwitch,
  SiX,
} from '@icons-pack/react-simple-icons'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { createAdminClient } from '@/app/appwrite-session'
import { Query } from '@/app/appwrite-server'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const runtime = 'edge'

export const metadata = {
  title: 'User Profile',
  description: 'User Profile Description',
}

export default async function UserProfile({ params: { profileUrl } }) {
  const { databases, storage } = await createAdminClient()

  const getAvatarImageUrl = (galleryId: string) => {
    if (!galleryId) {
      return '/images/404.webp'
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/view?project=6557c1a8b6c2739b3ecf`
  }

  const userDataResponse: UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('profileUrl', profileUrl)]
  )
  const userData = userDataResponse.documents[0]

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 10).replace(/-/g, '.')

  const today = formatDate(new Date())
  const birthday = userData?.birthday
    ? formatDate(new Date(userData.birthday))
    : '01/01/1900'

  const isBirthday = birthday !== '01/01/1900' && birthday === today

  if (!userData) {
    return notFound()
  }

  // mobile 30/6
  // pc 30/3

  return (
    <main>
      {userData && ( // Check if userData exists
        <>
          {/* Header */}
          <header className={'p-0 lg:p-8'}>
            <AspectRatio ratio={30 / 4}>
              <Image
                src={'/images/faye_butt.png'}
                alt={'User Banner'}
                className={'rounded-md object-cover'}
                fill={true}
                priority={true}
              />
            </AspectRatio>
          </header>

          {/* Grid */}
          <div
            className={
              'grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3 lg:grid-cols-5 xl:gap-x-10 pr-8 pl-8'
            }
          >
            {/* Left */}
            <div
              className={'col-span-1 lg:mt-0 mt-4 rounded-t-xl rounded-b-xl'}
            >
              <AspectRatio ratio={2 / 2}>
                <Image
                  src={getAvatarImageUrl(userData.avatarId)}
                  alt={'User Avatar'}
                  className={'object-contain rounded-t-xl'}
                  fill={true}
                  priority={true}
                />
                {isBirthday && (
                  <Badge className="relative ml-auto flex shrink-0 items-center justify-center rounded-none rounded-t-xl">
                    It&apos;s my birthday!
                  </Badge>
                )}
              </AspectRatio>

              <ul>
                {userData.discordname && (
                  <ListSocialItem
                    IconComponent={SiDiscord}
                    userData={userData.discordname}
                    link={`https://discord.com/users/${userData.discordname}`}
                  />
                )}
                {userData.telegramname && (
                  <ListSocialItem
                    IconComponent={SiTelegram}
                    userData={userData.telegramname}
                    link={`https://t.me/${userData.telegramname}`}
                  />
                )}
                {userData.furaffinityname && (
                  <ListSocialItem
                    IconComponent={SiFuraffinity}
                    userData={userData.furaffinityname}
                    link={`https://www.furaffinity.net/user/${userData.furaffinityname}`}
                  />
                )}
                {userData.X_name && (
                  <ListSocialItem
                    IconComponent={SiX}
                    userData={userData.X_name}
                    link={`https://x.com/${userData.X_name}`}
                  />
                )}
                {userData.twitchname && (
                  <ListSocialItem
                    IconComponent={SiTwitch}
                    userData={userData.twitchname}
                    link={`https://www.twitch.tv/${userData.twitchname}`}
                  />
                )}
              </ul>
            </div>
            {/* Center */}
            <div className={'border col-span-2 p-8 rounded-xl'}>
              <div className={'flex items-center'}>
                <p>{userData.bio}</p>
              </div>
            </div>
            {/* Right */}
            <Card className={'col-span-2'}>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>Information about me</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={'grid grid-cols-2 border mx-auto rounded p-4'}>
                  <div className={'col-span-2'}>{userData.displayName}</div>
                  <Separator />
                  <div className={'col-span-2'}>{userData.status}</div>
                  <Separator />
                  <div className={'col-span-2'}>{userData.pronouns}</div>
                  {birthday !== '01/01/1900' && (
                    <>
                      <Separator />
                      <div className={'col-span-2'}>{birthday}</div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </main>
  )
}

const ListSocialItem = ({ IconComponent, userData, link }) => (
  <li>
    <Separator />
    <Link
      href={link}
      className="relative flex items-center space-x-4 py-4 px-2"
    >
      <div className={'min-w-0 flex-auto'}>
        <div className="flex items-center gap-x-3">
          <div className={'flex-none rounded-full p-1'}>
            <IconComponent />
          </div>
          <h2 className="min-w-0 text-sm font-semibold leading-6 truncate">
            <span className="truncate">{userData}</span>
          </h2>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 flex-none" aria-hidden="true" />
    </Link>
  </li>
)
