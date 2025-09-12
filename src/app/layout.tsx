import { DataCacheProvider } from "@/components/contexts/DataCacheContext"
import { UserProvider } from "@/components/contexts/UserContext"
import ErrorBoundary from "@/components/errorBoundary"
import { TanQueryClientProvider } from "@/components/init/tanstackQuery"
import Maintenance from "@/components/static/maintenance"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { ReactScan } from "@/hooks/useReactScan"
import { cn } from "@/lib/utils"
import { getLocale, GTProvider } from "gt-next/server"
import type { Metadata } from "next"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import Script from "next/script"
import "../../css/globals.css"
import { createSessionServerClient } from "./appwrite-session"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata(): Promise<Metadata> {
  return {
    appLinks: {
      android: {
        url: "https://play.google.com/store/apps/details?id=com.headpat.app",
        package: "com.headpat.app",
      },
      ios: {
        url: "https://apps.apple.com/app/headpat/id6502715063",
        app_store_id: "6502715063",
      },
    },
    other: {
      "apple-itunes-app": "app-id=6502715063",
      "google-play-app": "app-id=com.headpat.app",
    },
    generator: "Headpat",
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const { databases } = await createSessionServerClient()
  const status = await databases
    .getDocument("config", "status", "website")
    .catch(() => ({ isMaintenance: true }))

  if (status.isMaintenance) {
    return (
      <html lang={locale} className="h-full" suppressHydrationWarning>
        <Script
          defer
          src={"https://analytics.fayevr.dev/script.js"}
          data-website-id="38b87c81-4112-43ce-ba99-b084bab611d6"
        />
        <body
          className={cn(
            "bg-background flex min-h-screen antialiased",
            inter.className
          )}
        >
          <TanQueryClientProvider>
            <DataCacheProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ErrorBoundary>
                  <Maintenance />
                </ErrorBoundary>
              </ThemeProvider>
            </DataCacheProvider>
          </TanQueryClientProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <Script
        defer
        src={"https://analytics.fayevr.dev/script.js"}
        data-website-id="38b87c81-4112-43ce-ba99-b084bab611d6"
      />
      <TanQueryClientProvider>
        <ReactScan />
        <body
          className={cn(
            "bg-background flex min-h-screen antialiased",
            inter.className
          )}
        >
          <DataCacheProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <GTProvider>
                <UserProvider>
                  <ErrorBoundary>
                    <div className="w-full">{children}</div>
                  </ErrorBoundary>
                </UserProvider>
              </GTProvider>
            </ThemeProvider>
          </DataCacheProvider>
          <SonnerToaster />
        </body>
      </TanQueryClientProvider>
    </html>
  )
}
