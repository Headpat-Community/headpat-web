'use client'
import { ExecutionMethod } from 'node-appwrite'
import { useEffect, useState } from 'react'
import { functions } from '@/app/appwrite-client'
import { toast } from 'sonner'
import { Events } from '@/utils/types/models'
import EventsList from '@/components/events/eventsList'

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Events.EventsDocumentsType[]>([])

  const fetchEvents = async () => {
    const loadingToast = toast.loading('Loading events...')
    try {
      const data = await functions.createExecution(
        'event-endpoints',
        '',
        false,
        '/events/upcoming',
        ExecutionMethod.GET
      )
      const response: Events.EventsDocumentsType[] = JSON.parse(
        data.responseBody
      )

      setEvents(response)
    } catch {
      toast.error('Failed to fetch events. Please try again later.')
    } finally {
      toast.dismiss(loadingToast)
    }
  }

  useEffect(() => {
    fetchEvents().then()
  }, [])

  if (events?.length === 0 || !events)
    return (
      <div className={'flex-1 justify-center items-center'}>
        <div className={'p-4 native:pb-24 max-w-md gap-6'}>
          <div className={'gap-1'}>
            <span className={'text-base text-center text-muted-foreground'}>
              No events available
            </span>
          </div>
        </div>
      </div>
    )

  return <EventsList events={events} />
}
