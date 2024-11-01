import { Events } from '@/utils/types/models'
import { Link } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'

export default function EventsList({
  events,
}: {
  events: Events.EventsDocumentsType[]
}) {
  return (
    <div className={'space-y-4 mx-auto flex-row items-center max-w-4xl'}>
      {events.map((event) => (
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
              <span>{event.attendees}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
