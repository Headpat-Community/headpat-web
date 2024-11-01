'use client'
import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/routing'
import { useUser } from '@/components/contexts/UserContext'

export const runtime = 'edge'

export default function LogoutPage() {
  const [error, setError] = useState(null)
  const { setUser } = useUser()

  useEffect(() => {
    fetch(`/api/user/logoutUser`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw response
        }
        return response.json() // we only get here if there is no error
      })
      .then(() => {
        setUser(null)
        window.location.href = '/'
      })
      .catch((err) => {
        setError(err)
      })
  }, [setUser])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return null
}
