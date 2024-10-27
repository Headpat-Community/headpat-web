'use client'
import { SetStateAction, useEffect, useState } from 'react'
import Image from 'next/image'
import Loading from '@/app/loading'
import { databases, Query, storage } from '@/app/appwrite-client'
import * as Sentry from '@sentry/nextjs'
import { Link } from '@/i18n/routing'
import { toast } from 'sonner'

export default function FetchGallery({ enableNsfw, userId }) {
  const [gallery, setGallery] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getGalleryImageUrl = (galleryId: string) => {
    if (!galleryId) return
    return storage.getFileView('gallery', `${galleryId}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const page = parseInt(urlParams.get('page')) || 1
    setCurrentPage(page)
  }, [])

  useEffect(() => {
    const fetchGalleryData = async () => {
      const pageSize = 5 // Number of items per page
      const offset = (currentPage - 1) * pageSize // Calculate offset based on current page
      //const apiUrl = `${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`

      const filters = !enableNsfw
        ? [
            Query.equal('userId', userId),
            Query.equal('nsfw', false),
            Query.limit(pageSize),
            Query.offset(offset),
          ]
        : [
            Query.equal('userId', userId),
            Query.limit(pageSize),
            Query.offset(offset),
          ]

      setIsLoading(true)

      const gallery = await databases.listDocuments(
        'hp_db',
        'gallery-images',
        filters
      )

      //const gallery = await getGallery(apiUrl)
      setGallery(gallery.documents || [])
      setTotalPages(gallery.total / pageSize)
      setIsLoading(false)
    }

    fetchGalleryData().catch((error) => {
      toast.error('Failed to fetch gallery. Please try again later.')
      Sentry.captureException(error)
    })
  }, [userId, enableNsfw, toast, currentPage])

  const handlePageChange = (page: SetStateAction<number>) => {
    setCurrentPage(page)
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`)
  }

  // The rest of the component remains unchanged with conditional rendering based on the data's availability.
  return (
    <>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <ul
              role="list"
              className="flex flex-wrap items-center justify-center gap-4 p-8"
            >
              {gallery.map((item) => (
                <div key={item.$id}>
                  {item && (
                    <div
                      className={`overflow-hidden ${
                        item.nsfw && !enableNsfw ? 'relative' : ''
                      }`}
                    >
                      {item.nsfw && !enableNsfw && (
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                      )}
                      <Link
                        href={{
                          pathname: '/account/gallery/[galleryId]',
                          params: { galleryId: item.$id },
                        }}
                      >
                        <Image
                          src={getGalleryImageUrl(item.galleryId)}
                          alt={item.name}
                          className={`imgsinglegallery h-full max-h-64 w-full max-w-[600px] object-contain rounded-lg`}
                          width={600}
                          height={600}
                          loading="lazy" // Add this attribute for lazy loading
                        />
                      </Link>
                    </div>
                  )}
                  <h2>{item.name}</h2>
                </div>
              ))}
            </ul>
          </>
        )}
      </div>
      {/* Pagination buttons */}
      <div className="my-4 flex items-center justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`mx-2 rounded-lg px-4 py-2 ${
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  )
}
