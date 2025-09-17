"use client"
import { useUser } from "@/components/contexts/UserContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function LogoutPage() {
  const [error, setError] = useState<any>(null)
  const { current, logout } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") !== "false"

  useEffect(() => {
    if (!current) {
      if (redirect) {
        router.push("/")
      }
      return
    }
    logout(redirect)
      .then(() => {
        if (redirect) {
          router.push("/")
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
