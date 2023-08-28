"use client";
import { useState, useEffect } from "react";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [visibleGallery, setVisibleGallery] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathParts = window.location.pathname.split('/');
  const uniqueId = pathParts[2];

  const apiUrl = `https://backend.fayevr.dev/api/${pathParts}?populate=*`;

  useEffect(() => {
    setIsLoading(true);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setGallery(data.data.reverse()); // Reverse the order of the array
        //console.log(data.data);
        setVisibleGallery(data.data.slice(0, 12));
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleLoadMore = () => {
    const nextVisibleGallery = gallery.slice(0, visibleGallery.length + 12);
    setVisibleGallery(nextVisibleGallery);
    if (nextVisibleGallery.length === gallery.length) {
      setLoadMore(false);
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
              <img
                src={item.attributes.image.data.attributes.formats.small.url}
                alt={item.attributes.title}
                className="rounded-lg object-cover"
              />
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
