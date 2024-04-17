import Client from './page.client'
import { Suspense } from 'react'
import Loading from '../../../loading'
import { createSessionServerClient } from '@/app/appwrite-session'

export const metadata = {
  title: 'Account Settings',
}

export const runtime = 'edge'

export default async function AccountSettings() {
  const { account } = await createSessionServerClient()
  const mfaList = await account.listMfaFactors()
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Client mfaList={mfaList} />
      </Suspense>
    </>
  )
}
