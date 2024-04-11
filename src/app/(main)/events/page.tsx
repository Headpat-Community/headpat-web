import { databases } from '@/app/appwrite-server'
import type { Models } from 'appwrite'
import { Separator } from '@/components/ui/separator'

interface EventsType extends Models.Document {
  title: string
  date: string
  location: string
  description: string
}

export default async function Page() {
  const response = await databases.listDocuments('hp_db', 'events')
  const events = response.documents

  return (
    <div className={'mx-auto max-w-7xl'}>
      <div className="flex flex-col w-full gap-4">
        <div className="flex flex-col gap-1 text-center py-12">
          <h1 className="text-2xl font-bold">Upcoming Events</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here&apos;s a list of all the upcoming events.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden border">
          <div className="grid grid-cols-1 gap-4 p-4 md:p-6">
            {events.map((event: EventsType, index: number) => (
              <div key={event.$id}>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold">{event.title}</h2>
                  <time className="text-sm font-medium" dateTime={event.date}>
                    {new Date(event.date).toLocaleString('en-GB', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </time>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {event.location}
                  </p>
                  <p className="text-sm leading-6">{event.description}</p>
                </div>
                {index < events.length - 1 && (
                  <Separator className={'my-2 mt-5'} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
