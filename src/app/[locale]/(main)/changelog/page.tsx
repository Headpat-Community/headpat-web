import PageLayout from '@/components/pageLayout'
import ListComponent from '@/components/changelog/list'
import { getDict } from 'gt-next/server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { Query } from 'node-appwrite'
import { ChangelogType } from '@/utils/types/models'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getDict('ChangelogMetadata')

  return {
    title: meta('title'),
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
  const changelogData: ChangelogType = await databases.listDocuments(
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
