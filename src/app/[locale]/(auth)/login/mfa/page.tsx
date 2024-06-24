import { Button } from '@/components/ui/button'
import { Link, redirect } from '@/navigation'
import MfaPageClient from '@/app/[locale]/(auth)/login/mfa/page.client'
import { mfaChallengeNeeded } from '@/utils/server-api/account/user'

export const metadata = {
  title: 'Login',
  description: 'Login or Register to your account.',
  keywords: 'login, account, sign in, register',
}

export const runtime = 'edge'

export default async function Page() {
  const mfaNeeded = await mfaChallengeNeeded()
  if (mfaNeeded.$id) {
    return redirect('/account')
  }

  return (
    <>
      <div className="lines">
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
      <Link href={'/'} className={'absolute top-8 left-8 z-10'}>
        <Button>Home</Button>
      </Link>
      <div className="flex flex-1 justify-center items-center absolute inset-0">
        {/* Add justify-center and items-center here */}
        <div className="mx-auto mt-14 min-w-1/3 rounded-2xl p-8 dark:bg-[#04050a]/85 dark:ring-white">
          <div className="mt-10">
            <div>
              <div className={'text-center'}>
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
                  Please fill in your 2FA code
                </h2>
              </div>
              <div key="1" className="mx-auto max-w-4xl p-6 space-y-6">
                <MfaPageClient />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
