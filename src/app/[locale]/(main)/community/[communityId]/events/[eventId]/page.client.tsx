"use client"

import { databases, ExecutionMethod, functions } from "@/app/appwrite-client"
import React from "react"
import { toast } from "sonner"
import { getEventImageUrlView } from "@/components/getStorageItem"
import {
  CalendarCheck2Icon,
  CalendarClockIcon,
  FolderPenIcon,
  LinkIcon,
  MapPin,
  Tag,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import sanitize from "sanitize-html"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/components/contexts/UserContext"
import { useRouter } from "next/navigation"
import type {
  CommunityDocumentsType,
  EventsDocumentsType,
} from "@/utils/types/models"
import Link from "next/link"

export default function PageClient({
  eventData,
  communityData,
}: {
  eventData: EventsDocumentsType
  communityData: CommunityDocumentsType
}) {
  const [event, setEvent] = React.useState<EventsDocumentsType>(eventData)
  const { current } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    fetchEvents().then()
  }, [])

  const fetchEvents = async () => {
    try {
      const document: EventsDocumentsType = await databases.getRow({
        databaseId: "hp_db",
        tableId: "events",
        rowId: eventData.$id,
      })

      setEvent(document)

      const eventResponse = await functions.createExecution(
        "event-endpoints",
        "",
        false,
        `/event/attendees?eventId=${eventData.$id}`,
        ExecutionMethod.GET
      )
      const event = JSON.parse(eventResponse.responseBody)
      setEvent({
        ...document,
        attendees: event?.attendees,
        isAttending: event?.isAttending,
      })
    } catch {
      toast.error("Failed to fetch event data.")
    }
  }

  const attendEvent = async () => {
    try {
      const eventResponse = await functions.createExecution(
        "event-endpoints",
        "",
        false,
        `/event/attendee?eventId=${eventData.$id}`,
        ExecutionMethod.POST
      )
      const event = JSON.parse(eventResponse.responseBody)
      if (event.type === "event_attendee_add_success") {
        setEvent((prev) => ({
          ...prev,
          attendees: Array.isArray(prev.attendees)
            ? prev.attendees
            : prev.attendees + 1,
          isAttending: true,
        }))
      } else if (event.type === "event_ended") {
        toast.error("Event has ended.")
      } else {
        toast.error("Failed to attend event.")
      }
    } catch {
      toast.error("Failed to fetch event data.")
    }
  }

  const unattendEvent = async () => {
    try {
      const eventResponse = await functions.createExecution(
        "event-endpoints",
        "",
        false,
        `/event/attendee?eventId=${eventData.$id}`,
        ExecutionMethod.DELETE
      )
      const event = JSON.parse(eventResponse.responseBody)
      if (event.type === "event_attendee_remove_success") {
        setEvent((prev) => ({
          ...prev,
          attendees: Array.isArray(prev.attendees)
            ? prev.attendees
            : prev.attendees - 1,
          isAttending: false,
        }))
      } else if (event.type === "event_ended") {
        toast.error("Event has ended.")
      } else {
        toast.error("Failed to unattend event.")
      }
    } catch {
      toast.error("Failed to fetch event data.")
    }
  }

  const description = sanitize(event?.description)
  const descriptionSanitized = description.replace(/\n/g, "<br />")
  const isEventEnded = new Date(event.dateUntil) < new Date()

  return (
    <div className="grid gap-6 p-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FolderPenIcon className="h-5 w-5 text-gray-500" />
            <span>{event.title}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarClockIcon className="h-5 w-5 text-gray-500" />
            <span>
              {new Date(event.date).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarCheck2Icon className="h-5 w-5 text-gray-500" />
            <span>
              {new Date(event.dateUntil).toLocaleString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-500" />
            {event.visitorCapacity !== undefined &&
            event.attendees !== undefined ? (
              <span>
                Capacity: {event.visitorCapacity || "unlimited"} attendees (
                {event.attendees || 0} interested)
              </span>
            ) : (
              <Skeleton className={"h-6 w-48"} />
            )}
          </div>
          {event?.website && (
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-gray-500" />
              {event?.website && (
                <Link
                  href={event?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {event?.website || "No website provided"}
                </Link>
              )}
            </div>
          )}
          {event?.tags && event?.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              <Tag className="h-5 w-5 text-gray-500" />
              <div className="flex flex-wrap gap-2">
                {event?.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <h4 className="mb-2 text-2xl font-semibold">About this event</h4>
          <div
            className="text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: descriptionSanitized || "Nothing here yet!",
            }}
          />
        </div>
        {event.images && event.images.length > 0 && (
          <div className="mt-8 space-y-4">
            <h4 className="mb-2 text-2xl font-semibold">Event Images</h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {event.images.map((image, index) => {
                const imageUrl = image.match(
                  /^(https?:\/\/|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/
                )
                  ? image.startsWith("http")
                    ? image
                    : `https://${image}`
                  : getEventImageUrlView(image) || ""
                return (
                  <div key={index} className="aspect-video">
                    <Link href={imageUrl} target="_blank">
                      <img
                        src={imageUrl}
                        alt={`${event.title} - Image ${index + 1}`}
                        className="rounded-md object-contain"
                      />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
      <div>
        <Card className="bg-background sticky top-4 rounded-lg p-6 shadow-lg">
          <CardTitle className="mb-4 text-2xl font-semibold">
            Event Details
          </CardTitle>
          <CardContent>
            <div className="space-y-4">
              {event.isPaid && (
                <div>
                  <h3 className="font-medium">Price</h3>
                  {event.isPaid ? (
                    <div className="flex items-center">
                      <span>
                        {event.pricing.length > 1 ? "Starting at " : ""}
                        {event.pricing[0].split(";")[0]}€
                      </span>
                    </div>
                  ) : (
                    <span>Free</span>
                  )}
                </div>
              )}
              <div>
                <h3 className="font-medium">Organizer</h3>
                <p>{communityData?.name}</p>
              </div>
            </div>
            <Button
              className="mt-6 w-full"
              onClick={
                !current
                  ? () => router.push("/login")
                  : isEventEnded
                    ? undefined
                    : event.isAttending
                      ? unattendEvent
                      : attendEvent
              }
              disabled={isEventEnded}
            >
              {!current
                ? "Sign in to attend"
                : isEventEnded
                  ? "This event has ended"
                  : event.isAttending
                    ? "Unattend this event"
                    : event?.attendees === 0
                      ? "Be the first to attend!"
                      : "Attend this event!"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
