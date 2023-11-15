"use client";
import { useEffect, useState } from "react";
import Loading from "@/app/loading";
import Link from "next/link";
import Image from "next/image";

export const runtime = "edge";

export default function AnnouncementInfo() {
  const [announcementData, setAnnouncementData] = useState(null);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const uniqueId = pathParts[2];

    fetch(`/api/announcements/getAnnouncement/${uniqueId}?populate=*`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setAnnouncementData(data.data);
        const createdById = data.data.attributes.users_permissions_user.data.id;
        return fetch(`/api/user/getUserData/${createdById}?populate=*`, {
          method: "GET",
        });
      })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
        setLoading(false); // Data fetching is done, set loading to false
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // In case of error, set loading to false
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div>
        <div className="px-4 sm:px-0">
          <h3 className="text-base font-semibold leading-7 text- justify-center text-center mt-4">
            Announcement Information
          </h3>
        </div>
        <div className="mt-6 max-w-4xl mx-auto">
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 mb-8">
            <Link
              href="."
              className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              &larr; Go back
            </Link>
          </dd>
          <dl className="divide-y dark:divide-white/40 divide-black/40">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Author
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 flex items-center">
                <Link
                  className="text-indigo-500 hover:text-indigo-400 flex items-center"
                  href={`/user/${userData?.data?.attributes?.users_permissions_user?.data?.attributes?.username}`}
                  passHref
                >
                  <Image
                    className="h-12 w-12 flex-none rounded-full dark:bg-gray-50 bg-gray-950 mr-4"
                    src={
                      userData?.data?.attributes?.avatar?.data?.attributes
                        ?.url || "/logos/logo-64.webp"
                    }
                    alt=""
                    width={48}
                    height={48}
                  />
                  {userData?.data?.attributes?.displayname ||
                    userData?.data?.attributes?.users_permissions_user?.data
                      ?.attributes?.username ||
                    "Unknown"}
                </Link>
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Title
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <strong>
                  {announcementData?.attributes?.title || "Unknown"}
                </strong>{" "}
                <svg
                  viewBox="0 0 2 2"
                  className="mx-2 inline h-0.5 w-0.5 fill-current"
                  aria-hidden="true"
                >
                  <circle cx={1} cy={1} r={1} />
                </svg>{" "}
                {announcementData?.attributes?.sidetext || "Unknown"}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Valid until
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                {announcementData?.attributes?.validuntil &&
                  new Date(
                    announcementData?.attributes?.validuntil
                  ).toLocaleDateString()}
                {new Date(announcementData?.attributes?.validuntil) >
                new Date() ? (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs leading-5 dark:text-white/80 text-black/80">Active</p>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-x-1.5">
                    <div className="flex-none rounded-full bg-red-500/20 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    </div>
                    <p className="text-xs leading-5 dark:text-white/80 text-black/80">Inactive</p>
                  </div>
                )}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm font-medium leading-6">
                Description
              </dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0 mb-4">
                {announcementData?.attributes?.description || "Unknown"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
