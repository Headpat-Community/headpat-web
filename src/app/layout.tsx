import '../../css/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'
import ContextMenuProvider from '@/components/system/contextMenu'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata() {
  return {
    title: {
      default: 'Headpat Community',
      template: `%s - Headpat`,
    },
    description: 'Social network for headpawties',
    keywords: ['headpat', 'community', 'social', 'network'],
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: 'Headpat Community',
      description: 'Social network for headpawties',
      siteName: 'Headpat',
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
      type: 'website',
    },
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
          <div className="w-full">{children}</div>
        </ThemeProvider>
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  )
}
