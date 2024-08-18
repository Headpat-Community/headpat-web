import Client from './page.client'
import { getUser } from '@/utils/server-api/account/user'
import PageLayout from '@/components/pageLayout'
import { Link } from '@/navigation'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const meta = await getTranslations({ locale, namespace: 'GalleryMetadata' })

  return {
    title: {
      default: meta('title'),
      template: `%s - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    },
    description: meta('description'),
    keywords: [
      'headpat',
      'community',
      'social',
      'network',
      'gallery',
      'images',
      'furry',
    ],
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/gallery`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/gallery`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/gallery`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/gallery`,
      },
    },
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export const runtime = 'edge'

function UploadButton() {
  return (
    <Link href={'/gallery/upload'}>
      <Button>Upload</Button>
    </Link>
  )
}

export default async function Gallery() {
  const accountData = await getUser()
  const enableNsfw = accountData?.prefs?.nsfw

  return (
    <PageLayout title={'Gallery'} middleComponent={<UploadButton />}>
      <Client enableNsfw={enableNsfw || false} />
    </PageLayout>
  )
}
