'use client'
import { databases, Query, storage } from '@/app/appwrite-client'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { isMimeTypeAnimatable } from '@/utils/helpers'
import { Gallery } from '@/utils/types/models'
import * as Sentry from '@sentry/nextjs'
import Image from 'next/image'
import { ImageFormat } from 'node-appwrite'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function FetchGallery({ enableNsfw }) {
  const [gallery, setGallery] = useState<Gallery.GalleryDocumentsType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

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

  useEffect(() => {
    const fetchGalleryData = async () => {
      const pageSize = 500 // Number of items per page
      const offset = (currentPage - 1) * pageSize // Calculate offset based on current page
      //const filters = !enableNsfw ? `&queries[]=equal("nsfw",false)` : ``

      const filters = !enableNsfw
        ? [
            Query.equal('nsfw', false),
            Query.limit(pageSize),
            Query.offset(offset),
            Query.orderDesc('$createdAt'),
          ]
        : [
            Query.limit(pageSize),
            Query.offset(offset),
            Query.orderDesc('$createdAt'),
          ]

      //const apiUrl = `${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`
      const gallery: Gallery.GalleryType = await databases.listDocuments(
        'hp_db',
        'gallery-images',
        filters
      )

      try {
        //const data: GalleryType = await getGallery(apiUrl)

        setGallery(gallery.documents)
        setTotalPages(gallery.total / pageSize)
      } catch (error) {
        toast.error(error)
        Sentry.captureException(error)
      }
    }

    fetchGalleryData().catch((error) => {
      toast.error("You encountered an error. But don't worry, we're on it.")
      Sentry.captureException(error)
    })
  }, [currentPage, enableNsfw])

  return (
    <div>
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
                      <Link href={`/gallery/${item.$id}`} className="relative">
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
                          src={getGalleryImageUrl(item.galleryId, imageFormat)}
                          alt={item.name || 'Gallery Image'}
                          className={`h-full max-h-[600px] w-full max-w-[600px] object-cover rounded-lg`}
                          width={256}
                          height={256}
                          quality={90}
                          draggable={false}
                          loading="lazy"
                          unoptimized={isMimeTypeAnimatable(item.mimeType)}
                          placeholder={'blur'}
                          blurDataURL={'/images/placeholder-image-color.webp'}
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
      </div>
    </div>
  )
}
