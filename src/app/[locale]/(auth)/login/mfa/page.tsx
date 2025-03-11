import { Button } from '@/components/ui/button'
import Link from 'next/link'
import MfaPageClient from './page.client'

export const metadata = {
  title: 'Login',
  description: 'Login or Register to your account.',
  keywords: 'login, account, sign in, register',
}

export const runtime = 'edge'

export default async function Page() {
  return (
    <>
      <Link href={'/'} className={'absolute top-8 left-8 z-10'}>
        <Button>Home</Button>
      </Link>
      <MfaPageClient />
    </>
  )
}
