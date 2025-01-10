'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@/components/contexts/UserContext'
import { useRouter } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'

export const runtime = 'edge'

export default function LogoutPage() {
  const [error, setError] = useState(null)
  const { current, logout } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') !== 'false'

  useEffect(() => {
    if (!current) {
      if (redirect) {
        router.push('/')
      }
      return
    }
    logout(redirect)
      .then(() => {
        if (redirect) {
          router.push('/')
        }
      })
      .catch((error) => {
        setError(error)
      })
  }, [current, logout, router, redirect])

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return null
}
