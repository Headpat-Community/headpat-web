import ListComponent from "@/components/changelog/list"
import { getTranslations } from "gt-next/server"
import { createSessionServerClient } from "@/app/appwrite-session"
import { Query } from "node-appwrite"
import type { ChangelogType } from "@/utils/types/models"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations("ChangelogMetadata")

  return {
    title: meta("title"),
    description: meta("description"),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/changelog`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/changelog`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/changelog`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/changelog`,
      },
    },
    openGraph: {
      title: meta("title"),
      description: meta("description"),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
  }
}

export default async function Page() {
  const { databases } = await createSessionServerClient()
  const changelogData: ChangelogType = await databases.listRows({
    databaseId: "hp_db",
    tableId: "changelog",
    queries: [Query.orderDesc("version")],
  })
  return <ListComponent changelogData={changelogData.rows} />
}
