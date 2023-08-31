import { useState, useEffect } from "react";
import ErrorPage from "@/components/404";

export default function FetchGallery() {
  const [gallery, setGallery] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const uniqueId = pathParts[2];

    const apiUrl = `https://backend.headpat.de/api/galleries/${uniqueId}?populate=*`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setGallery(data); // Set the entire data object
        //console.log(data)
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {isLoading ? (
        error ? (
          <p className="text-center text-red-500 font-bold my-8">{error}</p>
        ) : (
          <p className="text-center text-gray-500 font-bold my-8">Loading...</p>
        )
      ) : (
        <div className="p-8 flex flex-wrap gap-4 justify-center items-center">
          <div>
            {(() => {
              try {
                const imgAttributes =
                  gallery?.data?.attributes?.img?.data?.attributes;
                const url = imgAttributes?.url;
                const name = gallery?.data?.attributes?.name;
                const createdAt = gallery?.data?.attributes?.createdAt;
                const longtext = gallery?.data?.attributes?.longtext;

                if (!url || !name || !createdAt || !longtext) {
                  throw new Error("W-where am I? This is not a gallery!");
                }

                return (
                  <>
                    <img
                      src={url}
                      alt={name}
                      className="rounded-lg object-cover h-[400px] sm:h-[400px] md:h-[500px] lg:h-[800px] xl:h-[1000px]"
                    />
                    <h2>Title: {name}</h2>
                    <p>
                      Time added:{" "}
                      {new Date(createdAt).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "numeric",
                        year: "numeric",
                        timeZone: "Europe/Berlin",
                      })}
                    </p>
                    <p>Description: {longtext}</p>
                  </>
                );
              } catch (e) {
                return (
                  <p className="text-center text-red-500 font-bold my-8">
                    <ErrorPage />
                  </p>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
