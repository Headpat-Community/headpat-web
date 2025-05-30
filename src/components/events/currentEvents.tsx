'use client'
import { ExecutionMethod } from 'node-appwrite'
import { useEffect, useState } from 'react'
import { functions } from '@/app/appwrite-client'
import { toast } from 'sonner'
import EventsList from '@/components/events/eventsList'
import { EventsDocumentsType } from '@/utils/types/models'

export default function CurrentEvents() {
  const [events, setEvents] = useState<EventsDocumentsType[]>([])

  const fetchEvents = async () => {
    const loadingToast = toast.loading('Loading events...')
    try {
      const data = await functions.createExecution(
        'event-endpoints',
        '',
        false,
        '/events',
        ExecutionMethod.GET
      )
      const response: EventsDocumentsType[] = JSON.parse(data.responseBody)

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
