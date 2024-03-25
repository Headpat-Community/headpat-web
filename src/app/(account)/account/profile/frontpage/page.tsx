import Client from './page.client'

export const metadata = {
  title: 'Account',
}

export const runtime = 'edge'

export default async function AccountPage() {
  return (
    <>
      <Client />
    </>
  )
}
