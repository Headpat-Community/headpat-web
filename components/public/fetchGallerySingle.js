import { useState, useEffect } from "react";

export default function FetchGallery() {
  const [gallery, setGallery] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathParts = window.location.pathname.split("/");
  const uniqueId = pathParts[2];

  const apiUrl = `https://backend.headpat.de/api/galleries/${uniqueId}?populate=*`;

  useEffect(() => {
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
  }, [apiUrl]);

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
            <img
              src={gallery.data.attributes.img.data.attributes.url}
              alt={gallery.data.attributes.name}
              className="rounded-lg object-cover h-[400px] sm:h-[400px] md:h-[500px] lg:h-[800px] xl:h-[1000px]"
            />
            <h2>Title: {gallery.data.attributes.name}</h2>
            <p>
              Time added:{" "}
              {new Date(gallery.data.attributes.createdAt).toLocaleDateString(
                "de-DE",
                {
                  day: "numeric",
                  month: "numeric",
                  year: "numeric",
                  timeZone: "Europe/Berlin",
                }
              )}
            </p>
            <p>Description: {gallery.data.attributes.longtext}</p>
          </div>
        </div>
      )}
    </div>
  );
}
