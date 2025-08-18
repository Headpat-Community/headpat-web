'use client'
import React, { useCallback, useMemo, memo } from 'react'
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

export const UserProvider = memo(function UserProvider(props: {
  children: React.ReactNode
}) {
  const [user, setUser] = React.useState<AccountPrefs | null>(null)
  const [userData, setUserData] = React.useState<UserDataDocumentsType | null>(
    null
  )
  const { saveCache } = useDataCache()

  // Memoized login function to prevent unnecessary re-renders
  const login = useCallback(async (email: string, password: string) => {
    try {
      await account.createEmailPasswordSession(email, password)
      const accountData: AccountPrefs = await account.get()
      setUser(accountData)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }, [])

  // Memoized OAuth login function to prevent unnecessary re-renders
  const loginOAuth = useCallback(async (userId: string, secret: string) => {
    try {
      await account.createSession(userId, secret)
      const accountData: AccountPrefs = await account.get()
      setUser(accountData)
    } catch (error) {
      console.error('OAuth login failed:', error)
      throw error
    }
  }, [])

  // Memoized logout function to prevent unnecessary re-renders
  const logout = useCallback(async (redirect: boolean) => {
    try {
      const response = await fetch(
        `/api/user/logoutUser?redirect=${redirect}`,
        {
          method: 'POST'
        }
      )

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`)
      }

      // Clear user state
      setUser(null)
      setUserData(null)

      // Parse response only if needed
      if (response.headers.get('content-type')?.includes('application/json')) {
        await response.json()
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error(error instanceof Error ? error.message : 'Logout failed')
      // Ensure user state is cleared even on error
      setUser(null)
      setUserData(null)
    }
  }, [])

  // Memoized register function to prevent unnecessary re-renders
  const register = useCallback(
    async (email: string, password: string, username: string) => {
      try {
        await account.create(ID.unique(), email, password, username)
        await login(email, password)
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },
    [login]
  )

  // Memoized init function to prevent unnecessary re-renders
  const init = useCallback(async () => {
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
    } catch (error: any) {
      // Handle different types of errors gracefully
      if (
        error?.code === 401 ||
        error?.message?.includes('missing scope (account)')
      ) {
        // User is not authenticated - this is expected behavior, not an error
        setUser(null)
        setUserData(null)
        return null
      } else if (error?.code === 404) {
        // User account not found in database - clear state
        console.warn('User account not found in database:', error)
        setUser(null)
        setUserData(null)
        return null
      } else {
        // Log unexpected errors but don't break the app
        console.error('User initialization failed:', error)
        setUser(null)
        setUserData(null)
        return null
      }
    }
  }, [])

  // Memoized user data fetching and caching to prevent unnecessary operations
  const fetchAndCacheUserData = useCallback(
    async (loggedIn: AccountPrefs) => {
      try {
        const userData: UserDataDocumentsType = await databases.getDocument(
          'hp_db',
          'userdata',
          loggedIn.$id
        )

        setUserData(userData)

        // Cache user data efficiently
        saveCache('users', loggedIn.$id, {
          ...userData,
          displayName: userData.displayName || userData.$id,
          avatarId: userData.avatarId || null
        })
      } catch (error: any) {
        // Handle different types of database errors gracefully
        if (error?.code === 404) {
          // User data not found in database - this might happen for new users
          console.warn(
            'User data not found in database for user:',
            loggedIn.$id
          )
          setUserData(null)
        } else if (error?.code === 401 || error?.code === 403) {
          // Permission denied - user might not have access
          console.warn('Permission denied accessing user data:', error)
          setUserData(null)
        } else {
          // Log unexpected errors but don't break the app
          console.error('Failed to fetch user data:', error)
          setUserData(null)
        }
        // Don't throw here to prevent breaking the initialization
      }
    },
    [saveCache]
  )

  // Memoized initialization effect to prevent unnecessary re-runs
  const initEffect = useCallback(async () => {
    try {
      const loggedIn = await init()
      if (loggedIn) {
        await fetchAndCacheUserData(loggedIn)
      }
    } catch (error) {
      // If initialization completely fails, ensure we're in a clean state
      console.error('User initialization effect failed:', error)
      setUser(null)
      setUserData(null)
    }
  }, [init, fetchAndCacheUserData])

  React.useEffect(() => {
    initEffect()
  }, [initEffect])

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      current: user,
      init,
      setUser,
      userData,
      setUserData,
      login,
      loginOAuth,
      logout,
      register
    }),
    [user, userData, init, login, loginOAuth, logout, register]
  )

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  )
})
