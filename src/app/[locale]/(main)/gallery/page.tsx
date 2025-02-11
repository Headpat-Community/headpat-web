import Client from './page.client'
import { getUser } from '@/utils/server-api/account/user'
import PageLayout from '@/components/pageLayout'
import { Link } from '@/i18n/routing'
import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations({ locale, namespace: 'GalleryMetadata' })

  return {
    title: meta('title'),
    description: meta('description'),
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
  let enableNsfw = false
  try {
    const accountData = await getUser()
    enableNsfw = accountData?.prefs?.nsfw
  } catch (e) {
    // do nothing
  }

  return (
    <PageLayout title={'Gallery'} middleComponent={<UploadButton />}>
      <Client enableNsfw={enableNsfw || false} />
    </PageLayout>
  )
}
