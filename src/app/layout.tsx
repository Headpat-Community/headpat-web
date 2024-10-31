import '../../css/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/contexts/ThemeContext'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { UserProvider } from '@/components/contexts/UserContext'
import { Metadata } from 'next'
import { DataCacheProvider } from '@/components/contexts/DataCacheContext'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { createSessionServerClient } from './appwrite-session'
import Maintenance from '@/components/static/maintenance'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'Headpat',
      template: `%s - Headpat`,
    },
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
      title: 'Headpat Community',
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
      siteName: 'Headpat',
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
    },
    generator: 'Headpat',
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function RootLayout({ children }) {
  const { databases } = await createSessionServerClient()
  const status = await databases.getDocument('config', 'status', 'website')

  if (status.isMaintenance) {
    return (
      <html lang="en" className="h-full" suppressHydrationWarning>
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
          <UserProvider>
            <DataCacheProvider>
              <div className="w-full">{children}</div>
            </DataCacheProvider>
          </UserProvider>
        </ThemeProvider>
        <SonnerToaster
          toastOptions={{
            classNames: {
              error: [
                'border border-destructive text-destructive-foreground',
                'bg-gradient-to-r from-destructive via-black to-black',
              ].join(' '),
              success: [
                'border border-primary dark:text-foreground text-background',
                'bg-gradient-to-r from-primary via-black to-black',
              ].join(' '),
              loading: [
                'border dark:border-muted dark:text-foreground text-background',
                'bg-gradient-to-r from-muted via-black to-black',
              ].join(' '),
            },
          }}
          icons={{
            error: <AlertCircle className="size-4" />,
            success: <CheckCircle className="size-4" />,
            loading: <Loader2 className="size-4 animate-spin" />,
          }}
        />
      </body>
    </html>
  )
}
