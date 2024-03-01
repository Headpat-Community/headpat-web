'use client'
import { account } from '../../../appwrite'
import { useEffect } from 'react'

export default function OAuthPage () {
  useEffect(() => {
    const CreateSession = async() => {
      const urlParams = new URLSearchParams(window.location.search)
      const secret = urlParams.get('secret')
      const userId = urlParams.get('userId')

      await account.createSession(userId, secret)
    }

    CreateSession()
  }, [])

  return (
    <div>
      <h1>OAuth</h1>
    </div>
  )
}