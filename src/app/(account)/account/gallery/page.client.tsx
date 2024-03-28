'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Loading from '../../../loading'
import { ErrorMessage, SuccessMessage } from '@/components/alerts'
import { databases, storage, Query } from '@/app/appwrite'
import { useToast } from '@/components/ui/use-toast'
import * as Sentry from '@sentry/nextjs'

export default function FetchGallery({ enableNsfw, userId }) {
  const [gallery, setGallery] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const getGalleryImageUrl = (galleryId: string) => {
    if (!galleryId) return
    const imageId = storage.getFileView('655ca6663497d9472539', `${galleryId}`)
    return imageId.href
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
        : [Query.equal('userId', userId)]

      setIsLoading(true)

      const gallery = await databases.listDocuments(
        'hp_db',
        'gallery-images',
        filters
      )
      console.log(gallery)

      //const gallery = await getGallery(apiUrl)
      setGallery(gallery.documents || [])
      setTotalPages(gallery.total / pageSize)
      setIsLoading(false)
    }

    fetchGalleryData().catch((error) => {
      toast({
        title: 'Error',
        description: "You encountered an error. But don't worry, we're on it.",
        variant: 'destructive',
      })
      Sentry.captureException(error)
    })
  }, [userId, enableNsfw, currentPage])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`)
  }

  // The rest of the component remains unchanged with conditional rendering based on the data's availability.
  return (
    <>
      {success && <SuccessMessage attentionSuccess={success} />}
      {error && <ErrorMessage attentionError={error} />}
      <div>
        {isLoading ? (
          error ? (
            <p className="my-8 text-center font-bold text-red-500">Error!</p>
          ) : (
            <Loading />
          )
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
                      <Link href={`/account/gallery/${item.$id}`}>
                        <Image
                          src={getGalleryImageUrl(item.galleryId)}
                          alt={item.imgAlt || 'Gallery image'}
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
