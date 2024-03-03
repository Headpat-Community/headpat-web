import Link from 'next/link'
import {
  getAnnouncement,
} from '../../../../utils/actions/announcement-actions'

export const runtime = 'edge'

export const metadata = {
  title: 'Announcements',
}

const getAvatarImageUrl = (galleryId) => {
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`
}

export default async function Page({ params: { announcementId } }) {
  const announcementData = await getAnnouncement(announcementId)
  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text- justify-center text-center mt-4">
            Announcement Information
          </h3>
        </div>
        <div className="mt-6 max-w-4xl mx-auto">
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 mb-8">
            <Link
              href="."
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              &larr; Go back
            </Link>
          </dd>
          <dl className="divide-y dark:divide-white/40 divide-black/40">
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Author</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 flex items-center">
                <Link
                  className="text-indigo-500 hover:text-indigo-400 flex items-center"
                  href={`/user/${announcementData?.userdata?.profileurl}`}
                  passHref
                >
                  <img
                    className="h-12 w-12 flex-none rounded-full mr-4"
                    src={getAvatarImageUrl(
                      announcementData?.userdata?.avatarId ||
                      '/logos/logo-64.webp',
                    )}
                    alt=""
                    width={48}
                    height={48}
                  />
                  {announcementData?.userdata?.displayname ||
                    'Unbekannter Benutzer'}
                </Link>
              </dd>
            </div>
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <strong>
                  {announcementData?.title || 'Unknown'}
                </strong>{' '}
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1}/>
                </svg>
                {' '}
                {announcementData?.sidetext || 'Unknown'}
              </dd>
            </div>
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Valid until</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {announcementData?.validuntil &&
                  new Date(
                    announcementData?.validuntil,
                  ).toLocaleDateString()}
                {new Date(announcementData?.validuntil) >
                new Date() ? (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div
                      className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div
                        className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                    </div>
                    <p className="text-xs leading-5 dark:text-white/80 text-black/80">
                      Aktiv
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div
                      className="flex-none rounded-full bg-red-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500"/>
                    </div>
                    <p className="text-xs leading-5 dark:text-white/80 text-black/80">
                      Inaktiv
                    </p>
                  </div>
                )}
              </dd>
            </div>
            <div
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 mb-4">
                {announcementData?.description || 'Unknown'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
