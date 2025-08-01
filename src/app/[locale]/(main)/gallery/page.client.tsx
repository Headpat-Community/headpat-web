'use client'
import { databases, Query, storage } from '@/app/appwrite-client'
import { useUser } from '@/components/contexts/UserContext'
import { UploadButton } from '@/components/gallery/upload-button'
import PaginationComponent from '@/components/Pagination'
import { useHeader } from '@/components/sidebar/header-client'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GalleryDocumentsType, GalleryType } from '@/utils/types/models'
import { captureException } from '@sentry/nextjs'
import { ImageFormat } from 'appwrite'
import { decode } from 'blurhash'
import { useTranslations } from 'gt-next/client'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function FetchGallery() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { current } = useUser()
  const [gallery, setGallery] = useState<GalleryDocumentsType[]>([])
  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page, 10) : 1
  })
  const [totalPages, setTotalPages] = useState(1)
  const [sortType, setSortType] = useState<'newest' | 'random'>('newest')
  const [seenItems, setSeenItems] = useState<Set<string>>(new Set())
  const pageSize = 48 // Number of items per page
  const { addHeaderComponent, removeHeaderComponent } = useHeader()
  const t = useTranslations('GalleryPage')

  // Initialize state from URL parameters
  useEffect(() => {
    const page = searchParams.get('page')
    const sort = searchParams.get('sort')

    if (page) {
      const pageNum = parseInt(page)
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum)
      }
    }

    if (sort && (sort === 'newest' || sort === 'random')) {
      setSortType(sort)
    }
  }, [searchParams])

  const updateUrl = (page: number, sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    params.set('sort', sort)
    router.push(`?${params.toString()}`)
  }

  const handleInputChange = (e: {
    target: { name: string; value: number }
  }) => {
    const newPage = e.target.value
    setCurrentPage(newPage)
    updateUrl(newPage, sortType)
  }

  const handleSortChange = (value: string) => {
    setSortType(value as 'newest' | 'random')
    setCurrentPage(1) // Reset to first page when changing sort
    updateUrl(1, value)
  }

  const getGalleryImageUrl = (
    galleryId: string,
    output: ImageFormat = ImageFormat.Jpg
  ) => {
    if (!galleryId) return

    return storage.getFilePreview(
      'gallery',
      `${galleryId}`,
      256,
      256,
      undefined,
      50,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      output
    )
  }

  const getVideoUrl = (galleryId: string) => {
    if (!galleryId) return
    return storage.getFileView('gallery', `${galleryId}`)
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

  useEffect(() => {
    const fetchGalleryData = async () => {
      const offset = (currentPage - 1) * pageSize

      const filters = []
      if (!current?.prefs?.nsfw) {
        filters.push(Query.equal('nsfw', false))
      }
      filters.push(Query.limit(pageSize))
      filters.push(Query.offset(offset))

      if (sortType === 'newest') {
        filters.push(Query.orderDesc('$createdAt'))
      } else if (sortType === 'random') {
        // Get total count first
        const totalCount = await databases.listDocuments(
          'hp_db',
          'gallery-images',
          [Query.limit(1)]
        )
        setTotalPages(Math.ceil(totalCount.total / pageSize))

        // If we're on page 1, fetch and shuffle all items
        if (currentPage === 1) {
          setSeenItems(new Set()) // Reset seen items when going back to page 1
          const allGallery = await databases.listDocuments(
            'hp_db',
            'gallery-images',
            !current?.prefs?.nsfw
              ? [Query.equal('nsfw', false), Query.limit(1000)]
              : [Query.limit(1000)]
          )
          const allDocuments =
            allGallery.documents as unknown as GalleryDocumentsType[]
          const shuffled = [...allDocuments].sort(() => Math.random() - 0.5)

          // Store the first page and seen items
          const firstPage = shuffled.slice(0, pageSize)
          setGallery(firstPage)
          setSeenItems(new Set(firstPage.map((item) => item.$id)))
          return
        }

        // For subsequent pages, fetch items we haven't seen yet
        const unseenFilters = [...filters]
        if (seenItems.size > 0) {
          // Create an array of notEqual queries for each seen item
          const notEqualQueries = Array.from(seenItems).map((id) =>
            Query.notEqual('$id', id)
          )
          // Add all notEqual queries using Query.and
          unseenFilters.push(Query.and(notEqualQueries))
        }

        const newGallery = await databases.listDocuments(
          'hp_db',
          'gallery-images',
          unseenFilters
        )

        // If we've seen all items, reset seen items and fetch from the beginning
        if (newGallery.documents.length === 0) {
          setSeenItems(new Set())
          const allGallery = await databases.listDocuments(
            'hp_db',
            'gallery-images',
            !current?.prefs?.nsfw
              ? [Query.equal('nsfw', false), Query.limit(1000)]
              : [Query.limit(1000)]
          )
          const allDocuments =
            allGallery.documents as unknown as GalleryDocumentsType[]
          const shuffled = [...allDocuments].sort(() => Math.random() - 0.5)
          const pageItems = shuffled.slice(0, pageSize)
          setGallery(pageItems)
          setSeenItems(new Set(pageItems.map((item) => item.$id)))
          return
        }

        const newDocuments =
          newGallery.documents as unknown as GalleryDocumentsType[]
        const shuffled = [...newDocuments].sort(() => Math.random() - 0.5)
        const pageItems = shuffled.slice(0, pageSize)

        // Update seen items and gallery
        setGallery(pageItems)
        setSeenItems(
          (prev) => new Set([...prev, ...pageItems.map((item) => item.$id)])
        )
        return
      }

      try {
        const gallery: GalleryType = await databases.listDocuments(
          'hp_db',
          'gallery-images',
          filters
        )

        setGallery(gallery.documents)
        setTotalPages(Math.ceil(gallery.total / pageSize))
      } catch (error) {
        toast.error(error)
        captureException(error)
      }
    }

    fetchGalleryData().catch((error) => {
      toast.error("You encountered an error. But don't worry, we're on it.")
      captureException(error)
    })
  }, [current, currentPage, sortType])

  // Reset seen items when changing sort type
  useEffect(() => {
    setSeenItems(new Set())
  }, [sortType])

  // Add header component
  useEffect(() => {
    const uploadButton = (
      <UploadButton current={current} key="gallery-upload-button" />
    )
    addHeaderComponent(uploadButton)
    return () => removeHeaderComponent(uploadButton)
  }, [addHeaderComponent, removeHeaderComponent])

  return (
    <div>
      <Tabs
        defaultValue="newest"
        className="w-full"
        value={sortType}
        onValueChange={handleSortChange}
      >
        <div className="flex flex-col items-center justify-center">
          <TabsList className="grid w-full sm:max-w-4xl grid-cols-2">
            <TabsTrigger value="newest">{t('newest')}</TabsTrigger>
            <TabsTrigger value="random">{t('random')}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="newest">
          <div>
            <ul className="flex flex-wrap items-center justify-center gap-4 p-8">
              {gallery &&
                gallery.map((item) => {
                  const format = item.mimeType?.split('/').pop()
                  const imageFormat = format
                    ? (ImageFormat[
                        format.charAt(0).toUpperCase() + format.slice(1)
                      ] as ImageFormat)
                    : undefined

                  return (
                    <div key={item.$id}>
                      {item && (
                        <div
                          className={`h-64 w-64 ${
                            item.nsfw && !current?.prefs?.nsfw ? 'relative' : ''
                          }`}
                        >
                          {item.nsfw && !current?.prefs?.nsfw && (
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                          )}
                          <Link
                            href={`/gallery/${item.$id}`}
                            className="relative"
                          >
                            {item?.mimeType?.includes('video') && (
                              <div className="relative h-full w-full">
                                <video
                                  className="h-full w-full object-cover"
                                  controls
                                  controlsList="nodownload"
                                  autoPlay={false}
                                  loop={true}
                                  muted={true}
                                  draggable={false}
                                  playsInline={true}
                                >
                                  <source
                                    src={getVideoUrl(item.galleryId)}
                                    type="video/mp4"
                                  />
                                </video>
                              </div>
                            )}
                            <Image
                              src={getGalleryImageUrl(
                                item.galleryId,
                                imageFormat
                              )}
                              alt={item.name || 'Gallery Image'}
                              className={`h-full max-h-[600px] w-full max-w-[600px] object-cover rounded-lg`}
                              width={256}
                              height={256}
                              quality={90}
                              draggable={false}
                              loading="lazy"
                              unoptimized={true}
                              placeholder="blur"
                              blurDataURL={getBlurDataURL(item.blurHash)}
                            />
                            {(item.mimeType === 'image/gif' ||
                              item.mimeType.includes('video')) && (
                              <Badge className="absolute top-0 -translate-y-1/2 left-2 bg-secondary border-primary uppercase">
                                {imageFormat}
                              </Badge>
                            )}
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
            </ul>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              handleInputChange={handleInputChange}
            />
          </div>
        </TabsContent>

        <TabsContent value="random">
          <div>
            <ul className="flex flex-wrap items-center justify-center gap-4 p-8">
              {gallery &&
                gallery.map((item) => {
                  const format = item.mimeType?.split('/').pop()
                  const imageFormat = format
                    ? (ImageFormat[
                        format.charAt(0).toUpperCase() + format.slice(1)
                      ] as ImageFormat)
                    : undefined

                  return (
                    <div key={item.$id}>
                      {item && (
                        <div
                          className={`h-64 w-64 ${
                            item.nsfw && !current?.prefs?.nsfw ? 'relative' : ''
                          }`}
                        >
                          {item.nsfw && !current?.prefs?.nsfw && (
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                          )}
                          <Link
                            href={`/gallery/${item.$id}`}
                            className="relative"
                          >
                            {item?.mimeType?.includes('video') && (
                              <div className="relative h-full w-full">
                                <video
                                  className="h-full w-full object-cover"
                                  controls
                                  controlsList="nodownload"
                                  autoPlay={false}
                                  loop={true}
                                  muted={true}
                                  draggable={false}
                                  playsInline={true}
                                >
                                  <source
                                    src={getVideoUrl(item.galleryId)}
                                    type="video/mp4"
                                  />
                                </video>
                              </div>
                            )}
                            <Image
                              src={getGalleryImageUrl(
                                item.galleryId,
                                imageFormat
                              )}
                              alt={item.name || 'Gallery Image'}
                              className={`h-full max-h-[600px] w-full max-w-[600px] object-cover rounded-lg`}
                              width={256}
                              height={256}
                              quality={90}
                              draggable={false}
                              loading="lazy"
                              unoptimized={true}
                              placeholder="blur"
                              blurDataURL={getBlurDataURL(item.blurHash)}
                            />
                            {(item.mimeType === 'image/gif' ||
                              item.mimeType.includes('video')) && (
                              <Badge className="absolute top-0 -translate-y-1/2 left-2 bg-secondary border-primary uppercase">
                                {imageFormat}
                              </Badge>
                            )}
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
            </ul>
            <PaginationComponent
              totalPages={totalPages}
              currentPage={currentPage}
              handleInputChange={handleInputChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
