import Header from '@/components/header/header-server'
import { notFound, redirect } from 'next/navigation'
import { getUser } from '@/utils/server-api/account/user'
import { locales } from '@/navigation'

export default async function Layout({ children, params: { lang } }) {
  // Get locales from navigation.ts
  // Validate that the incoming `locale` parameter is valid
  const isValidLocale = locales.includes(lang)
  if (!isValidLocale) notFound()

  const accountData = await getUser()
  if (accountData.code === 401) redirect('/')

  return (
    <>
      <Header lang={lang}>{children}</Header>
    </>
  )
}
