import Client from './page.client'
import { getLocale } from 'gt-next/server'

export const metadata = {
  title: 'Login',
  description: 'Login or Register to your account.',
  keywords: 'login, account, sign in, register',
}

export const runtime = 'edge'

export default async function LoginPage() {
  const locale = await getLocale()
  return (
    <>
      <Client locale={locale} />
    </>
  )
}
