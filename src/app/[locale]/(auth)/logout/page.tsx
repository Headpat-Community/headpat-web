'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/components/contexts/UserContext'
import { useRouter } from '@/i18n/routing'

export const runtime = 'edge'

export default function LogoutPage() {
  const [error, setError] = useState(null)
  const { current, logout } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!current) {
      router.push('/')
      return
    }
    logout()
      .then(() => {
        router.push('/')
      })
      .catch((error) => {
        setError(error)
      })
  }, [current, logout, router])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return null
}
