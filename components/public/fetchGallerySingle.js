import { useState, useEffect } from "react";
import ErrorPage from "@/components/404";
import Link from "next/link";

export default function FetchGallery() {
  const [gallery, setGallery] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayname, setDisplayname] = useState(null);
  const [nsfwProfile, setNsfwProfile] = useState(null);

  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      setError("You need to login to be able to see NSFW images!");
    } else if (nsfwProfile === false) {
      setError("You don't have NSFW enabled!");
    }
  }, [nsfwProfile]);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const uniqueId = pathParts[2];

    const apiUrl = `https://backend.headpat.de/api/galleries/${uniqueId}?populate=*`;

    setIsLoading(true);

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setGallery(data);
        setIsLoading(false);
        fetch(
          `https://backend.headpat.de/api/user-data/${data.data.attributes.users_permissions_user.data.id}`
        )
          .then((response) => response.json())
          .then((userData) => {
            setDisplayname(userData.data.attributes.displayname);
            setNsfwProfile(userData.data.attributes.enablensfw);
          })
          .catch((error) => {
            console.error(error);
          });
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
                const modifiedAt = gallery?.data?.attributes?.updatedAt;
                const longtext = gallery?.data?.attributes?.longtext;
                const nsfw = gallery?.data?.attributes?.nsfw;
                const width =
                  gallery?.data?.attributes?.img?.data?.attributes?.width;
                const height =
                  gallery?.data?.attributes?.img?.data?.attributes?.height;
                const username =
                  gallery?.data?.attributes?.users_permissions_user?.data
                    ?.attributes?.username;

                if (!url || !name) {
                  throw new Error("W-where am I? This is not a gallery!");
                }

                const isNsfwImage = nsfw && !nsfwProfile;

                return (
                  <div className="flex flex-wrap items-start">
                    <div className="mr-4 sm:mt-4 mb-4 md:mb-0 flex">
                      <Link
                        href="."
                        className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                      >
                        &larr; Go back
                      </Link>
                    </div>
                    {isNsfwImage || !token ? (
                      <div
                        className={`fixed inset-0 flex items-center justify-center`}
                      >
                        <div className="bg-white p-4 rounded-lg shadow-lg z-50 text-xl text-black">
                          {error}
                        </div>
                      </div>
                    ) : (
                      <img
                        src={url}
                        alt={name || "Headpat Community Image"}
                        className={`rounded-lg object-cover imgsinglegallery ${
                          width < 800
                            ? `w-${width}`
                            : `h-[400px] sm:h-[400px] md:h-[500px] lg:h-[800px] xl:h-[1000px]`
                        } mx-auto`}
                      />
                    )}

                    <div className="ml-4">
                      <div className="px-4 sm:px-0 mt-4">
                        <h3 className="text-base font-semibold leading-7 text-white">
                          Image description
                        </h3>
                      </div>
                      <div className="mt-4 border-t border-white/10">
                        <dl className="divide-y divide-white/10">
                          {/* Rest of your code for displaying image details */}
                        </dl>
                      </div>
                    </div>
                  </div>
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
