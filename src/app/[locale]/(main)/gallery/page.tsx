import { Metadata } from 'next'
import PageClient from './page.client'

export async function generateMetadata(props): Promise<Metadata> {
  const params = await props.params
  const { locale } = params

  const metadata: Metadata = {
    title: 'Gallery',
    description: 'Browse and share images in the Headpat Gallery',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/gallery`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/gallery`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/gallery`,
      },
    },
    openGraph: {
      title: 'Gallery',
      description: 'Browse and share images in the Headpat Gallery',
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }

  return metadata
}

export default function GalleryPage() {
  return <PageClient enableNsfw={true} />
}
