import Link from "next/link"
import { EyeOffIcon } from "lucide-react"

export default function NoAccessNsfw() {
  return (
    <div className="bg-background flex min-h-[90dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <EyeOffIcon className="text-primary mx-auto h-12 w-12" />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          This page is NSFW!
        </h1>
        <p className="text-muted-foreground mt-4">
          If you are under 18 or do not wish to view NSFW content, please leave
          this page. You can change your NSFW settings in your account settings.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-hidden focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
