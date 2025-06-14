'use client'

import * as React from 'react'
import { Separator } from '@radix-ui/react-separator'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { SidebarProvider } from '../ui/sidebar'
import { ThemeToggle } from '../ThemeToggle'
import ChangeLanguage from '../system/changeLanguage'

// Create a context for header components
export const HeaderContext = React.createContext<{
  addHeaderComponent: (component: React.ReactNode) => void
  removeHeaderComponent: (component: React.ReactNode) => void
}>({
  addHeaderComponent: () => {},
  removeHeaderComponent: () => {}
})

// Create a provider component
function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerComponents, setHeaderComponents] = React.useState<
    React.ReactNode[]
  >([])

  const addHeaderComponent = React.useCallback((component: React.ReactNode) => {
    setHeaderComponents((prev) => [...prev, component])
  }, [])

  const removeHeaderComponent = React.useCallback(
    (component: React.ReactNode) => {
      setHeaderComponents((prev) => prev.filter((c) => c !== component))
    },
    []
  )

  return (
    <HeaderContext.Provider
      value={{ addHeaderComponent, removeHeaderComponent }}
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 -mr-4 p-4" />
            <Separator orientation="vertical" />
            <ChangeLanguage />
            <ThemeToggle />
          </div>
          {headerComponents.length > 0 && (
            <>
              <Separator orientation="vertical" />
              {headerComponents}
            </>
          )}
        </header>
        <div>{children}</div>
      </SidebarInset>
    </HeaderContext.Provider>
  )
}

interface HeaderClientProps {
  children: React.ReactNode
}

export default function HeaderClient({ children }: HeaderClientProps) {
  return (
    <SidebarProvider>
      <HeaderProvider>{children}</HeaderProvider>
    </SidebarProvider>
  )
}

// Create a hook to use the header context
export function useHeader() {
  const context = React.useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
