import Link from "next/link";
import { getAnnouncement } from "utils/actions/announcement-actions";
import { AnnouncementDocumentsType } from "utils/types";

export const runtime = "edge";

export const metadata = {
  title: "Announcements",
};

const getAvatarImageUrl = (galleryId: string) => {
  if (!galleryId) {
    return "/logos/Headpat_new_logo.webp";
  }
  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/655842922bac16a94a25/files/${galleryId}/preview?project=6557c1a8b6c2739b3ecf&width=100&output=webp&quality=75`;
};

export default async function Page({
  params: { announcementId },
}: {
  params: { announcementId: string };
}) {
  const announcementData: AnnouncementDocumentsType =
    await getAnnouncement(announcementId);
  console.log(announcementData);
  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text- mt-4 justify-center text-center text-base font-semibold leading-7">
            Announcement Information
          </h3>
        </div>
        <div className="mx-auto mt-6 max-w-4xl">
          <dd className="mb-8 mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            <Link
              href="."
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              &larr; Go back
            </Link>
          </dd>
          <dl className="divide-y divide-black/40 dark:divide-white/40">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Author</dt>
              <dd className="mt-1 flex items-center text-sm leading-6 sm:col-span-2 sm:mt-0">
                <Link
                  className="flex items-center text-indigo-500 hover:text-indigo-400"
                  href={`/user/${announcementData?.userData?.profileUrl}`}
                  passHref
                >
                  <img
                    className="mr-4 h-12 w-12 flex-none rounded-full"
                    src={getAvatarImageUrl(
                      announcementData?.userData?.avatarId,
                    )}
                    alt=""
                    width={48}
                    height={48}
                  />
                  {announcementData?.userData?.displayName ||
                    "Unbekannter Benutzer"}
                </Link>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Title</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <strong>{announcementData?.title || "Unknown"}</strong>{" "}
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>{" "}
                {announcementData?.sideText || "Unknown"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Valid until</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {announcementData?.validUntil &&
                  new Date(announcementData?.validUntil).toLocaleDateString()}
                {new Date(announcementData?.validUntil) > new Date() ? (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                      Aktiv
                    </p>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-red-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    </div>
                    <p className="text-xs leading-5 text-black/80 dark:text-white/80">
                      Inaktiv
                    </p>
                  </div>
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">Description</dt>
              <dd className="mb-4 mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {announcementData?.description || "Unknown"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
