import '../../css/globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from './providers'

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
      icon: '/logos/Headpat_new_logo.webp',
    },
    openGraph: {
      title: 'Headpat Community',
      description: 'Social network for headpawties',
      siteName: 'Headpat',
      images: '/logos/Headpat_new_logo.webp',
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" className="h-full" suppressHydrationWarning>
      <body
        className={`${inter.className} flex min-h-full bg-white antialiased dark:bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="w-full">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}
