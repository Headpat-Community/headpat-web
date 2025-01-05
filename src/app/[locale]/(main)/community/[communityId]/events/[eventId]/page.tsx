import {
  CalendarDays,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Tag,
  CalendarClockIcon,
  CalendarCheck2Icon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCommunity } from '@/utils/server-api/communities/getCommunity'
import { notFound } from 'next/navigation'
import { getCommunityAvatarUrlView } from '@/components/getStorageItem'
import { getEvent } from '@/utils/server-api/events/getEvent'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import PageLayout from '@/components/pageLayout'
import sanitize from 'sanitize-html'
import { getUser } from '@/utils/server-api/account/user'

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

  const avatarUrl = getCommunityAvatarUrlView(community.avatarId)

  return {
    title: event?.title || 'Event',
    description: event?.description,
    icons: {
      icon: avatarUrl,
    },
    openGraph: {
      title: event?.title || 'Event',
      description: event?.description,
      images: avatarUrl,
    },
  }
}

// This would typically come from a database or API
const event = {
  id: '1',
  title: 'Tech Conference 2025',
  date: 'May 15-17, 2025',
  time: '9:00 AM - 6:00 PM',
  location: 'San Francisco Convention Center',
  description:
    'Join us for the biggest tech conference of the year. Featuring keynotes from industry leaders, hands-on workshops, and networking opportunities.',
  isPaid: true,
  price: 499,
  currency: 'USD',
  capacity: 5000,
  organizer: 'TechEvents Inc.',
  categories: ['Technology', 'Networking', 'Innovation'],
  image: '/placeholder.svg',
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

  const description = sanitize(event?.description)
  const descriptionSanitized = description.replace(/\n/g, '<br />')

  return (
    <PageLayout title={event?.title} className={'p-4'}>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="aspect-video mb-4">
            <img
              src={event.images[0]}
              alt={event.title}
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarClockIcon className="h-5 w-5 text-gray-500" />
              <span>
                {new Date(event.date).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarCheck2Icon className="h-5 w-5 text-gray-500" />
              <span>
                {new Date(event.dateUntil).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span>
                Capacity: {event.visitorCapacity || 'unlimited'} attendees
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{event.label}</Badge>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">About this event</h2>
            <div
              className="text-muted-foreground"
              dangerouslySetInnerHTML={{
                __html: descriptionSanitized,
              }}
            />
          </div>
        </div>
        <div>
          <Card className="bg-background shadow-lg rounded-lg p-6 sticky top-4">
            <CardTitle className="text-2xl font-semibold mb-4">
              Event Details
            </CardTitle>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Date and Time</h3>
                  <p>
                    {event.date}, {event.time}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p>{event.location}</p>
                </div>
                <div>
                  <h3 className="font-medium">Price</h3>
                  {event.isPaid ? (
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-500 mr-1" />
                      <span>
                        {event.price} {event.currency}
                      </span>
                    </div>
                  ) : (
                    <span>Free</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Organizer</h3>
                  <p>{event.organizer}</p>
                </div>
              </div>
              <Button className="w-full mt-6">Register Now</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}
