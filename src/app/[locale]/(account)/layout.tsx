import Header from '@/components/header/header-server'
import { getUser } from '@/utils/server-api/account/user'
import { redirect } from '@/navigation'

export default async function Layout({ children, params: { locale } }) {
  const accountData = await getUser()
  if (accountData.code === 401) redirect('/')

  return (
    <>
      <Header locale={locale}>{children}</Header>
    </>
  )
}
