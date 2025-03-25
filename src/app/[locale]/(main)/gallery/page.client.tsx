'use client'
import { databases, Query, storage } from '@/app/appwrite-client'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import * as Sentry from '@sentry/nextjs'
import Image from 'next/image'
import { ImageFormat } from 'node-appwrite'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { GalleryDocumentsType, GalleryType } from '@/utils/types/models'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import PaginationComponent from '@/components/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { decode } from 'blurhash'

export default function FetchGallery({ enableNsfw }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [gallery, setGallery] = useState<GalleryDocumentsType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortType, setSortType] = useState<'newest' | 'random'>('newest')
  const pageSize = 48 // Number of items per page

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

      let filters = []
      if (!enableNsfw) {
        filters.push(Query.equal('nsfw', false))
      }
      filters.push(Query.limit(pageSize))
      filters.push(Query.offset(offset))

      if (sortType === 'newest') {
        filters.push(Query.orderDesc('$createdAt'))
      } else if (sortType === 'random') {
        // For random sorting, we'll use a combination of queries
        // First get all IDs, then randomly select from them
        const allGallery = await databases.listDocuments(
          'hp_db',
          'gallery-images',
          [Query.limit(1000)] // Remove orderDesc for true randomness
        )

        // Get previously seen image IDs based on current page
        const previouslySeenIds = gallery
          .slice(0, (currentPage - 1) * pageSize)
          .map((item) => item.$id)

        // Add notEqual queries for each previously seen ID using Query.and
        if (previouslySeenIds.length > 0) {
          const notEqualQueries = previouslySeenIds.map((id) =>
            Query.notEqual('$id', id)
          )
          filters.push(Query.and(notEqualQueries))
        }

        // Get a new set of random images excluding previously seen ones
        const randomGallery = await databases.listDocuments(
          'hp_db',
          'gallery-images',
          [...filters, Query.limit(pageSize)] // Remove orderDesc here too
        )

        // Randomly shuffle the new documents
        const shuffled =
          randomGallery.documents as unknown as GalleryDocumentsType[]
        const selected = shuffled.sort(() => Math.random() - 0.5)

        setGallery(selected)
        setTotalPages(Math.ceil(allGallery.total / pageSize))
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
        Sentry.captureException(error)
      }
    }

    fetchGalleryData().catch((error) => {
      toast.error("You encountered an error. But don't worry, we're on it.")
      Sentry.captureException(error)
    })
  }, [enableNsfw, currentPage, sortType])

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
            <TabsTrigger value="newest">Newest</TabsTrigger>
            <TabsTrigger value="random">Random</TabsTrigger>
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
                            item.nsfw && !enableNsfw ? 'relative' : ''
                          }`}
                        >
                          {item.nsfw && !enableNsfw && (
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
                            item.nsfw && !enableNsfw ? 'relative' : ''
                          }`}
                        >
                          {item.nsfw && !enableNsfw && (
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
