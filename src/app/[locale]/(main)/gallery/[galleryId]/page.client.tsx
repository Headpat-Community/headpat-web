'use client'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { getGalleryImageUrlView } from '@/components/getStorageItem'
import PageLayout from '@/components/pageLayout'
import { useCallback, useEffect, useState } from 'react'
import { Gallery, UserData } from '@/utils/types/models'
import sanitize from 'sanitize-html'
import { useUser } from '@/components/contexts/UserContext'
import { databases, functions, storage } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { Skeleton } from '@/components/ui/skeleton'
import UserCard from '@/components/user/userCard'
import ModerationModal from '@/components/gallery/moderation/ModerationModal'
import Image from 'next/image'

export default function PageClient({ galleryId }: { galleryId: string }) {
  const [image, setImage] = useState<Gallery.GalleryDocumentsType>(null)
  const [imagePrefs, setImagePrefs] = useState(null)
  const [userData, setUserData] = useState<UserData.UserDataDocumentsType>(null)
  const [moderationModalOpen, setModerationModalOpen] = useState(false)
  const { current } = useUser()

  const fetchGallery = useCallback(async () => {
    try {
      const [imageData, imagePrefs]: any = await Promise.all([
        databases.getDocument('hp_db', 'gallery-images', `${galleryId}`),
        functions.createExecution(
          'gallery-endpoints',
          '',
          false,
          `/gallery/prefs?galleryId=${galleryId}`,
          ExecutionMethod.GET
        ),
      ])

      setImage(imageData)
      setImagePrefs(JSON.parse(imagePrefs.responseBody))

      const userData: UserData.UserDataDocumentsType =
        await databases.getDocument('hp_db', 'userdata', imageData.userId)
      setUserData(userData)
    } catch (error) {
      console.error(error)
    }
  }, [galleryId])

  useEffect(() => {
    fetchGallery().then()
  }, [fetchGallery, galleryId])

  const description = sanitize(image?.longText)
  const descriptionSanitized = description.replace(/\n/g, '<br />')

  if (!image) {
    return <PageLayout title={'Gallery'}>Loading...</PageLayout>
  }

  const getImageUrl = (galleryId: string) => {
    return storage.getFileView('gallery', galleryId)
  }

  return (
    <PageLayout title={'Gallery'}>
      <div>
        <div className="flex flex-wrap items-center justify-center gap-4 p-8">
          <div>
            <div className="flex flex-wrap items-start">
              {!image.nsfw && !current?.prefs?.nsfw && (
                <div className="mb-4 mr-4 flex sm:mt-4 md:mb-0">
                  <Button asChild>
                    <Link href={'/gallery'}>&larr; Go back</Link>
                  </Button>
                </div>
              )}
              {image.nsfw && !current?.prefs?.nsfw ? (
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
                  {imagePrefs?.isHidden ? (
                    <div className="imgsinglegallery mx-auto h-[550px] w-96 max-w-full rounded-lg object-contain">
                      This image is hidden.
                      <Button
                        onClick={() => setModerationModalOpen(true)}
                        variant={'outline'}
                        className={'flex mt-4'}
                      >
                        Show image
                      </Button>
                    </div>
                  ) : (
                    <>
                      {image?.mimeType?.includes('video') ? (
                        <video
                          controls
                          controlsList="nodownload"
                          loop={true}
                          draggable={false}
                          className={`imgsinglegallery mx-auto h-[550px] w-auto max-w-full rounded-lg object-contain`}
                        >
                          <source
                            src={getGalleryImageUrlView(image?.galleryId)}
                            type={image?.mimeType}
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={getImageUrl(image?.galleryId)}
                          alt={image?.name || 'Headpat Gallery Image'}
                          title={image?.name || 'Headpat Gallery Image'}
                          width={1200}
                          height={550}
                          className={`imgsinglegallery mx-auto h-[550px] w-auto max-w-full rounded-lg object-contain`}
                          unoptimized={
                            image.mimeType?.includes('svg') ||
                            image.mimeType?.includes('gif')
                          }
                        />
                      )}
                    </>
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
                                  {image.name || 'No title provided.'}
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6">
                                  User:
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                  {userData ? (
                                    <UserCard user={userData} isChild={true}>
                                      <span className="text-link hover:text-link/80">
                                        {userData.displayName}
                                      </span>
                                    </UserCard>
                                  ) : (
                                    <Skeleton className={'h-4 w-[100px]'} />
                                  )}
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6">
                                  Created at
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                  {new Date(image.$createdAt).toLocaleString(
                                    'en-GB',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6">
                                  Last changed
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                  {new Date(image.$updatedAt).toLocaleString(
                                    'en-GB',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6">
                                  NSFW
                                </dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                  {image?.nsfw ? 'Yes' : 'No'}
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                <dt className="text-sm font-medium leading-6">
                                  Description
                                </dt>
                                <dd className="mt-1 max-w-full break-words text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        descriptionSanitized ||
                                        'No description provided.',
                                    }}
                                  />
                                </dd>
                              </div>
                              <div className="px-4 py-6 sm:gap-4 sm:px-0 flex items-center">
                                <Link
                                  // @ts-ignore
                                  href={getGalleryImageUrlView(image.galleryId)}
                                  target={'_blank'}
                                >
                                  <Button variant={'outline'}>
                                    See full image
                                  </Button>
                                </Link>
                                <ModerationModal
                                  isOpen={moderationModalOpen}
                                  setIsOpen={setModerationModalOpen}
                                  image={image}
                                  imagePrefs={imagePrefs}
                                  setImagePrefs={setImagePrefs}
                                  current={current}
                                />
                                {current?.$id === image.userId && (
                                  <Link
                                    href={{
                                      pathname: '/account/gallery/[galleryId]',
                                      params: {
                                        galleryId: image.$id,
                                      },
                                    }}
                                  >
                                    <Button variant={'outline'}>
                                      Edit image
                                    </Button>
                                  </Link>
                                )}
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
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
