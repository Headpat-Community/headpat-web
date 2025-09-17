import PageClient from "./page.client"
import { getTranslations } from "gt-next/server"

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>
}) {
  const paramsResponse = await props.params
  const { locale } = paramsResponse
  const meta = await getTranslations("UsersMetadata")

  return {
    title: meta("title"),
    description: meta("description"),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/users`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/users`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/users`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/users`,
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

export default async function Users() {
  return <PageClient />
}
