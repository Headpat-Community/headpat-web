"use client";
import { useState, useEffect } from "react";

export default function FetchGallery() {
  const [name, setName] = useState([]);
  const [visibleName, setVisibleName] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const pathParts = window.location.pathname.split('/');
  const uniqueId = pathParts[2];

  const apiUrl = `https://backend.fayevr.dev/api/${pathParts}?populate=*`;

  useEffect(() => {
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setName(data.data.reverse()); // Reverse the order of the array
        setVisibleName(data.data.slice(0, 12));
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, );

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
          {visibleName.map((item) => (
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
    </div>
  );
}
