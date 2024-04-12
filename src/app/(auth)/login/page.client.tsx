'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ErrorMessage } from '@/components/alerts'
import { account, ID } from '@/app/appwrite-client'
import {
  SiGithub,
  SiDiscord,
  SiApple,
  SiGoogle,
  SiSpotify,
  SiMicrosoft,
  SiTwitch,
} from '@icons-pack/react-simple-icons'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  signInWithApple,
  signInWithDiscord,
  signInWithGithub,
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithSpotify,
  signInWithTwitch,
} from '@/utils/actions/oauth-actions'
import { useToast } from '@/components/ui/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

export default function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
    username: '',
  })
  const [error, setError] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleEmailLogin = async (e: any) => {
    e.preventDefault()

    if (isRegistering) {
      const response = account.create(
        ID.unique(),
        data.email,
        data.password,
        data.username
      )

      response.then(
        function (response) {
          router.push('/account')
        },
        function (error) {
          if (error.code === 400) {
            toast({
              title: 'Error',
              description: 'Invalid E-Mail provided.',
              variant: 'destructive',
            })
          } else if (error.code === 401) {
            toast({
              title: 'Error',
              description: 'E-Mail or Password incorrect.',
              variant: 'destructive',
            })
          } else if (error.code === 409) {
            toast({
              title: 'Error',
              description: 'E-Mail already in use.',
              variant: 'destructive',
            })
          } else if (error.code === 429) {
            toast({
              title: 'Error',
              description: 'Too many requests, please try again later.',
              variant: 'destructive',
            })
          }
        }
      )
    } else {
      const response = await fetch('/api/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        console.log(data)
        if (data.error.type == 'user_invalid_credentials') {
          toast({
            title: 'Error',
            description: 'E-Mail or Password incorrect.',
            variant: 'destructive',
          })
        } else if (data.error.type == 'user_blocked') {
          toast({
            title: 'Error',
            description: 'User is blocked.',
            variant: 'destructive',
          })
        }
      }

      router.push('/account')
    }
  }

  return (
    <>
      {error && <ErrorMessage attentionError={error} />}
      <div className="lines">
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
      <Button className={'m-8 absolute z-10'} onClick={() => router.push('/')}>
        Home
      </Button>
      <div className="flex flex-1 justify-center items-center absolute inset-0">
        {/* Add justify-center and items-center here */}
        <div className="mx-auto mt-14 min-w-1/3 rounded-2xl p-8 dark:bg-[#04050a]/85 dark:ring-white">
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
                        onChange={(e) =>
                          setData({ ...data, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="terms"
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
                    <Button disabled={!acceptedTerms} className="w-full">
                      {isRegistering ? 'Register' : 'Login'}
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

              <div className="mt-6 grid grid-cols-2 gap-4">
                <form action={signInWithDiscord}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#5865F2] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] dark:border-white/20">
                    <SiDiscord className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Discord
                    </span>
                  </button>
                </form>

                <form action={signInWithGithub}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiGithub className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      GitHub
                    </span>
                  </button>
                </form>

                <form action={signInWithApple}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#000000] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiApple className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Apple
                    </span>
                  </button>
                </form>

                <form action={signInWithGoogle}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#131314] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiGoogle className={'h-4'} />

                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </button>
                </form>

                <form action={signInWithSpotify}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#1DB954] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiSpotify className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Spotify
                    </span>
                  </button>
                </form>

                <form action={signInWithMicrosoft}>
                  <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#01A6F0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
                    <SiMicrosoft className={'h-5'} />
                    <span className="text-sm font-semibold leading-6">
                      Microsoft
                    </span>
                  </button>
                </form>

                <form action={signInWithTwitch}>
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
    </>
  )
}
