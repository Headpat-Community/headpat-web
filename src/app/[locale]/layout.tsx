import Header from '@/components/header/header-server'
import { getTranslations } from 'next-intl/server'

export default async function LocaleLayout({ children, params: { locale } }) {
  const pageNames = await getTranslations({ locale, namespace: 'PageNames' })

  return (
    <div>
      <Header
        locale={locale}
        home={pageNames('home')}
        gallery={pageNames('gallery')}
        events={pageNames('events')}
        announcements={pageNames('announcements')}
        notifications={pageNames('notifications')}
        users={pageNames('users')}
        myprofile={pageNames('myprofile')}
        legal={pageNames('legal')}
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
