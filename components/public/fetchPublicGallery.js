"use client";
import { useState, useEffect } from "react";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [visibleGallery, setVisibleGallery] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://backend.headpat.de/api/galleries?populate=*`;

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

  const handleResize = () => {
    setVisibleGallery(getVisibleGallery(gallery, window.innerWidth));
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
                <img
                  src={item.attributes.img.data.attributes.formats.small.url}
                  alt={item.attributes.imgalt}
                  className="rounded-lg object-cover h-64"
                />
              )}
              <h2>{item.attributes.title}</h2>
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
