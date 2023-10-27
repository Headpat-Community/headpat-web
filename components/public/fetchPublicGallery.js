"use client";
import Image from "next/image";
import Link from "next/link";
import Loading from "../../app/loading";
import { useState, useEffect } from "react";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableNsfw, setEnableNsfw] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getToken = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  };

  const handleApiResponse = (response) => {
    if (response.status === 403 || !response.ok) {
      //deleteCookie("jwt");
      window.location.reload();
    }
    return response.json();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetch("/api/user/getUserSelf", {
          method: "GET",
        });
        const data = await handleApiResponse(response);
        setUserId(data.id);

        const userDataResponse = await fetch(
          `/api/user/getUserData/${data.id}`,
          {
            method: "GET",
          }
        );
        const userData = await handleApiResponse(userDataResponse);
        setEnableNsfw(userData.data.attributes.enablensfw);
      } catch (err) {
        setError(err);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      const filters = !enableNsfw ? `&filters[nsfw][$eq]=false` : ``;
      const pageSize = 500;
      const apiUrl = `/api/gallery/getTotalGallery?populate=*${filters}&pagination[pageSize]=${pageSize}&pagination[page]=${currentPage}`;

      setIsLoading(true);

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
        });
        const data = await handleApiResponse(response);
        // Shuffle once when fetched
        const shuffledData = data.data
          .sort(() => Math.random() - 0.5)
          .reverse();
        setGallery(shuffledData);
        setTotalPages(data.meta.pagination.pageCount);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchGalleryData();
  }, [currentPage, enableNsfw]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.history.pushState({ page }, `Page ${page}`, `?page=${page}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = parseInt(urlParams.get("page")) || 1;
    setCurrentPage(page);
  }, []);

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
        {isLoading ? (
          <Loading />
        ) : (
          <ul className="p-8 flex flex-wrap gap-4 justify-center items-center">
            {gallery.map((item) => (
              <div key={item.id}>
                {item.attributes.img && item.attributes.img.data && (
                  <div
                    className={`rounded-lg overflow-hidden h-64 ${
                      item.attributes.nsfw && !enableNsfw ? "relative" : ""
                    }`}
                  >
                    {item.attributes.nsfw && !enableNsfw && (
                      <div className="absolute inset-0 bg-black opacity-50"></div>
                    )}
                    <Link href={`/gallery/${item.id}`}>
                      <Image
                        src={
                          item.attributes.nsfw && !enableNsfw
                            ? "https://placekitten.com/200/300" // Replace with placeholder image URL
                            : item.attributes.img.data.attributes.ext === ".gif"
                            ? item.attributes.img.data.attributes.url
                            : item.attributes.img.data.attributes.formats.small
                            ? item.attributes.img.data.attributes.formats.small
                                .url
                            : item.attributes.img.data.attributes.url
                        }
                        alt={item.attributes.imgalt || item.attributes.name}
                        className={`object-cover h-full w-full max-h-[600px] max-w-[600px]`}
                        width={600}
                        height={600}
                      />
                    </Link>
                  </div>
                )}
                <h2>{item.attributes.name}</h2>
              </div>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
