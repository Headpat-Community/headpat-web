import { AccessibilityIcon } from "lucide-react"
import Link from "next/link"

export async function generateMetadata() {
  return {
    title: "Page Not Found",
    description:
      "The page you're looking for doesn't exist, has been moved or you have no access to it.",
    openGraph: {
      title: "Page Not Found",
      type: "website",
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN!),
  }
}

export default function NotFoundComponent() {
  return (
    <div className="bg-background flex min-h-[100dvh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <AccessibilityIcon className="text-primary mx-auto h-12 w-12" />
        <h1 className="text-foreground mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Oops, access disabled!
        </h1>
        <p className="text-muted-foreground mt-4">
          The page you&apos;re looking for doesn&apos;t exist, has been moved or
          you have no access to it.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 focus:outline-hidden focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:ring-2 focus:ring-offset-2"
            prefetch={false}
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}
