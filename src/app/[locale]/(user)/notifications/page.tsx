import { getTranslations } from 'gt-next/server'
import PageClient from './page.client'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations('NotificationsMetadata')

  return {
    title: meta('title'),
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/notifications`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/notifications`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/notifications`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/notifications`
      }
    },
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
      locale: locale,
      type: 'website'
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN)
  }
}

export default async function Page() {
  return <PageClient />
}
