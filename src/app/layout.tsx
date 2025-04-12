import '../../css/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { UserProvider } from '@/components/contexts/UserContext'
import { Metadata } from 'next'
import { DataCacheProvider } from '@/components/contexts/DataCacheContext'
import { createSessionServerClient } from './appwrite-session'
import Maintenance from '@/components/static/maintenance'
import Script from 'next/script'
import { getLocale, GTProvider } from 'gt-next/server'
import { ReactScan } from '@/hooks/useReactScan'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'App',
    description:
      'Headpat is an online social media community. We voluntarily offer our members a platform for connecting, exchanging and expressing.',
    keywords: [
      'headpat',
      'community',
      'social',
      'network',
      'furry',
      'fandom',
      'headpawties',
      'gallery',
      'location sharing',
      'find friends',
      'fluffy',
      'social media platform',
      'online community',
      'furry social network',
    ],
    twitter: {
      card: 'summary_large_image',
      title: 'Headpat',
      description:
        'Headpat is an online social media community. We voluntarily offer our members a platform for connecting, exchanging and expressing.',
      images: '/logos/hp_logo_x512.webp',
    },
    icons: {
      icon: '/logos/hp_logo_x512.webp',
      apple: '/logos/hp_logo_x512.webp',
    },
    openGraph: {
      title: 'Headpat',
      description:
        'Headpat is an online social media community. We voluntarily offer our members a platform for connecting, exchanging and expressing.',
      images: '/logos/hp_logo_x512.webp',
      type: 'website',
    },
    appLinks: {
      android: {
        url: 'https://play.google.com/store/apps/details?id=com.headpat.app',
        package: 'com.headpat.app',
      },
      ios: {
        url: 'https://apps.apple.com/app/headpat/id6502715063',
        app_store_id: '6502715063',
      },
    },
    other: {
      'apple-itunes-app': 'app-id=6502715063',
      'google-play-app': 'app-id=com.headpat.app',
    },
    generator: 'Headpat',
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  const { databases } = await createSessionServerClient()
  const status = await databases
    .getDocument('config', 'status', 'website')
    .catch(() => ({ isMaintenance: true }))

  if (status.isMaintenance) {
    return (
      <html lang={locale} className="h-full" suppressHydrationWarning>
        <Script
          defer
          src={'https://analytics.fayevr.dev/script.js'}
          data-website-id="38b87c81-4112-43ce-ba99-b084bab611d6"
        />
        <body
          className={cn(
            'flex min-h-screen bg-background antialiased',
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
              <Maintenance />
            </ThemeProvider>
          </DataCacheProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <Script
        defer
        src={'https://analytics.fayevr.dev/script.js'}
        data-website-id="38b87c81-4112-43ce-ba99-b084bab611d6"
      />
      <ReactScan />
      <body
        className={cn(
          'flex min-h-screen bg-background antialiased',
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
                <div className="w-full">{children}</div>
              </UserProvider>
            </GTProvider>
          </ThemeProvider>
        </DataCacheProvider>
        <SonnerToaster />
      </body>
    </html>
  )
}
