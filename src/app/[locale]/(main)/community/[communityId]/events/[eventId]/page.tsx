import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import { notFound } from 'next/navigation'
import {
  getCommunityAvatarUrlView,
  getEventImageUrlView
} from '@/components/getStorageItem'
import { getEvent } from '@/utils/server-api/events/getEvent'
import { getUser } from '@/utils/server-api/account/user'
import PageClient from './page.client'
import { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ communityId: string; eventId: string }>
}): Promise<Metadata> {
  const params = await props.params

  const { communityId, eventId } = params

  const community = await getCommunity(communityId)

  const event = await getEvent(eventId)

  if (!community.$id) {
    return notFound()
  }

  let imageUrl = null
  if (event?.images && event?.images.length > 0) {
    imageUrl = event?.images[0].match(
      /^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/
    )
      ? event?.images[0].startsWith('http')
        ? event?.images[0]
        : `https://${event?.images[0]}`
      : getEventImageUrlView(event?.images[0])
  }

  const avatarUrl = getCommunityAvatarUrlView(community?.avatarId)

  return {
    title: event?.title || 'Event',
    description: event?.description,
    icons: {
      icon: imageUrl || avatarUrl
    },
    openGraph: {
      title: event?.title || 'Event',
      description: event?.description,
      images: imageUrl || avatarUrl
    },
    twitter: {
      card: 'summary_large_image',
      title: event?.title || 'Event',
      description: event?.description,
      images: imageUrl || avatarUrl
    }
  }
}

export default async function EventPage(props: any) {
  const params = await props.params
  const { communityId, eventId } = params

  const user = await getUser()
  const community = await getCommunity(communityId)

  if (!community?.communitySettings?.hasPublicPage && !user?.prefs?.nsfw) {
    return notFound()
  }

  const event = await getEvent(eventId)
  if (!event.$id) {
    return notFound()
  }

  return <PageClient eventData={event} communityData={community} />
}
