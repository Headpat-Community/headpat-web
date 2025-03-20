'use client'
import React from 'react'
import { AccountPrefs, AccountType } from '@/utils/types/models'
import { account } from '@/app/appwrite-client'
import { ID } from 'node-appwrite'
import { SparklesCore } from '../ui/motion/sparkles'
import { toast } from 'sonner'
import { useTheme } from 'next-themes'

interface UserContextValue {
  current: AccountPrefs | null
  init: () => Promise<void>
  setUser: React.Dispatch<React.SetStateAction<AccountType | null>>
  login: (email: string, password: string) => Promise<void>
  loginOAuth: (userId: string, secret: string) => Promise<void>
  logout: (redirect: boolean) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
}

const UserContext = React.createContext<UserContextValue | undefined>(undefined)

export function useUser(): UserContextValue {
  const context = React.useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider(props: any) {
  const { systemTheme, theme } = useTheme()
  const [user, setUser] = React.useState(null)
  const [fadeOut, setFadeOut] = React.useState(false)
  const [visible, setVisible] = React.useState(true)
  const color =
    theme === 'system' ? systemTheme : theme === 'dark' ? 'dark' : 'light'
  const particleColor = color === 'dark' ? '#FFFFFF' : '#000000'

  async function login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password)
    const accountData = await account.get()
    setUser(accountData)
  }

  async function loginOAuth(userId: string, secret: string) {
    await account.createSession(userId, secret)
    const accountData = await account.get()
    setUser(accountData)
  }

  async function logout(redirect: boolean) {
    try {
      fetch(`/api/user/logoutUser?redirect=${redirect}`, {
        method: 'POST',
      })
        .then((response) => {
          if (!response.ok) {
            throw response
          }
          return response.json() // we only get here if there is no error
        })
        .then(async () => {
          setUser(null)
        })
        .catch((err) => {
          toast.error(err.toString())
        })
    } catch {
      setUser(null)
    }
  }

  async function register(email: string, password: string, username: string) {
    await account.create(ID.unique(), email, password, username)
    await login(email, password)
  }

  async function init() {
    try {
      const loggedIn = await account.get()
      setUser(loggedIn)
    } catch {
      setUser(null)
    }
  }

  React.useEffect(() => {
    init().then(() => {
      setTimeout(() => setFadeOut(true), 1000)
      setTimeout(() => setVisible(false), 2000) // Adjust the timeout duration to match the fade-out animation duration
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        current: user,
        init,
        setUser,
        login,
        loginOAuth,
        logout,
        register,
      }}
    >
      {visible && (
        <div
          className={`w-full h-screen absolute bg-background flex flex-col justify-center z-50 items-center ${fadeOut ? 'fade-out' : ''}`}
        >
          <div className="h-[40rem] w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
            <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center relative z-20">
              Headpat
            </h1>
            <div className="w-[40rem] h-40 relative">
              {/* Gradients */}
              <div className="absolute inset-x-20 top-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-xs" />
              <div className="absolute inset-x-20 top-0 bg-linear-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
              <div className="absolute inset-x-60 top-0 bg-linear-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-xs" />
              <div className="absolute inset-x-60 top-0 bg-linear-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

              {/* Core component */}
              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1}
                particleDensity={400}
                className="w-full h-full"
                particleColor={particleColor}
              />

              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-background [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>
          </div>
        </div>
      )}
      {fadeOut && props.children}
    </UserContext.Provider>
  )
}
