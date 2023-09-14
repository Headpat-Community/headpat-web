import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableNsfw, setEnableNsfw] = useState(false);
  const galleryContainerRef = useRef(null);
  const shuffledGallery = useMemo(
    () => gallery.sort(() => Math.random() - 0.5),
    [gallery]
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const userApiUrl = `https://backend.headpat.de/api/users/me`;

    const fetchUserId = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      if (!token) return; // Return if "jwt" token does not exist

      try {
        const response = await fetch(userApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserId(data.id);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return; // Wait for userId to be available

    const userDataApiUrl = `https://backend.headpat.de/api/user-data/${userId}`;

    const fetchUserData = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      if (!token) return; // Return if "jwt" token does not exist

      try {
        const response = await fetch(userDataApiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
          },
        });

        const data = await response.json();
        setEnableNsfw(data.data.attributes.enablensfw);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const filters = !enableNsfw ? `&filters[nsfw][$eq]=false` : ``;
    const pageSize = 500;
    const apiUrl = `https://backend.headpat.de/api/galleries?populate=*${filters}&pagination[pageSize]=${pageSize}&pagination[page]=${currentPage}`;

    setIsLoading(true);
    fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOMAIN_API_KEY}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGallery(data.data.reverse());
        setTotalPages(data.meta.pagination.pageCount);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
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
      <div ref={galleryContainerRef}>
        {isLoading ? (
          error ? (
            <p className="text-center text-red-500 font-bold my-8">
              Error: {error && error.message}
            </p>
          ) : (
            <p className="text-center text-gray-500 font-bold my-8">
              Loading...
            </p>
          )
        ) : (
          <ul
            role="list"
            className="p-8 flex flex-wrap gap-4 justify-center items-center"
          >
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
                      <img
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
                        alt={item.attributes.imgalt}
                        className={`object-cover h-full w-full max-h-[600px] max-w-[600px]`}
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
