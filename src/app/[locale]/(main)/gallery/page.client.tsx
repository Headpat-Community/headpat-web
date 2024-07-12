'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { databases, Query, storage } from '@/app/appwrite-client'
import * as Sentry from '@sentry/nextjs'
import { useToast } from '@/components/ui/use-toast'
import { Link } from '@/navigation'
import { Gallery } from '@/utils/types/models'

export default function FetchGallery({ enableNsfw }) {
  const [gallery, setGallery] = useState<Gallery.GalleryDocumentsType[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const getGalleryImageUrl = (galleryId: string) => {
    if (!galleryId) return
    const imageId = storage.getFilePreview(
      'gallery',
      `${galleryId}`,
      undefined,
      500,
      undefined,
      100
    )
    return imageId.href
  }

  const getVideoUrl = async (galleryId: string) => {
    if (!galleryId) return
    const videoId = await storage.getFileView('gallery', `${galleryId}`)
    return videoId.href
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
          ]
        : [Query.limit(pageSize), Query.offset(offset)]

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
        toast({
          title: 'Error',
          description: error,
          variant: 'destructive',
        })
        Sentry.captureException(error)
      }
    }

    fetchGalleryData().catch((error) => {
      toast({
        title: 'Error',
        description: "You encountered an error. But don't worry, we're on it.",
        variant: 'destructive',
      })
      Sentry.captureException(error)
    })
  }, [currentPage, enableNsfw, toast])

  return (
    <div>
      <div>
        <ul className="flex flex-wrap items-center justify-center gap-4 p-8">
          {gallery &&
            gallery.map(async (item) => (
              <div key={item.$id}>
                {item && (
                  <div
                    className={`h-64 overflow-hidden rounded-lg ${
                      item.nsfw && !enableNsfw ? 'relative' : ''
                    }`}
                  >
                    {item.nsfw && !enableNsfw && (
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                    )}
                    <Link
                      href={{
                        pathname: '/gallery/[galleryId]',
                        params: { galleryId: item.$id },
                      }}
                    >
                      {item?.mimeType?.includes('video') && (
                        <div className="relative h-full w-full">
                          <video
                            className="h-full w-full object-cover"
                            controls
                            autoPlay={false}
                            loop={true}
                            muted={true}
                            draggable={false}
                            playsInline={true}
                          >
                            <source
                              src={await getVideoUrl(item.galleryId)}
                              type="video/mp4"
                            />
                          </video>
                        </div>
                      )}
                      <Image
                        src={getGalleryImageUrl(item.galleryId)}
                        alt={item.name || 'Gallery Image'}
                        className={`h-full max-h-[600px] w-full max-w-[600px] object-cover`}
                        width={600}
                        height={600}
                        draggable={false}
                        loading="lazy" // Add this attribute for lazy loading
                        unoptimized={item?.mimeType?.includes(
                          'image/svg' || 'image/gif' || 'video'
                        )}
                      />
                    </Link>
                  </div>
                )}
              </div>
            ))}
        </ul>
      </div>
    </div>
  )
}
