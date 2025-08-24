"use client"
import { useEffect } from "react"

/**
 * This is needed, because the website is faster than it's setting the cookie...
 * @since 0.8.1
 */
export default function LoadingPage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/account"
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Please wait...</h1>
      <p className="text-muted-foreground text-base">
        Cookies are not fast enough!
      </p>
    </div>
  )
}
