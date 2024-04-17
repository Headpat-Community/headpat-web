import type { Models } from 'luke-node-appwrite-edge'
import { Separator } from '@/components/ui/separator'
import { createAdminClient } from '@/app/appwrite-session'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface EventsType extends Models.Document {
  title: string
  date: string
  location: string
  description: string
}

export const runtime = 'edge'

export default async function Page() {
  const { databases } = await createAdminClient()

  const result = await databases.listDocuments('hp_db', 'events')
  const events = result.documents

  return (
    <div className="mb-8 mt-16 px-4 sm:px-6 lg:px-8">
      <div className="sm:grid grid-cols-3 sm:items-center justify-center mb-8 mt-8 mx-auto max-w-7xl gap-8 text-center">
        {events.map((event: EventsType, index: number) => (
          <Card key={event.$id} className="w-[350px]">
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
              <CardDescription>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.location}
                </p>
                <time className="text-sm font-medium" dateTime={event.date}>
                  {new Date(event.date).toLocaleString('en-GB', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
