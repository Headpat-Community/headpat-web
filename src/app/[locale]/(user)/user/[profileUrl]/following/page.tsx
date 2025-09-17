import { Query } from "@/app/appwrite-server"
import { createSessionServerClient } from "@/app/appwrite-session"
import { getAvatarImageUrlView } from "@/components/getStorageItem"
import { getUserDataFromProfileUrl } from "@/utils/server-api/user/getUserData"
import type { UserDataType } from "@/utils/types/models"
import type { Metadata } from "next"
import sanitizeHtml from "sanitize-html"
import ClientPage from "./page.client"

export async function generateMetadata(props: {
  params: Promise<{ profileUrl: string; locale: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { profileUrl, locale } = params

  const { databases } = await createSessionServerClient()
  const userDataResponse: UserDataType = await databases.listRows({
    databaseId: "hp_db",
    tableId: "userdata",
    queries: [Query.equal("profileUrl", profileUrl)],
  })
  const userData = userDataResponse.rows[0]
  const sanitizedBio = sanitizeHtml(userData?.bio || "")

  return {
    title: userData.displayName || userData?.profileUrl,
    description: sanitizedBio || "",
    icons: {
      icon: getAvatarImageUrlView(userData.avatarId || ""),
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/user/${profileUrl}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/user/${profileUrl}`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/user/${profileUrl}`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/user/${profileUrl}`,
      },
    },
    openGraph: {
      title: userData.displayName || userData?.profileUrl,
      description: sanitizedBio || "",
      images: getAvatarImageUrlView(userData.avatarId || ""),
      locale: locale,
      type: "profile",
    },
    robots: {
      index: false,
      follow: false,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
  }
}

export default async function FollowingPage(props: {
  params: Promise<{ locale: string; profileUrl: string }>
}) {
  const params = await props.params

  const { profileUrl } = params

  const userData = await getUserDataFromProfileUrl(profileUrl)

  return <ClientPage userData={userData} />
}
