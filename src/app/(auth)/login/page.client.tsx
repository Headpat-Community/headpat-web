'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ErrorMessage } from '@/components/alerts'
import { account } from '../../appwrite-client'
import { ID } from 'appwrite'
import {
  SiGithub,
  SiDiscord,
  SiApple,
  SiGoogle,
  SiSpotify,
  SiMicrosoft,
  SiTwitch,
} from '@icons-pack/react-simple-icons'

export default function Login() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleEmailLogin = async (e) => {
    e.preventDefault()

    try {
      let response
      if (isRegistering) {
        response = await account.create(ID.unique(), email, password, username)
      } else {
        response = await account.createEmailPasswordSession(email, password)
      }
      if (response) {
        window.location.href = '/account'
      }
    } catch (error) {
      if (error.code === 400) {
        setError('Invalid email provided.')
      } else if (error.code === 401) {
        setError('Email or password is incorrect.')
      } else if (error.code === 409) {
        setError('Email already in use.')
      } else if (error.code === 429) {
        setError('Too many requests. Please try again later.')
      }
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  const handleOAuth2Login = async (provider) => {
    account.createOAuth2Session(
      provider,
      `${process.env.NEXT_PUBLIC_DOMAIN}/account`,
      `${process.env.NEXT_PUBLIC_DOMAIN}/login?failure=true`
    )
  }

  useEffect(() => {
    //handleSession()
  }, [])

  return (
    <>
      {error && <ErrorMessage attentionError={error} />}
      <div className="lines">
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
      <div className="flex min-h-full flex-1">
        <div className="z-10 mx-auto mt-14 min-w-1/3 rounded-2xl p-8 ring-1 ring-black dark:bg-[#04050a]/85 dark:ring-white">
          <div>
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
              <form action="#" method="POST" className="space-y-6">
                {isRegistering && (
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6"
                    >
                      Username
                    </label>
                    <div className="mt-2">
                      <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:ring-gray-300 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:ring-gray-300 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:ring-gray-300 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm leading-6">
                    <Link
                      href="/forgot-password"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={handleEmailLogin}
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    {!isRegistering ? 'Sign in' : 'Register'}
                  </button>
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
                <button
                  onClick={() => handleOAuth2Login('discord')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#5865F2] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] dark:border-white/20"
                >
                  <SiDiscord className={'h-5'} />
                  <span className="text-sm font-semibold leading-6">
                    Discord
                  </span>
                </button>

                <button
                  onClick={() => handleOAuth2Login('github')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20"
                >
                  <SiGithub className={'h-5'} />
                  <span className="text-sm font-semibold leading-6">
                    GitHub
                  </span>
                </button>

                <button
                  onClick={() => handleOAuth2Login('apple')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#000000] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20"
                >
                  <SiApple className={'h-5'} />
                  <span className="text-sm font-semibold leading-6">Apple</span>
                </button>

                <button
                  onClick={() => handleOAuth2Login('google')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#131314] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20"
                >
                  <SiGoogle className={'h-4'} />

                  <span className="text-sm font-semibold leading-6">
                    Google
                  </span>
                </button>

                <button
                  onClick={() => handleOAuth2Login('spotify')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#1DB954] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20"
                >
                  <SiSpotify className={'h-5'} />
                  <span className="text-sm font-semibold leading-6">
                    Spotify
                  </span>
                </button>

                <button
                  onClick={() => handleOAuth2Login('microsoft')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#01A6F0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20"
                >
                  <SiMicrosoft className={'h-5'} />
                  <span className="text-sm font-semibold leading-6">
                    Microsoft
                  </span>
                </button>

                <button
                  onClick={() => handleOAuth2Login('twitch')}
                  className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#6441A5] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20"
                >
                  <SiTwitch className={'h-5'} />
                  <span className="text-sm font-semibold leading-6">
                    Twitch
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
