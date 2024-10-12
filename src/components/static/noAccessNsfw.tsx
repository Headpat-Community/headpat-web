import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EyeOffIcon } from 'lucide-react'

export default function NoAccessNsfw() {
  return (
    <div className="flex min-h-[90dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <EyeOffIcon className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          This page is NSFW!
        </h1>
        <p className="mt-4 text-muted-foreground">
          If you are under 18 or do not wish to view NSFW content, please leave
          this page. You can change your NSFW settings in your account settings.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
