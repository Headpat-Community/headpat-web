import Client from './page.client'

export const metadata = {
  title: 'Login',
  description: 'Login or Register to your account.',
  keywords: 'login, account, sign in, register',
}

export const runtime = 'edge'

export default async function LoginPage({ params }) {
  const paramsResponse = await params
  const locale = paramsResponse.locale
  return (
    <>
      <Client locale={locale} />
    </>
  )
}
