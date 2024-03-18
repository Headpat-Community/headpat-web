import { getAnnouncements } from '../../../utils/actions/announcement-actions'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { AnnouncementDataType, AnnouncementDocumentsType } from 'utils/types'

export const runtime = 'edge'

export const metadata = {
  title: 'Announcements',
}

const getAvatarImageUrl = (galleryId: string) => {
  if (!galleryId) {
    return '/logos/Headpat_new_logo.webp'
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`
}

export default async function AnnouncementsPage() {
  const announcementDataTotal: AnnouncementDataType = await getAnnouncements()
  const announcementData: AnnouncementDocumentsType[] =
    announcementDataTotal.documents
  return (
    <>
      <h1 className="mt-4 text-center text-4xl">Announcements</h1>
      <ul
        role="list"
        className="mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:rounded-xl"
      >
        {announcementData &&
          announcementData.map((announcement) => {
            return (
              <li
                key={announcement.$id}
                className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50/90 dark:hover:bg-gray-50/10 sm:px-6"
              >
                <div className="flex min-w-0 gap-x-4">
                  <Image
                    className="h-12 w-12 flex-none rounded-full"
                    src={getAvatarImageUrl(announcement?.userData?.avatarId)}
                    alt=""
                    width={48}
                    height={48}
                  />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6">
                      <Link href={`/announcements/${announcement.$id}`}>
                        <span className="absolute inset-x-0 -top-px bottom-0" />
                        {announcement.title}
                      </Link>
                    </p>
                    <p className="mt-1 flex text-xs leading-5 text-gray-400 dark:text-gray-300">
                      {announcement.sideText}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-4">
                  <div className="hidden sm:flex sm:flex-col sm:items-end">
                    {announcement.validUntil ? (
                      <>
                        <p className="mt-1 text-xs leading-5 text-black/80 dark:text-white/80">
                          Valid until{' '}
                          <time
                            dateTime={new Date(
                              announcement.validUntil
                            ).toISOString()}
                          >
                            {new Date(
                              announcement.validUntil
                            ).toLocaleDateString()}
                          </time>
                        </p>
                        {new Date(announcement.validUntil) > new Date() ? (
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            </div>
                            <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                              Aktiv
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-red-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                              Inaktiv
                            </p>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                  <ChevronRightIcon
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            )
          })}
      </ul>
    </>
  )
}
