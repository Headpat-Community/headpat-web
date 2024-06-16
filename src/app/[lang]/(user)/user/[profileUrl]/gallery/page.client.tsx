'use client'
import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import {
  SiDiscord,
  SiFuraffinity,
  SiTelegram,
  SiTwitch,
  SiX,
} from '@icons-pack/react-simple-icons'
import * as Sentry from '@sentry/nextjs'
import { useToast } from '@/components/ui/use-toast'

export default function FetchGallery() {
  const [gallery, setGallery] = useState([])
  const [userId, setUserId] = useState(null)
  const [enableNsfw, setEnableNsfw] = useState(false)
  const [userData, setUserData] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  //const [totalPages, setTotalPages] = useState(1)
  const { toast } = useToast()

  const username =
    typeof window !== 'undefined' ? window.location.pathname.split('/')[2] : ''

  const getGalleryImageUrl = (galleryId: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/gallery/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=400`
  }

  const getAvatarImageUrl = (galleryId: string) => {
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`
  }

  useEffect(() => {
    fetch(
      `/api/user/getUserProfileFilter?queries[]=equal("profileurl","${username}")`,
      {
        method: 'GET',
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setUserData(data.documents[0]) // Access the first (and only) object in the array
        setUserId(data.documents[0].$id)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [username])

  useEffect(() => {
    if (!userId) return // Wait for userId to be available

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/user/getUserDataSelf`, {
          method: 'GET',
        })

        const data = await response.json()
        setEnableNsfw(data[0].enablensfw)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUserData().catch((error) => {
      toast({
        title: 'Error',
        description: "You encountered an error. But don't worry, we're on it.",
        variant: 'destructive',
      })
      Sentry.captureException(error)
    })
  }, [userId, toast])

  useEffect(() => {
    if (!userId) return // Wait for userId to be available

    const filters = !enableNsfw
      ? `queries[]=equal("userId","${userId}")&queries[]=equal("nsfw",false)`
      : `queries[]=equal("userId","${userId}")`

    const pageSize = 500 // Number of items per page
    const offset = (currentPage - 1) * pageSize // Calculate offset based on current page
    const apiUrl = `/api/gallery/getUserGallery?${filters}&queries[]=limit(${pageSize})&queries[]=offset(${offset})`

    fetch(apiUrl, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        //setGallery(data.data.reverse());
        setGallery(data.documents)
        //setTotalPages(data.total / pageSize)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [userId, enableNsfw, currentPage])

  /*
    const handlePageChange = (page) => {
      setCurrentPage(page)
      window.history.pushState({ page }, `Page ${page}`, `?page=${page}`)
    }*/

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <>
      <div>
        <header className="relative isolate pt-16">
          <div
            className="absolute inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
              <div
                className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#007f4a] to-[#6f7603] dark:from-[#FF80B5] dark:to-[#9089FC]"
                style={{
                  clipPath:
                    'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
                }}
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-black/95 dark:bg-white/95" />
          </div>

          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
              <div className="flex items-center gap-x-6">
                <Link
                  href={'.'}
                  className="hidden rounded-md bg-indigo-600 p-2 pb-1 pt-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:block"
                >
                  Go back
                </Link>
                <div className="mt-1 text-base font-semibold leading-6">
                  <div className="mt-1 text-base font-semibold leading-6">
                    {userData ? (
                      <Image
                        src={getAvatarImageUrl(userData.avatarId)}
                        alt=""
                        className="h-16 w-16 flex-none rounded-full ring-1 ring-black/10 dark:ring-white/10"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <Image
                        src="/logos/Headpat_Logo_web_512x512_240518-03.png"
                        alt=""
                        className="h-16 w-16 flex-none rounded-full ring-1 ring-black/10 dark:ring-white/10"
                        width={64}
                        height={64}
                      />
                    )}
                  </div>
                </div>
                <h1>
                  <div className="mt-1 text-base font-semibold leading-6">
                    {userData?.displayname}
                  </div>
                </h1>
              </div>
              <div className="flex items-center gap-x-4 sm:gap-x-6">
                {userData?.telegramname && (
                  <Link
                    href={`https://t.me/${userData.telegramname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiTelegram className="text-2xl hover:text-indigo-500" />
                  </Link>
                )}
                {userData?.discordname && (
                  <Link
                    href={`https://discord.com/users/${userData.discordname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiDiscord className="text-2xl hover:text-indigo-500" />
                  </Link>
                )}
                {userData?.X_name && (
                  <Link
                    href={`https://x.com/${userData.X_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiX className="text-2xl hover:text-indigo-500" />
                  </Link>
                )}
                {userData?.twitchname && (
                  <Link
                    href={`https://twitch.tv/${userData.twitchname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiTwitch className="text-2xl hover:text-indigo-500" />
                  </Link>
                )}
                {userData?.furaffinityname && (
                  <Link
                    href={`https://www.furaffinity.net/user/${userData.furaffinityname}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiFuraffinity className="text-2xl hover:text-indigo-500" />
                  </Link>
                )}
                <button
                  type="button"
                  className="hidden rounded-md bg-indigo-600 p-2 pb-1 pt-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:block"
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
                        {({ focus }) => (
                          <>
                            <Link
                              href={`/user/${username}/gallery`}
                              className={classNames(
                                focus ? 'bg-gray-50' : '',
                                'block w-full px-3 py-1 text-left text-sm leading-6 text-black'
                              )}
                            >
                              Gallery
                            </Link>
                            <button
                              type="button"
                              className={classNames(
                                focus ? 'bg-gray-50' : '',
                                'block w-full px-3 py-1 text-left text-sm leading-6 text-black'
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
          className="flex flex-wrap items-center justify-center gap-4 p-8"
        >
          {gallery.map((item) => (
            <div key={item.$id}>
              {item && (
                <div
                  className={`h-64 overflow-hidden rounded-lg ${
                    item.nsfw && !enableNsfw ? 'relative' : ''
                  }`}
                >
                  {item.nsfw && !enableNsfw && (
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                  )}
                  <Link href={`/gallery/${item.$id}`}>
                    <Image
                      src={getGalleryImageUrl(item.gallery_id)}
                      alt={item.imgalt}
                      className={`h-full max-h-[600px] w-full max-w-[600px] object-cover`}
                      width={600}
                      height={600}
                    />
                  </Link>
                </div>
              )}
              <h2>{item.name}</h2>
            </div>
          ))}
        </ul>
      </div>
    </>
  )
}
