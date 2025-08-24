import { createAdminClient } from "@/app/appwrite-session"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { AnnouncementDataType } from "@/utils/types/models"

export default async function AccountAnnouncements() {
  const { databases } = await createAdminClient()

  const announcementDataResponse: AnnouncementDataType =
    await databases.listDocuments("hp_db", "announcements")
  const announcementData = announcementDataResponse.documents[0]

  if (!announcementData) {
    return notFound()
  }

  return (
    <>
      {announcementData?.validUntil &&
        new Date(announcementData?.validUntil) >= new Date() && (
          <div className="relative isolate flex flex-col items-center gap-x-6 overflow-hidden px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span>Announcement:</span>
              <p className="text-sm leading-6">
                <strong className="font-semibold">
                  {announcementData.title}
                </strong>
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
                className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/80 focus-visible:outline-primary/80 flex-none rounded-full px-3.5 py-1 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                More info <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        )}
    </>
  )
}
