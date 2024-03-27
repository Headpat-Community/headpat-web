'use client'
import { useState, useEffect } from 'react'
import { account, databases } from '@/app/appwrite'
import { UserAccountType, UserDataDocumentsType } from '@/utils/types'

export const useGetUser = () => {
  const [userMe, setUserMe] = useState<UserAccountType | null>(null)
  const [userData, setUserData] = useState<UserDataDocumentsType | null>(null)

  useEffect(() => {
    const promise = account.get()

    promise.then(
      function (response) {
        setUserMe(response as UserAccountType) // Success
      },
      function (error) {
        console.log(error) // Failure
      }
    )
  }, [])

  useEffect(() => {
    if (userMe?.$id) {
      const promise = databases.getDocument('hp_db', 'userdata', userMe?.$id)

      promise.then(
        function (response) {
          const userData = response as UserDataDocumentsType
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
