import { createAdminClient } from '@/app/appwrite-session'
import Link from 'next/link'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'
import sanitize from 'sanitize-html'
import { Button } from '@/components/ui/button'
import { AnnouncementDocumentsType } from '@/utils/types/models'

export const metadata = {
  title: 'Announcements'
}

export default async function Page(props: {
  params: Promise<{ announcementId: string }>
}) {
  const params = await props.params

  const { announcementId } = params

  const { databases } = await createAdminClient()

  const announcementData: AnnouncementDocumentsType =
    await databases.getDocument('hp_db', 'announcements', announcementId)

  const description = sanitize(announcementData?.description)
  const descriptionSanitized = description.replace(/\n/g, '<br />')

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
            <Button asChild>
              <Link href={'/announcements'}>&larr; Go back</Link>
            </Button>
          </dd>
          <dl className="divide-y divide-black/40 dark:divide-white/40">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Author</dt>
              <dd className="mt-1 flex items-center text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Link
                  className="flex items-center text-link hover:text-link/80"
                  href={`/user/${announcementData?.userData?.profileUrl}`}
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
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                      Active
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                      Inactive
                    </p>
                  </div>
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mb-4 mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <div
                  dangerouslySetInnerHTML={{
                    __html: descriptionSanitized || 'Nothing here yet!'
                  }}
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
