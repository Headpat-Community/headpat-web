import Client from './page.client'
import { Suspense } from 'react'
import Loading from '../../../loading'

export const metadata = {
  title: 'Account Settings',
}

export const runtime = 'edge'

export default async function AccountSettings() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Client />
      </Suspense>
    </>
  )
}
