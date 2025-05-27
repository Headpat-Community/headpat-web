import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { getCommunityAvatarUrlView } from '@/components/getStorageItem'

export async function generateMetadata(props: {
  params: Promise<{ communityId: string }>
}) {
  const params = await props.params

  const { communityId } = params

  const community = await getCommunity(communityId)

  if (!community.$id) {
    return notFound()
  }

  let avatarUrl = '/logos/hp_logo_x512.webp'
  if (community.avatarId) {
    avatarUrl = getCommunityAvatarUrlView(community.avatarId)
  }

  return {
    title: community?.name || 'Community',
    description: community?.description,
    icons: {
      icon: avatarUrl
    },
    openGraph: {
      title: community?.name || 'Community',
      description: community?.description,
      images: avatarUrl
    }
  }
}

export default async function Page(props: {
  params: Promise<{ communityId: string }>
}) {
  const params = await props.params

  const { communityId } = params

  const community = await getCommunity(communityId)

  return <PageClient communityId={communityId} communityData={community} />
}
