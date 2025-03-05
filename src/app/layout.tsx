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
import { getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

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
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
      apple: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: 'Headpat',
      description:
        'Headpat is an online social media community. We voluntarily offer our members a platform for connecting, exchanging and expressing.',
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
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
  const { databases } = await createSessionServerClient()
  const status = await databases
    .getDocument('config', 'status', 'website')
    .catch(() => ({ isMaintenance: true }))
  const messages = await getMessages()

  if (status.isMaintenance) {
    return (
      <html lang="en" className="h-full" suppressHydrationWarning>
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Maintenance />
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <UserProvider>
              <DataCacheProvider>
                <div className="w-full">{children}</div>
              </DataCacheProvider>
            </UserProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        <SonnerToaster />
      </body>
    </html>
  )
}
