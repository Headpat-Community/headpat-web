"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "../../../loading";
import { ErrorMessage, SuccessMessage } from "../../../../components/alerts";
import { getGallery } from "../../../../utils/actions/gallery-actions";

export default function FetchGallery({ enableNsfw, userId }) {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getGalleryImageUrl = (galleryId) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655ca6663497d9472539/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=400`;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      const filters = !enableNsfw
        ? `queries[]=equal("userId","${userId}")&queries[]=equal("nsfw",false)`
        : `queries[]=equal("userId","${userId}")`;

      const pageSize = 5; // Number of items per page
      const offset = (currentPage - 1) * pageSize; // Calculate offset based on current page
      const apiUrl = `${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`;

      setIsLoading(true);

      const gallery = await getGallery(apiUrl);
      setGallery(gallery.documents);
      setTotalPages(gallery.total / pageSize);
      setIsLoading(false);
    };

    fetchGalleryData();
  }, [userId, enableNsfw, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`);
  };

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
                      className={`h-64 overflow-hidden rounded-lg ${
                        item.nsfw && !enableNsfw ? "relative" : ""
                      }`}
                    >
                      {item.nsfw && !enableNsfw && (
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                      )}
                      <Link href={`/account/gallery/${item.$id}`}>
                        <Image
                          src={getGalleryImageUrl(item.gallery_id)}
                          alt={item.imgalt}
                          className={`h-full max-h-[600px] w-full max-w-[600px] object-cover`}
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
              page === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </>
  );
}
