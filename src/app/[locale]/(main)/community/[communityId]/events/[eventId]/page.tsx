import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import { notFound } from 'next/navigation'
import {
  getCommunityAvatarUrlView,
  getEventImageUrlView,
} from '@/components/getStorageItem'
import { getEvent } from '@/utils/server-api/events/getEvent'
import { getUser } from '@/utils/server-api/account/user'
import PageClient from './page.client'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export async function generateMetadata(props: {
  params: Promise<{ communityId: string; eventId: string }>
}) {
  const params = await props.params

  const { communityId, eventId } = params

  const community = await getCommunity(communityId)

  const event = await getEvent(eventId)

  if (!community.$id) {
    return notFound()
  }

  const eventImageUrl = getEventImageUrlView(event?.images[0])
  const avatarUrl = getCommunityAvatarUrlView(community?.avatarId)

  return {
    title: event?.title || 'Event',
    description: event?.description,
    icons: {
      icon: eventImageUrl || avatarUrl,
    },
    openGraph: {
      title: event?.title || 'Event',
      description: event?.description,
      images: eventImageUrl || avatarUrl,
    },
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
