import PageLayout from '@/components/pageLayout'
import ListComponent from '@/components/changelog/list'
import { getTranslations } from 'next-intl/server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Changelog } from '@/utils/types/models'
import { Query } from 'node-appwrite'

export const runtime = 'edge'

export async function generateMetadata({ params: { locale } }) {
  const meta = await getTranslations({
    locale,
    namespace: 'ChangelogMetadata',
  })

  return {
    title: {
      default: meta('title'),
      template: `%s - ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    },
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/changelog`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/changelog`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/changelog`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/changelog`,
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
  const { databases } = await createSessionServerClient()
  const changelogData: Changelog.ChangelogType = await databases.listDocuments(
    'hp_db',
    'changelog',
    [Query.orderDesc('version')]
  )
  return (
    <PageLayout title={'Changelog'}>
      <ListComponent changelogData={changelogData.documents} />
    </PageLayout>
  )
}
