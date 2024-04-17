import Client from './page.client'
import { Suspense } from 'react'
import Loading from '@/app/loading'

export const metadata = {
  title: 'Account',
}

export const runtime = 'edge'

export default async function AccountPage() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </>
  )
}
