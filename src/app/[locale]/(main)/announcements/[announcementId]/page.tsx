import { createAdminClient } from '@/app/appwrite-session'
import { Announcements } from '@/utils/types/models'
import { Link } from '@/navigation'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'

export const runtime = 'edge'

export const metadata = {
  title: 'Announcements',
}

export default async function Page({
  params: { announcementId },
}: {
  params: { announcementId: string }
}) {
  const { databases } = await createAdminClient()

  const announcementData: Announcements.AnnouncementDocumentsType =
    await databases.getDocument('hp_db', 'announcements', announcementId)

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text- mt-4 justify-center text-center text-base font-semibold leading-7">
            Announcement Information
          </h3>
        </div>
        <div className="mx-auto mt-6 max-w-4xl">
          <dd className="mb-8 mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            <Link
              href={'/announcements'}
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              &larr; Go back
            </Link>
          </dd>
          <dl className="divide-y divide-black/40 dark:divide-white/40">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Author</dt>
              <dd className="mt-1 flex items-center text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Link
                  className="flex items-center text-indigo-500 hover:text-indigo-400"
                  href={{
                    pathname: '/user/[profileUrl]',
                    params: {
                      profileUrl: announcementData?.userData?.profileUrl,
                    },
                  }}
                  passHref
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="mr-4 h-12 w-12 flex-none rounded-full"
                    src={getAvatarImageUrlPreview(
                      announcementData?.userData?.avatarId,
                      'width=100&output=webp&quality=75'
                    )}
                    alt=""
                    width={48}
                    height={48}
                  />
                  {announcementData?.userData?.displayName ||
                    'Unbekannter Benutzer'}
                </Link>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <strong>{announcementData?.title || 'Unknown'}</strong>{' '}
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>{' '}
                {announcementData?.sideText || 'Unknown'}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Valid until</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {announcementData?.validUntil &&
                  new Date(announcementData?.validUntil).toLocaleDateString()}
                {new Date(announcementData?.validUntil) > new Date() ? (
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
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mb-4 mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {announcementData?.description || 'Unknown'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
