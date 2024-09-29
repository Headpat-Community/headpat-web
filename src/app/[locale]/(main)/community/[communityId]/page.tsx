import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import { getUser } from '@/utils/server-api/account/user'
import PageClient from './page.client'
import { notFound } from 'next/navigation'

export const runtime = 'edge'

export async function generateMetadata({
  params: { communityId },
}: {
  params: { communityId: string }
}) {
  const community = await getCommunity(communityId)

  if (!community.$id) {
    return notFound()
  }

  return {
    title: community?.name || 'Community',
    description: community?.description,
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: community?.name || 'Community',
      description: community?.description,
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
  }
}

export default async function Page({
  params: { communityId },
}: {
  params: { communityId: string }
}) {
  const community = await getCommunity(communityId)

  let userSelf = null
  try {
    userSelf = await getUser()
  } catch (error) {
    // Do nothing
  }

  return (
    <PageClient
      communityId={communityId}
      communityData={community}
      userSelf={userSelf}
    />
  )
}
