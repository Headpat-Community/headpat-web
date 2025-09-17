import HeaderClient from "@/components/sidebar/header-client"
import { getTranslations } from "gt-next/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const paramsResponse = await params
  const meta = await getTranslations("MainMetadata")

  return {
    title: {
      default: meta("title"),
      template: `%s - Headpat`,
    },
    description: meta("description"),
    keywords: [
      "headpat",
      "community",
      "social",
      "network",
      "furry",
      "fandom",
      "headpawties",
      "gallery",
      "location sharing",
    ],
    icons: {
      icon: "/logos/hp_logo_x512.webp",
    },
    openGraph: {
      title: meta("title"),
      description: meta("description"),
      images: "/logos/hp_logo_x512.webp",
      locale: paramsResponse.locale,
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
  }
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <HeaderClient>{children}</HeaderClient>
    </div>
  )
}
