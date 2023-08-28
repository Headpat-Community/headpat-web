"use client";
import { useState, useEffect } from "react";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [visibleGallery, setVisibleGallery] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const username = window.location.pathname.split("/")[2];
  const userApiUrl = `https://backend.headpat.de/api/users?filters[username][$eq]=${username}`;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(userApiUrl);
        const data = await response.json();
        setUserId(data[0].id);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserId();
  }, [userApiUrl]);

  const apiUrl = `https://backend.headpat.de/api/galleries?populate=*&filters[users_permissions_user][id][$eq]=${userId}`;

  useEffect(() => {
    setIsLoading(true);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setGallery(data.data.reverse()); // Reverse the order of the array
        setVisibleGallery(getVisibleGallery(data.data, window.innerWidth));
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, [apiUrl]);

  const handleLoadMore = () => {
    const nextVisibleGallery = gallery.slice(0, visibleGallery.length + 12);
    setVisibleGallery(nextVisibleGallery);
    if (nextVisibleGallery.length === gallery.length) {
      setLoadMore(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setVisibleGallery(getVisibleGallery(gallery, window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gallery]);

  const getVisibleGallery = (gallery, screenWidth) => {
    if (screenWidth > 900) {
      return gallery.slice(0, 60);
    } else {
      return gallery.slice(0, 6);
    }
  };

  return (
    <div>
      {isLoading ? (
        error ? (
          <p className="text-center text-red-500 font-bold my-8">{error}</p>
        ) : (
          <p className="text-center text-gray-500 font-bold my-8">Loading...</p>
        )
      ) : (
        <ul
          role="list"
          className="p-8 flex flex-wrap gap-4 justify-center items-center"
        >
          {visibleGallery.map((item) => (
            <div key={item.id}>
              {item.attributes.img && item.attributes.img.data && (
                <div
                  className={`rounded-lg overflow-hidden h-64 ${
                    item.attributes.nsfw ? "relative" : ""
                  }`}
                >
                  {item.attributes.nsfw && (
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                  )}
                  <img
                    src={
                      item.attributes.nsfw
                        ? item.attributes.img.data.attributes.formats.small.url
                        : item.attributes.img.data.attributes.mime ===
                          "image/gif"
                        ? item.attributes.img.data.attributes.url
                        : item.attributes.img.data.attributes.height < 156 ||
                          item.attributes.img.data.attributes.width < 156
                        ? item.attributes.img.data.attributes.url
                        : item.attributes.img.data.attributes.formats.small.url
                    }
                    alt={item.attributes.imgalt}
                    className={`object-cover h-full w-full ${
                      item.attributes.nsfw ? "backdrop-blur-xl" : ""
                    }`}
                    style={{
                      filter: item.attributes.nsfw ? "blur(30px)" : "none",
                    }}
                  />
                </div>
              )}
              <h2>{item.attributes.name}</h2>
            </div>
          ))}
        </ul>
      )}
      {loadMore && (
        <button
          onClick={handleLoadMore}
          className="flex mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-8"
        >
          Load More
        </button>
      )}
    </div>
  );
}
