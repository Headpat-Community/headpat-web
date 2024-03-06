'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getGallery } from '../../../utils/actions/gallery-actions'

export default function FetchGallery({ enableNsfw }) {
  const [gallery, setGallery] = useState([])
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const getGalleryImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&quality=100&height=500&operation=fit`
  }

  useEffect(() => {
    const fetchGalleryData = async() => {
      const filters = !enableNsfw ? `&queries[]=equal("nsfw",false)` : ``
      const pageSize = 500 // Number of items per page
      const offset = (currentPage - 1) * pageSize // Calculate offset based on current page
      const apiUrl = `${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`

      try {
        const data = await getGallery(apiUrl)

        setGallery(data.documents)
        setTotalPages(data.total / pageSize)
      } catch (err) {
        setError(err)
      }
    }

    fetchGalleryData()
  }, [currentPage, enableNsfw])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const page = parseInt(urlParams.get('page')) || 1
    setCurrentPage(page)
  }, [])

  return (
    <div>
      {/* Pagination buttons */}
      {/*<div className="flex justify-center items-center my-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={`mx-2 px-4 py-2 rounded-lg ${
              page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>*/}
      <div>
        <ul className="p-8 flex flex-wrap gap-4 justify-center items-center">
          {gallery.map((item) => (
            <div key={item.$id}>
              {item && (
                <div
                  className={`rounded-lg overflow-hidden h-64 ${
                    item.nsfw && !enableNsfw ? 'relative' : ''
                  }`}
                >
                  {item.nsfw && !enableNsfw && (
                    <div
                      className="absolute inset-0 bg-black opacity-50"></div>
                  )}
                  <Link href={`/gallery/${item.$id}`}>
                    <Image
                      src={getGalleryImageUrl(item.gallery_id)}
                      alt={item.imgalt}
                      className={`object-cover h-full w-full max-h-[600px] max-w-[600px]`}
                      width={600}
                      height={600}
                      loading="lazy" // Add this attribute for lazy loading
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
