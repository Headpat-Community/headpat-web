import '../../css/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import { UserProvider } from '@/components/contexts/UserContext'
import { Metadata } from 'next'
import { DataCacheProvider } from '@/components/contexts/DataCacheContext'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: 'Headpat Community',
      template: `%s - Headpat`,
    },
    description:
      'The Headpat Community is an online social media community. We voluntarily offer our members a platform for connecting, exchanging and expressing.',
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
      'friends',
      'fluffy',
    ],
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
      apple: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: 'Headpat Community',
      description:
        'The Headpat Community is an online social media community. We voluntarily offer our members a platform for connecting, exchanging and expressing.',
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
    },
    generator: 'Headpat',
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default function RootLayout({ children }) {
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
              error:
                'border border-destructive bg-gradient-to-r from-destructive/50 via-destructive/10 to-destructive/0 text-destructive-foreground',
              success:
                'border border-primary bg-gradient-to-r from-primary/50 via-primary/10 to-primary/0 dark:text-foreground text-background',
              loading:
                'border dark:border-muted bg-gradient-to-r dark:from-muted from-muted-foreground dark:via-muted/10 via-secondary/10 to-secondary/0 dark:text-foreground text-background',
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
