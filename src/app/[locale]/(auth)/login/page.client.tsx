'use client'
import { useEffect, useState } from 'react'
import {
  SiGithub,
  SiDiscord,
  SiApple,
  SiGoogle,
  SiSpotify,
  SiTwitch,
} from '@icons-pack/react-simple-icons'
import { Button } from '@/components/ui/button'
import {
  signInWithApple,
  signInWithDiscord,
  signInWithGithub,
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithSpotify,
  signInWithTwitch,
} from '@/utils/actions/oauth-actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { createUser } from '@/utils/actions/login-actions'
import { Link, useRouter } from '@/i18n/routing'
import { account, client } from '@/app/appwrite-client'
import PageLayout from '@/components/pageLayout'
import { toast } from 'sonner'

export default function Login({ locale }) {
  const [data, setData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAccount = async () => {
      const accountData = await account.get().catch((e) => {
        if (e.type === 'user_more_factors_required') router.push('/login/mfa')
      })
      if (accountData) {
        router.push('/account')
      }
    }

    checkAccount().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleEmailLogin = async (e: any) => {
    e.preventDefault()

    const signIn = async () => {
      const response = await fetch('/api/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      return response.json()
    }

    if (isRegistering) {
      const response = await createUser(data)

      const errorMessages = {
        400: 'Invalid E-Mail or password provided.',
        401: 'E-Mail or Password incorrect.',
        409: 'E-Mail already in use.',
        429: 'Too many requests, please try again later.',
      }

      if (errorMessages[response.code]) {
        toast.error(errorMessages[response.code])
        return
      }

      const dataResponse = await signIn()
      client.setSession(dataResponse.secret)
      await account.createVerification('https://headpat.place/i/verify-email')
      window.location.href = '/account'
    } else {
      const dataResponse = await signIn()

      const errorMessages = {
        user_invalid_credentials: 'E-Mail or Password incorrect.',
        user_blocked: 'User is blocked.',
      }

      if (errorMessages[dataResponse?.error?.response?.type]) {
        toast.error(errorMessages[dataResponse.error.response.type])
        return
      }

      client.setSession(dataResponse.secret)
      window.location.href = '/account'
    }
  }

  return (
    <PageLayout title={'Login'}>
      <div className="flex flex-1 justify-center items-center absolute inset-0">
        <div className="mx-auto mt-14 min-w-1/3 rounded-2xl p-8 dark:ring-white">
          <div className={'text-center'}>
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
              Welcome to Headpat!
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              {isRegistering ? 'Already registered?' : 'Not yet registered?'}{' '}
              <Link
                href="#"
                onClick={() => setIsRegistering(!isRegistering)}
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Click here!
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <div>
              <form
                action="#"
                method="POST"
                className="space-y-6"
                onSubmit={handleEmailLogin}
              >
                <div key="1" className="mx-auto max-w-4xl p-6 space-y-6">
                  <div className="space-y-4">
                    {isRegistering && (
                      <>
                        <div className="space-y-2">
                          <Label className="flex items-center" htmlFor="email">
                            Username
                            <span className="ml-1 text-red-500">*</span>
                          </Label>
                          <Input
                            id="username"
                            required
                            type="username"
                            onChange={(e) =>
                              setData({ ...data, username: e.target.value })
                            }
                          />
                        </div>
                      </>
                    )}
                    <div className="space-y-2">
                      <Label className="flex items-center" htmlFor="email">
                        Email
                        <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        placeholder="j@example.com"
                        required
                        type="email"
                        onChange={(e) =>
                          setData({ ...data, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center" htmlFor="password">
                        Password
                        <span className="ml-1 text-red-500">*</span>
                      </Label>
                      <Input
                        id="password"
                        required
                        type="password"
                        minLength={8}
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                      />
                    </div>
                    {isRegistering && (
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="terms"
                                required
                                onCheckedChange={() =>
                                  setAcceptedTerms(!acceptedTerms)
                                }
                              />
                              <Label className="leading-none" htmlFor="terms">
                                I agree to the{' '}
                                <Link className="underline" href="#">
                                  terms and conditions
                                </Link>
                                <span className="ml-1 text-red-500">*</span>
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <Button
                      disabled={isRegistering && !acceptedTerms}
                      className="w-full"
                    >
                      {isRegistering ? 'Register' : 'Login'}
                    </Button>
                    <Button variant={'link'} className={'w-full'}>
                      Forgot password?
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="rounded-xl bg-white px-6 text-gray-900">
                    Or continue with
                  </span>
                </div>
              </div>
              {/* OAuth Sign-In */}

              <div className="mt-6 grid grid-cols-2 gap-4">
                <form action={() => signInWithDiscord(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#5865F2] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] dark:border-white/20">
                    <SiDiscord className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Discord
                    </span>
                  </button>
                </form>

                <form action={() => signInWithGithub(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiGithub className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      GitHub
                    </span>
                  </button>
                </form>

                <form action={() => signInWithApple(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#000000] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiApple className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Apple
                    </span>
                  </button>
                </form>

                <form action={() => signInWithGoogle(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#131314] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiGoogle className={'h-4'} />

                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </button>
                </form>

                <form action={() => signInWithSpotify(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#1DB954] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiSpotify className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Spotify
                    </span>
                  </button>
                </form>

                <form action={() => signInWithMicrosoft(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#01A6F0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={'/logos/Microsoft_logo.svg.png'}
                      alt={'Microsoft'}
                      className={'h-5'}
                    />
                    <span className="text-sm font-semibold leading-6">
                      Microsoft
                    </span>
                  </button>
                </form>

                <form action={() => signInWithTwitch(locale)}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#6441A5] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiTwitch className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Twitch
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
