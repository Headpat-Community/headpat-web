"use client";
import { useState, useEffect } from "react";
import ErrorPage from "@/components/404";
import Link from "next/link";
import Loading from "@/app/loading";

export default function FetchGallery() {
  const [gallery, setGallery] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayname, setDisplayname] = useState(null);
  const [nsfwProfile, setNsfwProfile] = useState(null);

  const getToken = () => {
    return document.cookie.replace(
      /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
  };

  function getWidthHeightClass(width) {
    if (width < 800) {
      return `w-${width}`;
    } else {
      return "h-[400px] sm:h-[400px] md:h-[500px] lg:h-[800px] xl:h-[1000px]";
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = getToken();
      if (!token) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/user/getUserSelf", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Error fetching user self");
        }
        const data = await response.json();
        const userId = data.id;
        const userDataResponse = await fetch(
          `/api/user/getUserData/${userId}`,
          {
            method: "GET",
          }
        );
        const userData = await userDataResponse.json();
        const enableNsfw = userData.data.attributes.enablensfw;
        setNsfwProfile(enableNsfw);
        if (!enableNsfw) {
          setError("You don't have NSFW enabled!");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [nsfwProfile]);

  useEffect(() => {
    const fetchGalleryData = async () => {
      const pathParts = window.location.pathname.split("/");
      const uniqueId = pathParts[2];

      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/gallery/getUserGallery/${uniqueId}?populate=*`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setGallery(data);
        const userDataResponse = await fetch(
          `/api/user/getUserData/${data.data.attributes.users_permissions_user.data.id}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        const userData = await userDataResponse.json();
        setDisplayname(userData.data?.attributes?.displayname);
      } catch (error) {
        setError(error.message || "An error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryData();
  }, [nsfwProfile]);

  // The rest of the component remains unchanged with conditional rendering based on the data's availability.
  return (
    <div>
      {isLoading ? (
        <Loading />
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
                    {error ||
                      (isNsfwImage ? (
                        <></>
                      ) : (
                        <div className="mr-4 sm:mt-4 mb-4 md:mb-0 flex">
                          <Link
                            href="/gallery"
                            className="rounded-md bg-indigo-500 px-3 py-2 mb-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                          >
                            &larr; Go back
                          </Link>
                        </div>
                      ))}
                    {isNsfwImage ? (
                      <div className="fixed inset-0 flex items-center justify-center">
                        {/* Semi-transparent overlay */}
                        <div
                          className="fixed inset-0 bg-black opacity-50"
                          onClick={() => {
                            // Handle overlay click if needed (e.g., close the error message)
                          }}
                        ></div>
                        <div className="bg-white p-4 rounded-lg shadow-lg text-xl text-black relative z-10">
                          Du hast NSFW deaktiviert oder du bist nicht
                          eingeloggt, daher kannst du dieses Bild nicht sehen.
                          <br />
                          <br />
                          <Link className="text-indigo-600" href=".">
                            Zurück zur Galerie
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={url}
                          alt={name || "Headpat Community Image"}
                          className={`rounded-lg object-contain imgsinglegallery mx-auto ${getWidthHeightClass(
                            width
                          )}`}
                        />
                        <div className="ml-4">
                          <div className="mt-4">
                            <dl className="divide-y dark:divide-white/10 divide-black/10">
                              <div className="ml-4">
                                <div className="px-4 sm:px-0 mt-4">
                                  <h3 className="text-base font-semibold leading-7">
                                    Image description
                                  </h3>
                                </div>
                                <div className="mt-4 border-t dark:border-white/10 border-black/10">
                                  <dl className="divide-y dark:divide-white/10 divide-black/10">
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        Title
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                        {name || "No title provided."}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        Uploaded by:
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                        <Link
                                          href={`/user/${username}`}
                                          className="text-indigo-500 hover:text-indigo-400"
                                        >
                                          {displayname || username}
                                        </Link>
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        Creation Date
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                        {new Date(createdAt).toLocaleDateString(
                                          "de-DE",
                                          {
                                            day: "numeric",
                                            month: "numeric",
                                            year: "numeric",
                                            timeZone: "Europe/Berlin",
                                          }
                                        )}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        Last Modified
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                        {new Date(
                                          modifiedAt
                                        ).toLocaleDateString("de-DE", {
                                          day: "numeric",
                                          month: "numeric",
                                          year: "numeric",
                                          timeZone: "Europe/Berlin",
                                        })}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        NSFW
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                        {nsfw ? "Yes" : "No"}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        Width/Height
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
                                        {width}x{height}
                                      </dd>
                                    </div>
                                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                                      <dt className="text-sm font-medium leading-6">
                                        About
                                      </dt>
                                      <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0 max-w-full break-words">
                                        {longtext || "No description provided."}
                                      </dd>
                                    </div>
                                  </dl>
                                </div>
                              </div>
                            </dl>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              } catch (e) {
                return (
                  <div className="text-center text-red-500 font-bold my-8">
                    <ErrorPage />
                  </div>
                );
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
