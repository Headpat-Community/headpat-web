"use client";
import { useEffect, useState, Fragment } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import Header from "../../../components/header";
import {
  CalendarDaysIcon,
  EllipsisVerticalIcon,
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  UserCircleIcon,
  PencilSquareIcon,
  XMarkIcon as XMarkIconMini,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faPersonHalfDress,
} from "@fortawesome/free-solid-svg-icons";
import {
  faTelegram,
  faDiscord,
  faXTwitter,
  faTwitch,
} from "@fortawesome/free-brands-svg-icons";
import ErrorPage from "../../../components/404";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const activity = [
  {
    id: 1,
    type: "commented",
    person: {
      name: "fafa",
      imageUrl: "/logo.png",
    },
    comment: "Irgendwann könnt ihr hier auch comments schreiben! :3",
    date: "soon",
    dateTime: "2023-01-23T15:56",
  },
];
const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: FaceSmileIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XMarkIconMini,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

export const runtime = "edge";

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [userMe, setUserMe] = useState(null);
  const [selected, setSelected] = useState(moods[5]);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false); // Add this state
  const [isBirthdayToday, setIsBirthdayToday] = useState(false);

  const rawBirthday = userData?.data?.attributes?.birthday; // ISO date string

  // Parse the ISO date string to a Date object
  const dateObject = new Date(rawBirthday);

  // Format the date as "DD-MM-YYYY"
  const formattedBirthday = `${dateObject
    .getDate()
    .toString()
    .padStart(2, "0")}.${(dateObject.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${dateObject.getFullYear()}`;

  // Check if the formatted birthday is equal to today's date
  const today = new Date();
  const formattedToday = `${today.getDate().toString().padStart(2, "0")}.${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}.${today.getFullYear()}`;

  useEffect(() => {
    if (formattedBirthday !== '31.01.1900') {
      setIsBirthdayToday(formattedBirthday === formattedToday);
    }
  }, [formattedBirthday, formattedToday]);

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

  return (
    <>
      <Header />
      <main>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
            <Transition
              show={isBirthdayToday}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      {userData &&
                      userData.data.attributes.avatar &&
                      userData.data.attributes.avatar.data &&
                      userData.data.attributes.avatar.data.attributes ? (
                        <img
                          src={
                            userData.data.attributes.avatar.data.attributes.url
                          }
                          alt=""
                          className="h-10 rounded-full"
                        />
                      ) : (
                        <img
                          src="/logo-512.png"
                          alt=""
                          className="h-10 rounded-full"
                        />
                      )}
                    </div>
                    <div className="ml-3 w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.data?.attributes?.displayname}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        It&apos;s their birthday today!
                      </p>
                    </div>
                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          setIsBirthdayToday(false);
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        {userData ? ( // Check if userData exists
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
                    <div className="mt-1 text-base font-semibold leading-6 text-white">
                      <div className="mt-1 text-base font-semibold leading-6 text-white">
                        {userData &&
                        userData.data.attributes.avatar &&
                        userData.data.attributes.avatar.data &&
                        userData.data.attributes.avatar.data.attributes ? (
                          <img
                            src={
                              userData.data.attributes.avatar.data.attributes
                                .url
                            }
                            alt=""
                            className="h-16 w-16 flex-none rounded-full ring-1 ring-white/10"
                          />
                        ) : (
                          <img
                            src="/logo-512.png"
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
                              ? "/furaffinity-hover.png"
                              : "/furaffinity.png"
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
                        <EllipsisVerticalIcon
                          className="h-5 w-5 text-white/80"
                          aria-hidden="true"
                        />
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

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {/* Summary */}
                <div className="lg:col-start-3 lg:row-end-1">
                  <h2 className="sr-only">Summary</h2>
                  <div className="rounded-lg border shadow-sm ring-1 ring-white/20">
                    <dl className="flex flex-wrap">
                      <div className="mt-6 flex w-full flex-none gap-x-4 px-6">
                        <dt className="flex-none">
                          <span className="sr-only">User</span>
                          <UserCircleIcon
                            className="h-6 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm font-medium leading-6 text-white">
                          {userData?.data?.attributes?.displayname}
                        </dd>
                      </div>
                      <div
                        className={`mt-4 mb-4 flex w-full flex-none gap-x-4 px-6`}
                      >
                        <dt className="flex-none">
                          <span className="sr-only">Status</span>
                          <PencilSquareIcon
                            className="h-6 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </dt>
                        <dd className="text-sm font-medium leading-6 text-white">
                          {userData?.data?.attributes?.status}
                        </dd>
                      </div>
                      {userData?.data?.attributes?.pronouns !== "" && (
                        <div
                          className={`flex w-full flex-none gap-x-4 px-6 ${
                            formattedBirthday === "31.01.1900" ? "mb-6" : ""
                          }`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Pronouns</span>
                            <FontAwesomeIcon
                              className="h-6 w-5 text-gray-400"
                              icon={faPersonHalfDress}
                            />
                          </dt>
                          <dd className="text-sm font-medium leading-6 text-white">
                            {userData?.data?.attributes?.pronouns}
                          </dd>
                        </div>
                      )}
                      {formattedBirthday !== "31.01.1900" && (
                        <div
                          className={`mt-4 flex w-full flex-none gap-x-4 px-6 mb-4 ${
                            userData?.data?.attributes?.location === ""
                              ? "mb-6"
                              : ""
                          }`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Birthday</span>
                            <CalendarDaysIcon
                              className="h-6 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </dt>
                          <dd className="text-sm leading-6 text-white">
                            <time dateTime={rawBirthday}>
                              {formattedBirthday}
                            </time>
                          </dd>
                        </div>
                      )}
                      {userData?.data?.attributes?.location !== "" && (
                        <div
                          className={`flex w-full flex-none gap-x-4 px-6 mb-4`}
                        >
                          <dt className="flex-none">
                            <span className="sr-only">Location</span>
                            <FontAwesomeIcon
                              className="h-6 w-5 text-gray-400"
                              icon={faFlag}
                            />
                          </dt>
                          <dd className="text-sm font-medium leading-6 text-white">
                            {userData?.data?.attributes?.location}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Biography */}
                <div className="-mx-4 px-4 py-8 shadow-sm ring-1 ring-white/95 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
                  <h2 className="text-2xl font-semibold leading-6 text-white border-b border-white pb-2">
                    Biografie
                  </h2>
                  <dl className="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
                    <div className="flex">
                      <div
                        className="font-medium text-gray-300"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {userData?.data?.attributes?.bio}
                      </div>
                    </div>
                  </dl>
                </div>

                <div className="lg:col-start-3">
                  {/* Activity feed */}
                  <h2 className="text-sm font-semibold leading-6 text-white">
                    Activity
                  </h2>
                  <ul role="list" className="mt-6 space-y-6">
                    {activity.map((activityItem, activityItemIdx) => (
                      <li
                        key={activityItem.id}
                        className="relative flex gap-x-4"
                      >
                        <div
                          className={classNames(
                            activityItemIdx === activity.length - 1
                              ? "h-6"
                              : "-bottom-6",
                            "absolute left-0 top-0 flex w-6 justify-center"
                          )}
                        >
                          <div className="w-px bg-gray-200" />
                        </div>
                        {activityItem.type === "commented" && (
                          <>
                            <img
                              src={activityItem.person.imageUrl}
                              alt=""
                              className="relative mt-3 h-6 w-6 flex-none rounded-full bg-gray-50"
                            />
                            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200">
                              <div className="flex justify-between gap-x-4">
                                <div className="py-0.5 text-xs leading-5 text-gray-500">
                                  <span className="font-medium text-white">
                                    {activityItem.person.name}
                                  </span>{" "}
                                  commented
                                </div>
                                <time
                                  dateTime={activityItem.dateTime}
                                  className="flex-none py-0.5 text-xs leading-5 text-gray-500"
                                >
                                  {activityItem.date}
                                </time>
                              </div>
                              <p className="text-sm leading-6 text-gray-500">
                                {activityItem.comment}
                              </p>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* New comment form */}
                  <div className="mt-6 flex gap-x-3">
                    <img
                      src="/logo.png"
                      alt=""
                      className="h-6 w-6 flex-none rounded-full bg-gray-50"
                    />
                    <form action="#" className="relative flex-auto">
                      <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
                        <label htmlFor="comment" className="sr-only">
                          Add your comment
                        </label>
                        <textarea
                          rows={2}
                          name="comment"
                          id="comment"
                          className="block w-full resize-none border-0 bg-transparent py-1.5 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="Add your comment..."
                          defaultValue={""}
                        />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                        <div className="flex items-center space-x-5">
                          <div className="flex items-center">
                            <Listbox value={selected} onChange={setSelected}>
                              {({ open }) => (
                                <>
                                  <Listbox.Label className="sr-only">
                                    Your mood
                                  </Listbox.Label>
                                  <div className="relative">
                                    <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                                      <span className="flex items-center justify-center">
                                        {selected.value === null ? (
                                          <span>
                                            <FaceSmileIcon
                                              className="h-5 w-5 flex-shrink-0"
                                              aria-hidden="true"
                                            />
                                            <span className="sr-only">
                                              Add your mood
                                            </span>
                                          </span>
                                        ) : (
                                          <span>
                                            <span
                                              className={classNames(
                                                selected.bgColor,
                                                "flex h-8 w-8 items-center justify-center rounded-full"
                                              )}
                                            >
                                              <selected.icon
                                                className="h-5 w-5 flex-shrink-0 text-white"
                                                aria-hidden="true"
                                              />
                                            </span>
                                            <span className="sr-only">
                                              {selected.name}
                                            </span>
                                          </span>
                                        )}
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                                        {moods.map((mood) => (
                                          <Listbox.Option
                                            key={mood.value}
                                            className={({ active }) =>
                                              classNames(
                                                active
                                                  ? "bg-indigo-600"
                                                  : "bg-black",
                                                "relative cursor-default select-none px-3 py-2"
                                              )
                                            }
                                            value={mood}
                                          >
                                            <div className="flex items-center">
                                              <div
                                                className={classNames(
                                                  mood.bgColor,
                                                  "flex h-8 w-8 items-center justify-center rounded-full"
                                                )}
                                              >
                                                <mood.icon
                                                  className={classNames(
                                                    mood.iconColor,
                                                    "h-5 w-5 flex-shrink-0"
                                                  )}
                                                  aria-hidden="true"
                                                />
                                              </div>
                                              <span className="ml-3 block truncate font-medium">
                                                {mood.name}
                                              </span>
                                            </div>
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                          disabled
                        >
                          Comment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : hasError ? (
          <ErrorPage />
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </>
  );
}
