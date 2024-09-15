import PageClient from '@/app/[locale]/(main)/gallery/[galleryId]/page.client'
import { Query } from 'node-appwrite'
import { Gallery } from '@/utils/types/models'
import { createSessionServerClient } from '@/app/appwrite-session'

export async function generateMetadata({ params: { locale, galleryId } }) {
  const { databases } = await createSessionServerClient()

  const gallery: Gallery.GalleryType = await databases.listDocuments(
    'hp_db',
    'gallery-images',
    [Query.equal('$id', galleryId)]
  )

  return {
    title: {
      default: gallery.documents[0].name,
      template: `%s - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    },
    description: gallery.documents[0].longText,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery/${galleryId}`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/gallery/${galleryId}`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/gallery/${galleryId}`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/gallery/${galleryId}`,
      },
    },
    openGraph: {
      title: gallery.documents[0].name,
      description: gallery.documents[0].longText,
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export const runtime = 'edge'

export default async function GalleryPage({ params: { galleryId, locale } }) {
  return <PageClient galleryId={galleryId} />
}
