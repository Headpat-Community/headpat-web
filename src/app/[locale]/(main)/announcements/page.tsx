import { ChevronRight, MegaphoneIcon } from 'lucide-react'
import { createAdminClient } from '@/app/appwrite-session'
import { Announcements } from '@/utils/types/models'
import { Link } from '@/navigation'
import PageLayout from '@/components/pageLayout'

export const runtime = 'edge'

export const metadata = {
  title: 'Announcements',
  description: 'View the latest Community Announcements from Headpat.',
}

export default async function AnnouncementsPage() {
  const { databases } = await createAdminClient()
  const announcementDataResponse: Announcements.AnnouncementDataType =
    await databases.listDocuments('hp_db', 'announcements')
  const announcementData = announcementDataResponse.documents

  return (
    <PageLayout title={'Announcements'}>
      <ul
        role="list"
        className="mx-8 lg:mx-auto mb-4 mt-8 max-w-4xl divide-y divide-gray-100 overflow-hidden shadow-sm ring-1 ring-black/95 dark:ring-white/95 sm:rounded-xl"
      >
        {announcementData &&
          announcementData.map((announcement) => {
            return (
              <li
                key={announcement.$id}
                className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50/90 dark:hover:bg-gray-50/10 sm:px-6"
              >
                <div className="flex min-w-0 gap-x-4">
                  <MegaphoneIcon className={'h-12'} />
                  <div className="min-w-0 flex-auto">
                    <p className="text-sm font-semibold leading-6">
                      <Link
                        href={{
                          pathname: '/announcements/[announcementId]',
                          params: { announcementId: announcement.$id },
                        }}
                      >
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
                              Active
                            </p>
                          </div>
                        ) : (
                          <div className="mt-1 flex items-center gap-x-1.5">
                            <div className="flex-none rounded-full bg-red-500/20 p-1">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                              Inactive
                            </p>
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                  <ChevronRight
                    className="h-5 w-5 flex-none text-gray-400"
                    aria-hidden="true"
                  />
                </div>
              </li>
            )
          })}
      </ul>
    </PageLayout>
  )
}
