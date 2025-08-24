"use client"
// react-scan must be imported before react
import { scan } from "react-scan"
import type { JSX } from "react"
import { useEffect } from "react"

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: process.env.NODE_ENV === "development",
    })
  }, [])

  return <></>
}
