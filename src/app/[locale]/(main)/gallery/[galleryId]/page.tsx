import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Query } from '@/app/appwrite-server'
import { getUser } from '@/utils/server-api/account/user'
import { Gallery, UserData } from '@/utils/types/models'
import { Link } from '@/navigation'
import { getGalleryImageUrlView } from '@/components/getStorageItem'
import sanitizeHtml from 'sanitize-html'

export const metadata = {
  title: 'Gallery',
  description:
    'This is the gallery page. You can see the image and its information here.',
}

export const runtime = 'edge'

export default async function GalleryPage({ params: { galleryId } }) {
  const { databases } = await createSessionServerClient()
  const userSelf = await getUser()
  const enableNsfw = userSelf?.prefs?.nsfw || false

  const gallery: Gallery.GalleryType = await databases.listDocuments(
    'hp_db',
    'gallery-images',
    [Query.equal('$id', galleryId)]
  )

  if (!gallery.documents) {
    return notFound()
  }
  const galleryData: Gallery.GalleryDocumentsType = gallery.documents[0]

  const userId = galleryData?.userId
  //const userData = await getUserData(`queries[]=equal("$id","${userId}")`)
  const userDataResponse: UserData.UserDataType = await databases.listDocuments(
    'hp_db',
    'userdata',
    [Query.equal('$id', userId)]
  )
  const userData = userDataResponse.documents[0]

  if (!userId) {
    return notFound()
  }

  const galleryDocuments = gallery.documents[0]

  const isNsfwImage = galleryDocuments?.nsfw && !enableNsfw

  const sanitizedBio = sanitizeHtml(galleryDocuments?.longText)
  const bioWithLineBreaks = sanitizedBio.replace(/\n/g, '<br />')

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
                      href={'/gallery'}
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
                      <Link href={'/gallery'}>
                        <Button>Back to gallery</Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {galleryDocuments?.mimeType?.includes('video') ? (
                      <video
                        controls
                        controlsList="nodownload"
                        loop={true}
                        draggable={false}
                        className={`imgsinglegallery mx-auto h-[550px] w-auto max-w-full rounded-lg object-contain`}
                      >
                        <source
                          src={getGalleryImageUrlView(
                            galleryDocuments?.galleryId
                          )}
                          type={galleryDocuments?.mimeType}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getGalleryImageUrlView(galleryDocuments.galleryId)}
                        alt={
                          galleryDocuments?.name || 'Headpat Community Image'
                        }
                        className={`imgsinglegallery mx-auto h-[550px] w-auto max-w-full rounded-lg object-contain`}
                      />
                    )}
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
                                    {galleryDocuments.name ||
                                      'No title provided.'}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    User:
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    <Link
                                      href={{
                                        pathname: `/user/[profileUrl]`,
                                        params: {
                                          profileUrl: userData.profileUrl,
                                        },
                                      }}
                                      className="text-indigo-500 hover:text-indigo-400"
                                    >
                                      {userData.displayName}
                                    </Link>
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    Created at
                                  </dt>
                                  <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {new Date(
                                      userData.$createdAt
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
                                      userData.$updatedAt
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
                                    {galleryDocuments?.nsfw ? 'Yes' : 'No'}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <dt className="text-sm font-medium leading-6">
                                    Description
                                  </dt>
                                  <dd className="mt-1 max-w-full break-words text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                    {bioWithLineBreaks ||
                                      'No description provided.'}
                                  </dd>
                                </div>
                                <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                  <Link
                                    // @ts-ignore
                                    href={getGalleryImageUrlView(
                                      galleryDocuments.galleryId
                                    )}
                                    target={'_blank'}
                                  >
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
