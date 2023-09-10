"use client";
import Header from "../../../../components/header";
import Footer from "../../../../components/footer";
import { useState, useEffect } from "react";
import ErrorPage from "../../../../components/404";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faTelegram,
  faTwitch,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export const runtime = "edge";

export default function FetchGallery() {
  const [gallery, setGallery] = useState([]);
  const [visibleGallery, setVisibleGallery] = useState([]);
  const [loadMore, setLoadMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [enableNsfw, setEnableNsfw] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasError, setHasError] = useState(false); // Add this state
  const [userMe, setUserMe] = useState(null);

  const username =
  typeof window !== "undefined" ? window.location.pathname.split("/")[2] : "";

  useEffect(() => {
    fetch(
      `https://backend.headpat.de/api/users?populate=*&filters[username][$eq]=${username}`
    )
      .then((response) => response.json())
      .then((data) => {
        //console.log("API response1:", data);
        setUserMe(data); // Access the first (and only) object in the array
        setUserId(data[0].id);
        const userId = data[0].id; // Access the id field of the first (and only) object in the array
        fetch(`https://backend.headpat.de/api/user-data/${userId}?populate=*`)
          .then((response) => response.json())
          .then((data) => {
            //console.log("API response2:", data);
            setUserData(data);
          })
          .catch((error) => {
            console.error("API error:", error);
            setHasError(true); // Set the error state to true
          });
      })
      .catch((error) => {
        console.error("API error:", error);
        setHasError(true); // Set the error state to true
      });
  }, [username]);

  useEffect(() => {
    if (!userId) return; // Wait for userId to be available

    const fetchUserData = async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)jwt\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      if (!token) return; // Return if "jwt" token does not exist

      try {
        const response = await fetch(`https://backend.headpat.de/api/user-data/${userId}?populate=*`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log(data);
        setEnableNsfw(data.data.attributes.enablensfw);
        console.log(data.data.attributes.enablensfw);
      } catch (error) {
        setError(error);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (!userId) return; // Wait for userId to be available

    const filters = !enableNsfw
      ? `filters[users_permissions_user][id][$eq]=${userId}&filters[nsfw][$eq]=false`
      : `filters[users_permissions_user][id][$eq]=${userId}`;

    const apiUrl = `https://backend.headpat.de/api/galleries?populate=*&${filters}`;

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

  const handleLoadMore = (event) => {
    event.preventDefault();
    const nextVisibleGallery = gallery.slice(0, visibleGallery.length + 12);
    setVisibleGallery(nextVisibleGallery);
    if (nextVisibleGallery.length === gallery.length) {
      setLoadMore(false);
    }
    if (nextVisibleGallery.length >= gallery.length) {
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
    <>
      <Header />
      <div>
        {isLoading ? (
          error ? (
            <p className="text-center text-red-500 font-bold my-8">
              Error: {error.message}
            </p>
          ) : (
            <p className="text-center text-gray-500 font-bold my-8">
              Loading...!
            </p>
          )
        ) : (
          <>
            {userMe ? ( // Check if userData exists
              <>
                <header className="relative isolate pt-16">
                  <div
                    className="absolute inset-0 -z-10 overflow-hidden"
                    aria-hidden="true"
                  >
                    <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
                      <div
                        className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                        style={{
                          clipPath:
                            "polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)",
                        }}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/95" />
                  </div>

                  <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
                      <div className="flex items-center gap-x-6">
                        <Link
                          href={"."}
                          className="hidden text-sm font-semibold leading-6 text-white sm:block bg-indigo-600 p-2 pt-1 pb-1 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Go back
                        </Link>
                        <div className="mt-1 text-base font-semibold leading-6 text-white">
                          <div className="mt-1 text-base font-semibold leading-6 text-white">
                            {userData &&
                            userData.data.attributes.avatar &&
                            userData.data.attributes.avatar.data &&
                            userData.data.attributes.avatar.data.attributes ? (
                              <img
                                src={
                                  userData.data.attributes.avatar.data
                                    .attributes.url
                                }
                                alt=""
                                className="h-16 w-16 flex-none rounded-full ring-1 ring-white/10"
                              />
                            ) : (
                              <img
                                src="/logos/logo-512.png"
                                alt=""
                                className="h-16 w-16 flex-none rounded-full ring-1 ring-white/10"
                              />
                            )}
                          </div>
                        </div>
                        <h1>
                          <div className="mt-1 text-base font-semibold leading-6 text-white">
                            {userData &&
                              (userData[0]?.displayname || userMe[0]?.username)}
                          </div>
                        </h1>
                      </div>
                      <div className="flex items-center gap-x-4 sm:gap-x-6">
                        {userData?.data?.attributes?.telegramname && (
                          <Link
                            href={`https://t.me/${userData.data.attributes.telegramname}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={faTelegram}
                              className="text-white hover:text-indigo-500 text-2xl"
                            />
                          </Link>
                        )}
                        {userData?.data?.attributes?.discordname && (
                          <Link
                            href={`https://discord.com/users/${userData.data.attributes.discordname}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={faDiscord}
                              className="text-white hover:text-indigo-500 text-2xl"
                            />
                          </Link>
                        )}
                        {userData?.data?.attributes?.X_name && (
                          <Link
                            href={`https://x.com/${userData.data.attributes.X_name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={faXTwitter}
                              className="text-white hover:text-indigo-500 text-2xl"
                            />
                          </Link>
                        )}
                        {userData?.data?.attributes?.twitchname && (
                          <Link
                            href={`https://twitch.tv/${userData.data.attributes.twitchname}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FontAwesomeIcon
                              icon={faTwitch}
                              className="text-white hover:text-indigo-500 text-2xl"
                            />
                          </Link>
                        )}
                        {userData?.data?.attributes?.furaffinityname && (
                          <Link
                            href={`https://www.furaffinity.net/user/${userData.data.attributes.furaffinityname}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={
                                isHovered
                                  ? "/logos/furaffinity-hover.png"
                                  : "/logos/furaffinity.png"
                              }
                              className="w-8 hover:text-indigo-600"
                              onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                            />
                          </Link>
                        )}
                        <Link
                          href={`/user/${userMe?.[0]?.username}/gallery`}
                          className="hidden text-sm font-semibold leading-6 text-white sm:block bg-indigo-600 p-2 pt-1 pb-1 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Gallery
                        </Link>
                        <button
                          type="button"
                          className="hidden text-sm font-semibold leading-6 text-white sm:block bg-indigo-600 p-2 pt-1 pb-1 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          onClick={() =>
                            navigator.clipboard.writeText(window.location.href)
                          }
                        >
                          Copy URL
                        </button>

                        <Menu as="div" className="relative sm:hidden">
                          <Menu.Button className="-m-3 block p-3">
                            <span className="sr-only">More</span>
                          </Menu.Button>

                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-white/5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <>
                                    <Link
                                      href={`/user/${username}/gallery`}
                                      className={classNames(
                                        active ? "bg-gray-50" : "",
                                        "block w-full px-3 py-1 text-left text-sm leading-6 text-black"
                                      )}
                                    >
                                      Gallery
                                    </Link>
                                    <button
                                      type="button"
                                      className={classNames(
                                        active ? "bg-gray-50" : "",
                                        "block w-full px-3 py-1 text-left text-sm leading-6 text-black"
                                      )}
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          window.location.href
                                        )
                                      }
                                    >
                                      Copy URL
                                    </button>
                                  </>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>
                </header>

                <ul
                  role="list"
                  className="p-8 flex flex-wrap gap-4 justify-center items-center"
                >
                  {visibleGallery.map((item) => (
                    <div key={item.id}>
                      {item.attributes.img && item.attributes.img.data && (
                        <div
                          className={`rounded-lg overflow-hidden h-64 ${
                            item.attributes.nsfw && !enableNsfw
                              ? "relative"
                              : ""
                          }`}
                        >
                          {item.attributes.nsfw && !enableNsfw && (
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                          )}
                          <Link target="_blank" href={`/gallery/${item.id}`}>
                            <img
                              src={
                                item.attributes.nsfw && !enableNsfw
                                  ? "https://placekitten.com/200/300" // Replace with placeholder image URL
                                  : item.attributes.img.data.attributes.ext ===
                                    ".gif"
                                  ? item.attributes.img.data.attributes.url
                                  : item.attributes.img.data.attributes.formats
                                      .small
                                  ? item.attributes.img.data.attributes.formats
                                      .small.url
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
                <div className="flex justify-center">
                  {loadMore && (
                    <button
                      onClick={handleLoadMore}
                      className="flex mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-8"
                    >
                      Load More
                    </button>
                  )}
                </div>
              </>
            ) : hasError ? (
              <ErrorPage />
            ) : (
              <p>Loading...</p>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
