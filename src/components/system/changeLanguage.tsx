"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import * as React from "react"
import { GlobeIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useMemo, useCallback, memo } from "react"

// Memoized language data to prevent recreation on every render
const LANGUAGES = [
  {
    name: "en",
    fullName: "English",
  },
  {
    name: "de",
    fullName: "Deutsch",
  },
  {
    name: "nl",
    fullName: "Nederlands",
  },
] as const

// Memoized known language codes to prevent recalculation
const KNOWN_LANGUAGE_CODES = LANGUAGES.map((language) => language.name)

/**
 * Fetches languages from the API and allows the user to change the language of the page.
 */
const ChangeLanguage = memo(function ChangeLanguage() {
  const router = useRouter()
  const pathname = usePathname()

  // Memoize path parts to prevent unnecessary string splitting
  const pathParts = useMemo(() => pathname.split("/"), [pathname])

  // Memoize language detection to prevent recalculation
  const currentLanguage = useMemo(() => {
    const isFirstPartLanguage = KNOWN_LANGUAGE_CODES.includes(
      pathParts[1] as any
    )
    return isFirstPartLanguage ? pathParts[1] : null
  }, [pathParts])

  // Memoize language change handler to prevent unnecessary re-renders
  const handleLanguageClick = useCallback(
    (lang: string) => {
      // Create new path parts array to avoid mutating the original
      const newPathParts = [...pathParts]

      if (currentLanguage) {
        // Replace the language code if it's present
        newPathParts[1] = lang
      } else {
        // Insert the language code if it's not present
        newPathParts.splice(1, 0, lang)
      }

      // Join the parts back into a new URL
      const newUrl = newPathParts.join("/")

      // Update the browser's URL and refresh the page
      router.push(newUrl)
      router.refresh()
    },
    [pathParts, currentLanguage, router]
  )

  // Memoize the dropdown menu items to prevent unnecessary re-renders
  const languageMenuItems = useMemo(
    () =>
      LANGUAGES.map((language) => (
        <DropdownMenuItem
          key={language.name}
          onClick={() => handleLanguageClick(language.name)}
        >
          {language.fullName}
        </DropdownMenuItem>
      )),
    [handleLanguageClick]
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={"ml-2"}>
          <GlobeIcon className="size-4" aria-description="Change language" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{languageMenuItems}</DropdownMenuContent>
    </DropdownMenu>
  )
})

export default ChangeLanguage
