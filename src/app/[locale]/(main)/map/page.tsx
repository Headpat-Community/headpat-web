import PageLayout from '@/components/pageLayout'
import PageClient from './page.client'
import { getDict } from 'gt-next/server'

export const runtime = 'edge'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getDict('LocationsMetadata')

  return {
    title: meta('title'),
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/map`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/map`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/map`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/map`,
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

export default async function Page() {
  return (
    <PageLayout title={'Map'}>
      <PageClient />
    </PageLayout>
  )
}
