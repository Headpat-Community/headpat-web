import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [visibleGallery, setVisibleGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableNsfw, setEnableNsfw] = useState(false);

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
            Authorization: `Bearer ${token}`,
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
    const filters = !enableNsfw ? `filters[nsfw][$eq]=false` : ``;
    const apiUrl = `https://backend.headpat.de/api/galleries?populate=*&${filters}&randomSort=true`;

    setIsLoading(true);
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setGallery(data.data.reverse());
        setVisibleGallery(getVisibleGallery(data.data, window.innerWidth));
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [userId, enableNsfw]);

  const loadMoreItems = useCallback(() => {
    // Implement logic to load more items here
    // You can use a similar approach to handleLoadMore
    // For example, you can slice the gallery array to load more items
  }, [gallery]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2, // Adjust this threshold as needed
  });

  useEffect(() => {
    if (inView) {
      loadMoreItems();
    }
  }, [inView, loadMoreItems]);

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
          <p className="text-center text-red-500 font-bold my-8">
            Error: {error && error.message}
          </p>
        ) : (
          <p className="text-center text-gray-500 font-bold my-8">Loading...</p>
        )
      ) : (
        <ul
          role="list"
          className="p-8 flex flex-wrap gap-4 justify-center items-center"
        >
          {visibleGallery.map((item, index) => (
            <div key={item.id} ref={index === visibleGallery.length - 1 ? ref : null}>
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
                          ? item.attributes.img.data.attributes.formats.small.url
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
  );
}
