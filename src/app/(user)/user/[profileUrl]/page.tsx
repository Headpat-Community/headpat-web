import Image from 'next/image'
import Link from 'next/link'
import {
  SiDiscord,
  SiFuraffinity,
  SiTelegram,
  SiTwitch,
  SiX,
} from '@icons-pack/react-simple-icons'
import {
  CalendarIcon,
  CircleUserIcon,
  MapPinnedIcon,
  PencilIcon,
  PersonStandingIcon,
} from 'lucide-react'
import Loading from '@/app/loading'
import { CopyUrl } from './page.client'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'
import { getUserData } from '@/utils/actions/user-actions'
import { UserDataDocumentsType } from '@/utils/types'

export const runtime = 'edge'

export const metadata = {
  title: 'User Profile',
  description: 'User Profile Description',
}

export default async function UserProfile({ params: { profileUrl } }) {
  const getAvatarImageUrl = (galleryId: string) => {
    if (!galleryId) {
      return '/logos/logo-512.webp'
    }
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`
  }

  const userDataResponse = await getUserData(
    `queries[]=equal("profileUrl","${profileUrl}")`
  )
  const userData: UserDataDocumentsType = userDataResponse[0]

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

  return (
    <>
      <main>
        {userData ? ( // Check if userData exists
          <>
            <header className="relative isolate pt-16">
              <div
                className="absolute inset-0 -z-10 overflow-hidden"
                aria-hidden="true"
              >
                <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
                  <div
                    className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#007f4a] to-[#6f7603] dark:from-[#FF80B5] dark:to-[#9089FC]"
                    style={{
                      clipPath:
                        'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                    }}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-px bg-black/95 dark:bg-white/95" />
              </div>

              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
                  <div className="flex items-center gap-x-6">
                    <div className="mt-1 text-base font-semibold leading-6">
                      <div className="mt-1 text-base font-semibold leading-6">
                        <Image
                          src={getAvatarImageUrl(userData.avatarId)}
                          alt={userData.displayName}
                          className="h-16 w-16 flex-none rounded-full ring-1 ring-black/10 dark:ring-white/10"
                          width={64}
                          height={64}
                        />
                      </div>
                    </div>
                    <h1>
                      <div className="mt-1 text-base font-semibold leading-6">
                        {userData?.displayName}
                      </div>
                    </h1>
                  </div>
                  <div className="flex items-center gap-x-4 sm:gap-x-6">
                    {userData?.telegramname && (
                      <Link
                        href={`https://t.me/${userData.telegramname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiTelegram
                          className="text-2xl hover:text-indigo-500"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Link>
                    )}
                    {userData?.discordname && (
                      <Link
                        href={`https://discord.com/users/${userData.discordname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiDiscord
                          className="text-2xl hover:text-indigo-500"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Link>
                    )}
                    {userData?.X_name && (
                      <Link
                        href={`https://x.com/${userData.X_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiX
                          className="text-2xl hover:text-indigo-500"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Link>
                    )}
                    {userData?.twitchname && (
                      <Link
                        href={`https://twitch.tv/${userData.twitchname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiTwitch
                          className="text-2xl hover:text-indigo-500"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Link>
                    )}
                    {userData?.furaffinityname && (
                      <Link
                        href={`https://www.furaffinity.net/user/${userData.furaffinityname}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiFuraffinity
                          className="text-2xl hover:text-indigo-500"
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        />
                      </Link>
                    )}
                    <Link
                      href={`/user/${userData?.profileUrl}/gallery`}
                      className="hidden sm:block"
                    >
                      <Button>Gallery</Button>
                    </Link>
                    <CopyUrl />
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {/* Summary */}
                <div className="lg:col-start-3 lg:row-end-1">
                  <h2 className="sr-only">Summary</h2>
                  <div className="rounded-lg border shadow-sm ring-1 ring-black/20 dark:ring-white/20">
                    <dl className="flex flex-wrap">
                      <div className="mt-6 flex w-full flex-none gap-x-4 px-6">
                        <dt className="flex-none">
                          <span className="sr-only">User</span>
                          <CircleUserIcon className="h-6" aria-hidden="true" />
                        </dt>
                        <dd className="text-sm font-medium leading-6">
                          {userData?.displayName}
                        </dd>
                      </div>
                      <div
                        className={`mb-4 mt-4 flex w-full flex-none gap-x-4 px-6`}
                      >
                        <dt className="flex-none">
                          <span className="sr-only">Status</span>
                          <PencilIcon className="h-6" />
                        </dt>
                        <dd className="text-sm font-medium leading-6">
                          {userData?.status}
                        </dd>
                      </div>
                      {userData?.pronouns && (
                        <div
                          className={`flex w-full flex-none gap-x-4 px-6 ${
                            birthday === '01/01/1900' ? ' mb-4' : ''
                          }`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Pronouns</span>
                            <PersonStandingIcon className={'h-6'} />
                          </dt>
                          <dd className="text-sm font-medium leading-6">
                            {userData?.pronouns}
                          </dd>
                        </div>
                      )}
                      {birthday !== '01/01/1900' && (
                        <div
                          className={`mb-4 mt-4 flex w-full flex-none gap-x-4 px-6 ${
                            userData?.location === '' ? 'mb-6' : ''
                          }`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Birthday</span>
                            <CalendarIcon className="h-6" aria-hidden="true" />
                          </dt>
                          <dd className="text-sm leading-6">
                            <time dateTime={userData?.birthday}>
                              {birthday}
                            </time>
                          </dd>
                        </div>
                      )}
                      {userData?.location && (
                        <div
                          className={`mb-4 flex w-full flex-none gap-x-4 px-6`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Location</span>
                            <MapPinnedIcon className="h-6 w-5" />
                          </dt>
                          <dd className="text-sm font-medium leading-6">
                            {userData?.location}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Biography */}
                <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                  <h2 className="border-b border-black pb-2 text-2xl font-semibold leading-6 dark:border-white">
                    Biography
                  </h2>
                  <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                    <div className="flex">
                      <div
                        className="font-medium text-gray-800 dark:text-gray-300"
                        style={{ whiteSpace: 'pre-line' }}
                      >
                        {userData?.bio}
                      </div>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </main>
    </>
  )
}
