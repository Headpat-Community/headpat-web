import Header from '@/components/header/header-server'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params: { locale } }) {
  const meta = await getTranslations({ locale, namespace: 'MainMetadata' })

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
      locale: locale,
      type: 'website',
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_DOMAIN),
  }
}

export default async function LocaleLayout({ children, params: { locale } }) {
  const pageNames = await getTranslations({ locale, namespace: 'PageNames' })

  return (
    <div>
      <Header
        locale={locale}
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
