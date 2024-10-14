'use client'
import { useEffect } from 'react'
import Loading from '@/app/loading'

export default function LoadingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = '/account'
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return <Loading />
}
