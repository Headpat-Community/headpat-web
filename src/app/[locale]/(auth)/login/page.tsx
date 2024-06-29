import Client from './page.client'
import { createSessionServerClient } from '@/app/appwrite-session'
import { redirect } from '@/navigation'

export const metadata = {
  title: 'Login',
  description: 'Login or Register to your account.',
  keywords: 'login, account, sign in, register',
}

export const runtime = 'edge'

export default async function LoginPage() {
  const { account } = await createSessionServerClient()
  const accountData = await account.get().catch((e) => {
    if (e.type === 'user_more_factors_required') redirect('/login/mfa')
  })
  if (accountData) {
    redirect('/account')
  }

  return (
    <>
      <Client />
    </>
  )
}
