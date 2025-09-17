import PageClient from "./page.client"
import { Query } from "node-appwrite"
import { createSessionServerClient } from "@/app/appwrite-session"
import type { Metadata } from "next"
import type { GalleryType } from "@/utils/types/models"
import { notFound } from "next/navigation"

export async function generateMetadata(props: {
  params: Promise<{ locale: string; galleryId: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { locale, galleryId } = params

  const { databases } = await createSessionServerClient()

  const getImageUrl = (galleryId: string) => {
    return `https://api.headpat.place/v1/storage/buckets/gallery/files/${galleryId}/view?project=hp-main`
  }

  const gallery: GalleryType = await databases.listRows({
    databaseId: "hp_db",
    tableId: "gallery-images",
    queries: [Query.equal("$id", galleryId)],
  })

  if (gallery.rows.length === 0) {
    return notFound()
  }

  const isNsfw = gallery.rows[0]?.nsfw

  const metadata: Metadata = {
    title: gallery.rows[0]?.name,
    description: gallery.rows[0].longText,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery/${galleryId}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/gallery/${galleryId}`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/gallery/${galleryId}`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/gallery/${galleryId}`,
      },
    },
    openGraph: {
      title: gallery.rows[0].name,
      description: gallery.rows[0].longText,
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
  }

  if (!isNsfw) {
    metadata.openGraph!.images = [
      {
        url: getImageUrl(galleryId),
        alt: gallery.rows[0].name,
      },
    ]
  }

  return metadata
}

export default async function GalleryPage(props: {
  params: Promise<{ galleryId: string }>
}) {
  const params = await props.params

  const { galleryId } = params

  return <PageClient galleryId={galleryId} />
}
