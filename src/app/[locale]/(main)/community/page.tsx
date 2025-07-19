import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getTranslations } from 'gt-next/server'
import AllCommunities from '@/components/community/allCommunities'
import MyCommunities from '@/components/community/myCommunities'

export async function generateMetadata(props) {
  const params = await props.params

  const { locale } = params

  const meta = await getTranslations('CommunitiesMetadata')

  return {
    title: meta('title'),
    description: meta('description'),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_DOMAIN}/community`,
      languages: {
        en: `${process.env.NEXT_PUBLIC_DOMAIN}/en/community`,
        de: `${process.env.NEXT_PUBLIC_DOMAIN}/de/community`,
        nl: `${process.env.NEXT_PUBLIC_DOMAIN}/nl/community`
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
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="flex flex-col items-center justify-center">
        <TabsList className="grid w-full sm:max-w-4xl grid-cols-2">
          <TabsTrigger value="all">All communities</TabsTrigger>
          <TabsTrigger value="my">My communities</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="all">
        <AllCommunities />
      </TabsContent>
      <TabsContent value="my">
        <MyCommunities />
      </TabsContent>
    </Tabs>
  )
}
