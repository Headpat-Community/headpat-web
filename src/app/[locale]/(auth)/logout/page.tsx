'use client'
import { useEffect, useState } from 'react'
import { useRouter } from '@/navigation'
import { useUser } from '@/components/contexts/UserContext'

export const runtime = 'edge'

export default function LogoutPage() {
  const [error, setError] = useState(null)
  const router = useRouter()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return null
}
