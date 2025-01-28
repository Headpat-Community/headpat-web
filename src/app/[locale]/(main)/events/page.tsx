import PageLayout from '@/components/pageLayout'
import { getTranslations } from 'next-intl/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CurrentEvents from '@/components/events/currentEvents'
import ArchivedEvents from '@/components/events/archivedEvents'
import UpcomingEvents from '@/components/events/upcomingEvents'
import FeatureAccess from '@/components/FeatureAccess'

export const runtime = 'edge'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations({ locale, namespace: 'EventsMetadata' })

  return {
    title: meta('title'),
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/events`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/events`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/events`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/events`,
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
    <PageLayout title={'Events'}>
      <FeatureAccess featureName={'events'}>
        <Tabs defaultValue="current" className="w-full">
          <div className="flex flex-col items-center justify-center">
            <TabsList className="grid w-full sm:max-w-4xl grid-cols-3">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="current">
            <CurrentEvents />
          </TabsContent>
          <TabsContent value="upcoming">
            <UpcomingEvents />
          </TabsContent>
          <TabsContent value="archived">
            <ArchivedEvents />
          </TabsContent>
        </Tabs>
      </FeatureAccess>
    </PageLayout>
  )
}
