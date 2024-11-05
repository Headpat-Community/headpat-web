'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { Account } from '@/utils/types/models'
import { account } from '@/app/appwrite-client'
import { ID } from 'node-appwrite'

interface UserContextValue {
  current: Account.AccountPrefs | null
  setUser: React.Dispatch<React.SetStateAction<Account.AccountType | null>>
  login: (email: string, password: string) => Promise<void>
  loginOAuth: (userId: string, secret: string) => Promise<void>
  logout: () => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export function useUser(): UserContextValue {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export function UserProvider(props: any) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

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

  async function logout() {
    try {
      await account.deleteSession('current')
      setUser(null)
    } catch (error) {
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
    } catch (error) {
      setUser(null)
    }
  }

  useEffect(() => {
    init().then(() => {
      setFadeOut(true)
      setTimeout(() => setLoading(false), 1000)
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        current: user,
        setUser,
        login,
        loginOAuth,
        logout,
        register,
      }}
    >
      {loading && (
        <div
          className={`w-full h-screen absolute bg-background flex flex-col justify-center items-center ${fadeOut ? 'fade-out' : ''}`}
        >
          <svg
            version="1.1"
            id="L4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            width="100"
            height="100"
          >
            <circle fill="#fff" stroke="none" cx="15" cy="50" r="6">
              <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.1"
              />
            </circle>
            <circle fill="#fff" stroke="none" cx="50" cy="50" r="6">
              <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.2"
              />
            </circle>
            <circle fill="#fff" stroke="none" cx="85" cy="50" r="6">
              <animate
                attributeName="opacity"
                dur="1s"
                values="0;1;0"
                repeatCount="indefinite"
                begin="0.3"
              />
            </circle>
          </svg>
        </div>
      )}
      {fadeOut && props.children}
    </UserContext.Provider>
  )
}
