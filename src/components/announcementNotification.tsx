import { createAdminClient } from "@/app/appwrite-session"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { AnnouncementDataType } from "@/utils/types/models"

// Cache for announcement data to prevent repeated fetches
const announcementCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default async function AnnouncementNotification() {
  const { databases } = await createAdminClient()

  // Check cache first
  const cacheKey = "announcements"
  const cached = announcementCache.get(cacheKey)
  const now = Date.now()

  let announcementData: any

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    announcementData = cached.data
  } else {
    const announcementDataResponse: AnnouncementDataType =
      await databases.listDocuments("hp_db", "announcements")
    announcementData = announcementDataResponse.documents[0]

    // Update cache
    announcementCache.set(cacheKey, {
      data: announcementData,
      timestamp: now,
    })

    // Clean up old cache entries to prevent memory leaks
    if (announcementCache.size > 10) {
      const firstKey = announcementCache.keys().next().value
      announcementCache.delete(firstKey)
    }
  }

  if (!announcementData) {
    return notFound()
  }

  // Optimize date comparison by doing it once
  const isValid =
    announcementData?.validUntil &&
    new Date(announcementData.validUntil) >= new Date()

  if (!isValid) {
    return null
  }

  return (
    <>
      <div className="relative isolate flex flex-col items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
        <div
          className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          aria-hidden="true"
        >
          <div
            className="aspect-577/310 bg-linear-to-r w-[36.0625rem] from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
            }}
          />
        </div>
        <div
          className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
          aria-hidden="true"
        >
          <div
            className="aspect-577/310 bg-linear-to-r w-[36.0625rem] from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
            }}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p className="text-sm leading-6 text-gray-900">
            <strong className="font-semibold">{announcementData.title}</strong>
            <svg
              viewBox="0 0 2 2"
              className="mx-2 inline h-0.5 w-0.5 fill-current"
              aria-hidden="true"
            >
              <circle cx={1} cy={1} r={1} />
            </svg>
            {announcementData.sideText}
          </p>
          <Link
            href={`/announcements/${announcementData.$id}`}
            className="shadow-xs flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            More info <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </>
  )
}
