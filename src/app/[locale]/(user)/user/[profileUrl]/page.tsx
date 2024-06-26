import Image from 'next/image'
import { notFound } from 'next/navigation'
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
import { Separator } from '@/components/ui/separator'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Query } from '@/app/appwrite-server'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FollowerButton } from './page.client'
import { cn } from '@/lib/utils'
import { UserData } from '@/utils/types/models'
import { getFollowers } from '@/utils/server-api/followers/getFollowers'
import {
  getFollowing,
  getIsFollowing,
} from '@/utils/server-api/followers/getFollowing'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import ContextMenuProfile from '@/components/user/contextMenuProfile'
import { getUser } from '@/utils/server-api/account/user'

export const runtime = 'edge'

export const metadata = {
  title: 'User Profile',
  description: 'User Profile Description',
}

export default async function UserProfile({ params: { profileUrl } }) {
  const { databases } = await createSessionServerClient()
  const account = await getUser()

  const getAvatarImageUrl = async (galleryId: string) => {
    if (!galleryId) {
      return '/images/404.webp'
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${galleryId}/view?project=6557c1a8b6c2739b3ecf`
  }

  const getBannerImageUrl = async (galleryId: string) => {
    if (!galleryId) {
      return
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/banners/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=1200&height=250&output=webp`
  }

  const userDataResponse: UserData.UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('profileUrl', profileUrl)]
  )
  const userData = userDataResponse.documents[0]
  const followers = await getFollowers(userData.$id)
  const following = await getFollowing(userData.$id)
  const isFollowingResponse = await getIsFollowing(account.$id, userData.$id)
  const isFollowing = isFollowingResponse.documents.length > 0

  const totalFollowers = followers?.documents?.length
  const totalFollowing = following?.documents?.length

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 10).replace(/-/g, '.')

  const formatDayMonth = (date: Date) =>
    date.toLocaleDateString('en-GB').slice(0, 5).replace(/-/g, '.')

  const today = formatDayMonth(new Date())
  const birthday = userData?.birthday
    ? formatDate(new Date(userData.birthday))
    : '01/01/1900'

  const isBirthday = birthday === today

  if (!userData) {
    return notFound()
  }

  return (
    <ContextMenuProfile>
      <main className={'max-w-7xl mx-auto'}>
        {userData && (
          <>
            {/* Header */}
            {userData.profileBannerId && (
              <header className={'p-0 lg:p-8'}>
                <div className={''}>
                  <Image
                    src={await getBannerImageUrl(userData.profileBannerId)}
                    alt={'User Banner'}
                    className={
                      'rounded-md object-cover max-w-[1200px] max-h-[250px] px-8 lg:px-0 mt-8 lg:mt-0 w-full h-auto'
                    }
                    width={1200}
                    height={250}
                    priority={true}
                  />
                </div>
              </header>
            )}

            {/* Grid */}
            <div
              className={cn(
                'grid grid-cols-1 gap-x-2 md:gap-x-4 lg:gap-x-8 gap-y-8 lg:grid-cols-3 xl:gap-x-10 pr-8 pl-8 md:grid-cols-2',
                userData.profileBannerId ? 'mt-0' : 'mt-8'
              )}
            >
              {/* Left */}
              <div
                className={
                  'col-span-3 lg:col-span-1 lg:mt-0 mt-4 rounded-t-xl rounded-b-xl md:col-span-1'
                }
              >
                <AspectRatio ratio={2 / 2}>
                  <Image
                    src={await getAvatarImageUrl(userData.avatarId)}
                    alt={'User Avatar'}
                    className={'object-contain rounded-t-xl'}
                    fill={true}
                    priority={true}
                    unoptimized
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
                      link={'#'}
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
              <Card
                className={'col-span-3 border-none md:col-span-1 lg:col-span-2'}
              >
                <CardHeader>
                  <div className={'grid grid-cols-2'}>
                    <CardTitle className={'col-span-1'}>
                      {userData.displayName}
                    </CardTitle>
                    <FollowerButton
                      userId={account.$id}
                      displayName={userData.displayName}
                      followerId={userData.$id}
                      isFollowing={isFollowing}
                    />
                  </div>
                  <div className={'grid grid-cols-2'}>
                    <CardDescription>{userData.status}</CardDescription>
                  </div>
                  <CardDescription className={'flex pt-4 gap-4'}>
                    <Link
                      href={{
                        pathname: '/user/[profileUrl]/following',
                        params: { profileUrl: userData.profileUrl },
                      }}
                    >
                      <Button variant={'link'} className={'p-0'}>
                        <p>
                          <span className={'font-bold text-foreground'}>
                            {totalFollowing}
                          </span>{' '}
                          Following
                        </p>
                      </Button>
                    </Link>{' '}
                    <Link
                      href={{
                        pathname: '/user/[profileUrl]/followers',
                        params: { profileUrl: userData.profileUrl },
                      }}
                    >
                      {' '}
                      <Button variant={'link'} className={'p-0'}>
                        <p>
                          <span className={'font-bold text-foreground'}>
                            {totalFollowers}
                          </span>{' '}
                          Followers
                        </p>
                      </Button>
                    </Link>
                  </CardDescription>
                </CardHeader>
                <Separator className={'mb-6'} />
                <CardContent>
                  <div className={'grid grid-cols-2 mx-auto gap-4'}>
                    {userData.pronouns && (
                      <>
                        <div className={'col-span-1'}>Pronouns</div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm col-span-1">
                          {userData.pronouns}
                        </div>
                      </>
                    )}
                    {birthday !== '01/01/1900' && (
                      <>
                        <div className={'col-span-1'}>Birthday</div>
                        <div className="rounded-md border px-4 py-3 font-mono text-sm col-span-1">
                          {birthday}
                        </div>
                      </>
                    )}
                  </div>
                  <div className={'border border-ring p-8 rounded-xl mt-8'}>
                    <div className={'flex flex-wrap items-center'}>
                      <p>{userData.bio || 'Nothing here yet!'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Right */}
              {/* Gallery here */}
            </div>
          </>
        )}
      </main>
    </ContextMenuProfile>
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
            <span>{userData}</span>
          </h2>
        </div>
      </div>

      <ChevronRight className="h-5 w-5 flex-none" aria-hidden="true" />
    </Link>
  </li>
)
