import * as React from 'react'
import { Separator } from '@radix-ui/react-separator'
import { SidebarInset, SidebarTrigger } from '../ui/sidebar'
import { AppSidebar } from '../sidebar/app-sidebar'
import { SidebarProvider } from '../ui/sidebar'
import { ThemeToggle } from '../ThemeToggle'
import ChangeLanguage from '../system/changeLanguage'

export default function HeaderServer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 -mr-4" />
              <Separator orientation="vertical" />
              <ChangeLanguage />
              <ThemeToggle />
            </div>
          </header>
          <div>{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
