import Header from '@/components/account/header-server'
import { getAccount } from '@/lib/server-calls'
import { redirect } from 'next/navigation'

export default async function Layout({ children }) {
  const userAccountData = await getAccount()

  if (userAccountData.type === 'general_unauthorized_scope') {
    redirect('/login')
  }

  return (
    <>
      <Header>{children}</Header>
    </>
  )
}
