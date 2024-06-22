'use client'
import { useState, useMemo } from 'react'
import { account, databases } from '@/app/appwrite-client'
import { Account, UserData } from '@/utils/types/models'

export const useGetUser = () => {
  const [userMe, setUserMe] = useState<Account.AccountPrefs | null>(null)
  const [userData, setUserData] =
    useState<UserData.UserDataDocumentsType | null>(null)

  useMemo(() => {
    const promise = account.get()

    promise.then(
      function (response) {
        setUserMe(response as Account.AccountPrefs) // Success
      },
      function (error) {
        console.log(error) // Failure
      }
    )
  }, [])

  useMemo(() => {
    if (userMe?.$id) {
      const promise = databases.getDocument('hp_db', 'userdata', userMe?.$id)

      promise.then(
        function (response) {
          const userData = response as UserData.UserDataDocumentsType
          setUserData(userData)
        },
        function (error) {
          console.log(error) // Failure
        }
      )
    }
  }, [userMe])

  return { userMe, setUserMe, userData, setUserData }
}
