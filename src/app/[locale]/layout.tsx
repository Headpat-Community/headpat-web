import Header from '@/components/header/header-server'
import { getDict } from 'gt-next/server'

export async function generateMetadata({ params }) {
  const paramsResponse = await params
  const meta = await getDict('MainMetadata')

  return {
    title: {
      default: meta('title'),
      template: `%s - Headpat`,
    },
    description: meta('description'),
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
    ],
    icons: {
      icon: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
    },
    openGraph: {
      title: meta('title'),
      description: meta('description'),
      images: '/logos/Headpat_Logo_web_1024x1024_240518-02.png',
      locale: paramsResponse.locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function LocaleLayout({ children }) {
  const pageNames = await getDict('PageNames')

  return (
    <div>
      <Header
        home={pageNames('home')}
        chat={pageNames('chat')}
        gallery={pageNames('gallery')}
        events={pageNames('events')}
        map={pageNames('map')}
        announcements={pageNames('announcements')}
        notifications={pageNames('notifications')}
        users={pageNames('users')}
        myprofile={pageNames('myprofile')}
        legal={pageNames('legal')}
        changelog={pageNames('changelog')}
        communities={pageNames('communities')}
        account={pageNames('account')}
        login={pageNames('login')}
        logout={pageNames('logout')}
      >
        {children}
      </Header>
    </div>
  )
}
