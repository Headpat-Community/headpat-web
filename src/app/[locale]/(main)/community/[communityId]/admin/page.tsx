import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import { notFound } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageClient from './page.client'

export async function generateMetadata(props: {
  params: Promise<{ communityId: string }>
}) {
  const params = await props.params

  const { communityId } = params

  const community = await getCommunity(communityId)

  if (!community.$id) {
    return notFound()
  }

  return {
    title: community?.name || 'Community Admin',
    description: community?.description,
    icons: {
      icon: '/logos/hp_logo_x512.webp',
    },
    openGraph: {
      title: community?.name || 'Community Admin',
      description: community?.description,
      images: '/logos/hp_logo_x512.webp',
    },
  }
}

export default async function Page(props: {
  params: Promise<{ communityId: string }>
}) {
  const params = await props.params

  const { communityId } = params

  const community = await getCommunity(communityId)

  return (
    <Tabs defaultValue="general" className="w-full">
      <div className="flex flex-col items-center justify-center">
        <TabsList className="grid w-full sm:max-w-4xl grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      </div>
      <PageClient community={community} />
    </Tabs>
  )
}
