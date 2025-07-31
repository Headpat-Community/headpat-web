'use client'
import { databases, functions, storage } from '@/app/appwrite-client'
import { useUser } from '@/components/contexts/UserContext'
import ModerationModal from '@/components/gallery/moderation/ModerationModal'
import { getGalleryImageUrlView } from '@/components/getStorageItem'
import NoAccessNsfw from '@/components/static/noAccessNsfw'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import UserCard from '@/components/user/userCard'
import {
  GalleryDocumentsType,
  UserDataDocumentsType
} from '@/utils/types/models'
import { useQuery } from '@tanstack/react-query'
import { decode } from 'blurhash'
import Image from 'next/image'
import Link from 'next/link'
import { ExecutionMethod } from 'node-appwrite'
import { useEffect, useState } from 'react'
import sanitize from 'sanitize-html'
import { useDict } from 'gt-next/client'

export default function PageClient({ galleryId }: { galleryId: string }) {
  const [moderationModalOpen, setModerationModalOpen] = useState(false)
  const { current } = useUser()
  const t = useDict('GalleryPage')

  // Single query for image, prefs, and userData
  const { data, isLoading, isError } = useQuery({
    queryKey: ['gallery-full', galleryId],
    queryFn: async () => {
      // Step 1: Fetch image and prefs in parallel
      const [image, imagePrefsRaw] = await Promise.all([
        databases.getDocument('hp_db', 'gallery-images', `${galleryId}`),
        functions.createExecution(
          'gallery-endpoints',
          '',
          false,
          `/gallery/prefs?galleryId=${galleryId}`,
          ExecutionMethod.GET
        )
      ])
      // Step 2: Fetch user data using userId from image
      const userData: UserDataDocumentsType = await databases.getDocument(
        'hp_db',
        'userdata',
        image.userId
      )
      return {
        image,
        imagePrefs: JSON.parse(imagePrefsRaw.responseBody),
        userData
      }
    },
    enabled: !!galleryId,
    staleTime: 300 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  })

  const image = data?.image
  const imagePrefs = data?.imagePrefs
  const userData = data?.userData

  const [localImagePrefs, setLocalImagePrefs] = useState(imagePrefs)
  useEffect(() => {
    if (data?.imagePrefs) setLocalImagePrefs(data.imagePrefs)
  }, [data?.imagePrefs])

  const description = sanitize(image?.longText)
  const descriptionSanitized = description.replace(/\n/g, '<br />')

  const getImageUrl = (galleryId: string) => {
    return storage.getFileView('gallery', galleryId)
  }

  const getBlurDataURL = (blurHash: string) => {
    if (!blurHash) return '/images/placeholder-image-color.webp'
    const pixels = decode(blurHash, 32, 32)
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')
    if (!ctx) return '/images/placeholder-image-color.webp'
    const imageData = ctx.createImageData(32, 32)
    imageData.data.set(pixels)
    ctx.putImageData(imageData, 0, 0)
    return canvas.toDataURL()
  }

  if (isLoading) {
    return <Skeleton className={'h-96 w-96'} />
  }
  if (isError) {
    return <div className="p-4">{t('failedToLoad')}</div>
  }

  return (
    <div className="m-4">
      <Button asChild>
        <Link href={'/gallery'}>&larr; {t('goBack')}</Link>
      </Button>
      <div className="flex flex-wrap items-center justify-center gap-4 p-8">
        <div>
          <div className="flex flex-wrap items-start">
            {image?.nsfw && !current?.prefs?.nsfw ? (
              <NoAccessNsfw />
            ) : (
              <>
                {image ? (
                  imagePrefs?.isHidden ? (
                    <div className="imgsinglegallery mx-auto h-[550px] w-96 max-w-full rounded-lg object-contain">
                      {t('imageHidden')}
                      <Button
                        onClick={() => setModerationModalOpen(true)}
                        variant={'outline'}
                        className={'flex mt-4'}
                      >
                        {t('showImage')}
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
                          unoptimized={true}
                          placeholder="blur"
                          blurDataURL={getBlurDataURL(image?.blurHash)}
                        />
                      )}
                    </>
                  )
                ) : (
                  <Skeleton className={'h-96 w-96'} />
                )}
                <div className="ml-4">
                  <div className="mt-4">
                    <dl className="divide-y divide-black/10 dark:divide-white/10">
                      <div className="ml-4">
                        <div className="mt-4 px-4 sm:px-0">
                          <h3 className="text-base font-semibold leading-7">
                            {t('imageInfo')}
                          </h3>
                        </div>
                        <div className="mt-4 border-t border-black/10 dark:border-white/10">
                          <dl className="divide-y divide-black/10 dark:divide-white/10">
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6">
                                {t('title')}
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                {image ? (
                                  image.name || t('noTitle')
                                ) : (
                                  <Skeleton className={'h-4 w-[100px]'} />
                                )}
                              </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6">
                                {t('user')}
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
                                {t('createdAt')}
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                {image ? (
                                  new Date(image.$createdAt).toLocaleString()
                                ) : (
                                  <Skeleton className={'h-4 w-[100px]'} />
                                )}
                              </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6">
                                Last changed
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                {image ? (
                                  new Date(image.$updatedAt).toLocaleString(
                                    'en-GB',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    }
                                  )
                                ) : (
                                  <Skeleton className={'h-4 w-[100px]'} />
                                )}
                              </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6">
                                NSFW
                              </dt>
                              <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                {image ? (
                                  image?.nsfw ? (
                                    'Yes'
                                  ) : (
                                    'No'
                                  )
                                ) : (
                                  <Skeleton className={'h-4 w-[50px]'} />
                                )}
                              </dd>
                            </div>
                            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                              <dt className="text-sm font-medium leading-6">
                                Description
                              </dt>
                              <dd className="mt-1 max-w-full break-words text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                {image ? (
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        descriptionSanitized ||
                                        'No description provided.'
                                    }}
                                  />
                                ) : (
                                  <Skeleton className={'h-4 w-[100px]'} />
                                )}
                              </dd>
                            </div>
                            <div className="px-4 py-6 sm:gap-4 sm:px-0 flex items-center">
                              {image ? (
                                <Link
                                  href={getGalleryImageUrlView(image.galleryId)}
                                  target={'_blank'}
                                >
                                  <Button variant={'outline'}>
                                    See full image
                                  </Button>
                                </Link>
                              ) : (
                                <Skeleton className={'h-4 w-[100px]'} />
                              )}
                              {image && (
                                <ModerationModal
                                  isOpen={moderationModalOpen}
                                  setIsOpen={setModerationModalOpen}
                                  image={image as GalleryDocumentsType}
                                  imagePrefs={localImagePrefs}
                                  setImagePrefs={setLocalImagePrefs}
                                  current={current}
                                />
                              )}

                              {image && current?.$id === image.userId && (
                                <Link href={`/account/gallery/${image.$id}`}>
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
  )
}
