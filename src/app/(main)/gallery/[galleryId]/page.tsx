import Client from './page.client'
import { getUserData, getUserDataSelf } from '@/utils/actions/user-actions'
import { getGallery } from '@/utils/actions/gallery-actions'
import { notFound } from 'next/navigation'
import { GalleryDocumentsType, GalleryType } from '@/utils/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Gallerie',
  description:
    'Die Gallerie seite von Headpat Community. Hier könnt ihr alle Bilder sehen die von der Community hochgeladen wurden.',
}

export const runtime = 'edge'

export default async function Gallery({ params: { galleryId } }) {
  const userSelf = await getUserDataSelf()
  const enableNsfw = userSelf?.enableNsfw || false

  const gallery: GalleryType = await getGallery(
    `queries[]=equal("$id","${galleryId}")`
  )
  if (!gallery.documents) {
    return notFound()
  }
  const galleryData: GalleryDocumentsType = gallery.documents[0]

  const userId = galleryData?.userId
  const userData = await getUserData(`queries[]=equal("$id","${userId}")`)

  if (!userId) {
    return notFound()
  }

  const galleryDocuments = gallery.documents[0]

  const name = galleryDocuments?.name
  const longtext = galleryDocuments?.longText
  const nsfw = galleryDocuments?.nsfw

  const isNsfwImage = nsfw && !enableNsfw

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-4 p-8">
        <div>
          {(() => {
            return (
              <div className="flex flex-wrap items-start">
                {isNsfwImage ? (
                  <></>
                ) : (
                  <div className="mb-4 mr-4 flex sm:mt-4 md:mb-0">
                    <Link
                      href="."
                      className="mb-4 rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      &larr; Go back
                    </Link>
                  </div>
                )}
                {isNsfwImage ? (
                  <div className="fixed inset-0 flex items-center justify-center">
                    {/* Semi-transparent overlay */}
                    <div
                      className="fixed inset-0 bg-black opacity-50"
                      onClick={() => {
                        // Handle overlay click if needed (e.g., close the error message)
                      }}
                    ></div>
                    <div className="relative z-10 rounded-lg bg-white p-4 text-xl text-black shadow-lg">
                      You disabled NSFW or you are not logged in, so you
                      can&apos;t see this image.
                      <br />
                      <br />
                      <Link href=".">
                        <Button>Back to gallery</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <Client name={name} gallery={gallery.documents[0]} />
                    <div className="ml-4">
                      <div className="mt-4">
                        <dl className="divide-y divide-black/10 dark:divide-white/10">
                          <div className="ml-4">
                            <div className="mt-4 px-4 sm:px-0">
                              <h3 className="text-base font-semibold leading-7">
                                Image information
                              </h3>
                            </div>
                            <div className="mt-4 border-t border-black/10 dark:border-white/10">
                              <dl className="divide-y divide-black/10 dark:divide-white/10">
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    Title
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {name || 'No title provided.'}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    User:
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    <Link
                                      href={`/user/${userData[0].profileUrl}`}
                                      className="text-indigo-500 hover:text-indigo-400"
                                    >
                                      {userData[0].displayName}
                                    </Link>
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    Created at
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {new Date(
                                      userData[0].$createdAt
                                    ).toLocaleString('en-GB', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    Last changed
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {new Date(
                                      userData[0].$updatedAt
                                    ).toLocaleString('en-GB', {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    NSFW
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {nsfw ? 'Yes' : 'No'}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    Description
                                  </dt>
                                  <dd className="mt-1 max-w-full break-words text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {longtext || 'No description provided.'}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <Link href={galleryDocuments.$id}>
                                    <Button>See full image</Button>
                                  </Link>
                                </div>
                              </dl>
                            </div>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
