'use client'
import React from 'react'
import { AccountPrefs, UserDataDocumentsType } from '@/utils/types/models'
import { account, databases } from '@/app/appwrite-client'
import { ID } from 'node-appwrite'
import { toast } from 'sonner'
import { useDataCache } from './DataCacheContext'

interface UserContextValue {
  current: AccountPrefs | null
  init: () => Promise<AccountPrefs | null>
  setUser: React.Dispatch<React.SetStateAction<AccountPrefs | null>>
  userData: UserDataDocumentsType | null
  setUserData: React.Dispatch<
    React.SetStateAction<UserDataDocumentsType | null>
  >
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
  const [user, setUser] = React.useState<AccountPrefs | null>(null)
  const [userData, setUserData] = React.useState<UserDataDocumentsType | null>(
    null
  )
  const { saveCache } = useDataCache()

  async function login(email: string, password: string) {
    await account.createEmailPasswordSession(email, password)
    const accountData: AccountPrefs = await account.get()
    setUser(accountData)
  }

  async function loginOAuth(userId: string, secret: string) {
    await account.createSession(userId, secret)
    const accountData: AccountPrefs = await account.get()
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
          setUserData(null)
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
      // Check if the user is logged in
      const loggedIn: AccountPrefs = await account.get()
      setUser(loggedIn)
      // Get the user data from the database
      const userData: UserDataDocumentsType = await databases.getDocument(
        'hp_db',
        'userdata',
        loggedIn.$id
      )
      setUserData(userData)
      return loggedIn
    } catch {
      setUser(null)
      return null
    }
  }

  React.useEffect(() => {
    init().then(async (loggedIn) => {
      if (loggedIn) {
        const userData: UserDataDocumentsType = await databases.getDocument(
          'hp_db',
          'userdata',
          loggedIn.$id
        )
        setUserData(userData)
        saveCache('users', loggedIn.$id, {
          ...userData,
          displayName: userData.displayName || userData.$id,
          avatarId: userData.avatarId || null,
        })
      }
    })
  }, [])

  return (
    <UserContext.Provider
      value={{
        current: user,
        init,
        setUser,
        userData,
        setUserData,
        login,
        loginOAuth,
        logout,
        register,
      }}
    >
      {props.children}
    </UserContext.Provider>
  )
}
