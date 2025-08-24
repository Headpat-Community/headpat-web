import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon } from "lucide-react"
import type { EventsDocumentsType } from "@/utils/types/models"

export default function EventsList({
  events,
}: {
  events: EventsDocumentsType[]
}) {
  return (
    <div className="mx-auto grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <div key={event.$id} className="shadow-xs rounded-lg border p-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Link
                href={`/community/${event.communityId}/events/${event.$id}`}
              >
                <h3 className="text-lg font-semibold">{event.title}</h3>
              </Link>
              {event.label && (
                <Badge className="h-6 shrink-0 leading-6">{event.label}</Badge>
              )}
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <CalendarIcon className="size-4" />
              <span>
                {new Date(event.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <ClockIcon className="size-4" />
              <span>
                {new Date(event.date).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(event.dateUntil).toLocaleTimeString(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <MapPinIcon className="size-4 shrink-0" />
              <span>
                {event.locationZoneMethod === "polygon" ||
                event.locationZoneMethod === "circle"
                  ? "Physical"
                  : event.location}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <UsersIcon className="size-4 shrink-0" />
              <span>{event.attendees}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
