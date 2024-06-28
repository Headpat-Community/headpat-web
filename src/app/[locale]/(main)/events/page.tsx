import { Badge } from '@/components/ui/badge'
import { getEvents } from '@/utils/server-api/events/getEvents'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { Link } from '@/navigation'

export const runtime = 'edge'

export default async function Page() {
  const events = await getEvents()
  const eventsData = events.documents

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid gap-8 px-4 md:px-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Upcoming Events
          </h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Check out our upcoming events and mark your calendars.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {eventsData.map((event) => (
            <div key={event.$id} className="rounded-lg border p-4 shadow-sm">
              <div className="space-y-2">
                <div className={'flex justify-between'}>
                  <Link
                    href={{
                      pathname: '/community/[communityId]/events/[eventId]',
                      params: {
                        communityId: event.communityId,
                        eventId: event.$id,
                      },
                    }}
                  >
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                  </Link>
                  {event.label && (
                    <Badge className="flex-shrink-0 h-6 leading-6">
                      {event.label}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <ClockIcon className="h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' - '}
                    {new Date(event.dateUntil).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <MapPinIcon className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {event.locationZoneMethod === 'polygon' ||
                    event.locationZoneMethod === 'circle'
                      ? 'Physical'
                      : event.location}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <UsersIcon className="h-4 w-4 flex-shrink-0" />
                  <span>{event.attendees.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
