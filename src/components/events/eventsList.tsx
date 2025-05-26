import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import { EventsDocumentsType } from '@/utils/types/models'

export default function EventsList({
  events
}: {
  events: EventsDocumentsType[]
}) {
  return (
    <div className="grid gap-4 mx-auto sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <div key={event.$id} className="rounded-lg border p-4 shadow-xs">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Link
                href={`/community/${event.communityId}/events/${event.$id}`}
              >
                <h3 className="text-lg font-semibold">{event.title}</h3>
              </Link>
              {event.label && (
                <Badge className="shrink-0 h-6 leading-6">{event.label}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CalendarIcon className="size-4" />
              <span>
                {new Date(event.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <ClockIcon className="size-4" />
              <span>
                {new Date(event.date).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {' - '}
                {new Date(event.dateUntil).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MapPinIcon className="size-4 shrink-0" />
              <span>
                {event.locationZoneMethod === 'polygon' ||
                event.locationZoneMethod === 'circle'
                  ? 'Physical'
                  : event.location}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <UsersIcon className="size-4 shrink-0" />
              <span>{event.attendees}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
