import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { getCommunityAvatarUrlView } from '@/components/getStorageItem'

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

  let avatarUrl = '/logos/Headpat_Logo_web_1024x1024_240518-02.png'
  if (community.avatarId) {
    avatarUrl = getCommunityAvatarUrlView(community.avatarId)
  }

  return {
    title: community?.name || 'Community',
    description: community?.description,
    icons: {
      icon: avatarUrl,
    },
    openGraph: {
      title: community?.name || 'Community',
      description: community?.description,
      images: avatarUrl,
    },
  }
}

export default async function Page({
  params: { communityId },
}: {
  params: { communityId: string }
}) {
  const community = await getCommunity(communityId)

  return <PageClient communityId={communityId} communityData={community} />
}
