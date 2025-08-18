import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { getCommunityAvatarUrlView } from '@/components/getStorageItem'

// Constants to prevent recreation
const DEFAULT_AVATAR = '/logos/hp_logo_x512.webp'
const DEFAULT_TITLE = 'Community not found'

export async function generateMetadata(props: {
  params: Promise<{ communityId: string }>
}) {
  try {
    const params = await props.params
    const { communityId } = params

    const community = await getCommunity(communityId)

    if (!community?.$id) {
      return notFound()
    }

    // Memoized avatar URL to prevent recalculation
    const avatarUrl = community.avatarId
      ? getCommunityAvatarUrlView(community.avatarId)
      : DEFAULT_AVATAR

    const title = community?.name || DEFAULT_TITLE
    const description = community?.description

    return {
      title,
      description,
      icons: {
        icon: avatarUrl
      },
      openGraph: {
        title,
        description,
        images: avatarUrl
      }
    }
  } catch (error) {
    console.error('Failed to generate metadata for community:', error)
    return {
      title: DEFAULT_TITLE,
      description: 'Community not found',
      icons: {
        icon: DEFAULT_AVATAR
      },
      openGraph: {
        title: DEFAULT_TITLE,
        description: 'Community not found',
        images: DEFAULT_AVATAR
      }
    }
  }
}

export default async function Page(props: {
  params: Promise<{ communityId: string }>
}) {
  try {
    const params = await props.params
    const { communityId } = params

    const community = await getCommunity(communityId)

    if (!community?.$id) {
      return notFound()
    }

    return <PageClient communityId={communityId} communityData={community} />
  } catch (error) {
    console.error('Failed to load community page:', error)
    return notFound()
  }
}
