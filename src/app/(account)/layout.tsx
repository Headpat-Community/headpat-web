import Header from '@/components/account/header-server'
import { createSessionServerClient } from '@/app/appwrite-session'
import { redirect } from 'next/navigation'

export default async function Layout({ children }) {
  try {
    const { account } = await createSessionServerClient()
    await account.get()
  } catch (error) {
    redirect('/login')
  }

  return (
    <>
      <Header>{children}</Header>
    </>
  )
}
