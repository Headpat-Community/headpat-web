import PageClient from '@/app/[locale]/(main)/gallery/[galleryId]/page.client'
import { Query } from 'node-appwrite'
import { Gallery } from '@/utils/types/models'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Metadata } from 'next'

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params

  const { locale, galleryId } = params

  const { databases } = await createSessionServerClient()

  const getImageUrl = (galleryId: string) => {
    return `https://api.headpat.place/v1/storage/buckets/gallery/files/${galleryId}/view?project=hp-main`
  }

  const gallery: Gallery.GalleryType = await databases.listDocuments(
    'hp_db',
    'gallery-images',
    [Query.equal('$id', galleryId)]
  )

  const isNsfw = gallery.documents[0].nsfw

  const metadata: Metadata = {
    title: gallery.documents[0].name,
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

  if (!isNsfw) {
    metadata.openGraph.images = [
      {
        url: getImageUrl(galleryId),
        alt: gallery.documents[0].name,
      },
    ]
  }

  return metadata
}

export const runtime = 'edge'

export default async function GalleryPage(props) {
  const params = await props.params

  const { galleryId, locale } = params

  return <PageClient galleryId={galleryId} />
}
