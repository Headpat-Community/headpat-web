import PageClient from './page.client'
import { getTranslations } from 'next-intl/server'

export const runtime = 'edge'

export async function generateMetadata({ params: { locale } }) {
  const meta = await getTranslations({ locale, namespace: 'UsersMetadata' })

  return {
    title: {
      default: meta('title'),
      template: `%s - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    },
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/users`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/users`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/users`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/users`,
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

export default async function Users({
  params: { locale },
}: {
  params: { locale: string }
}) {
  return <PageClient />
}
