'use client'

import { cn } from '@/lib/utils'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Nav } from '@/components/header/header-nav'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Nav1, Nav2, Nav3, NavFooter } from '@/components/header/data'
import React, { useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronUpIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Account, UserData } from '@/utils/types/models'
import { useRouter } from '@/navigation'

export default function SidebarResizable({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  accountData,
  userData,
  userImage,
  translations,
  children,
}: {
  defaultLayout: number[]
  defaultCollapsed: boolean
  navCollapsedSize: number
  accountData: Account.AccountPrefs
  userData: UserData.UserDataDocumentsType
  userImage: string
  translations: any
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed)
  const router = useRouter()

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}; path=/`
        }}
        className="h-full max-h-[full] items-stretch flex fixed"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}; path=/`
          }}
          onExpand={() => {
            setIsCollapsed(false)
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}; path=/`
          }}
          className={cn(
            'h-screen', // Removing this will break something. I don't remember what.
            isCollapsed &&
              'min-w-[50px] max-w-[50px] transition-all duration-300 ease-in-out'
          )}
        >
          <div
            className={cn(
              'flex flex-col h-full w-full z-20',
              isCollapsed && 'items-center',
              'sticky top-0' // Make the header sticky
            )}
          >
            <div>
              <div
                className={cn(
                  'flex h-[52px] items-center',
                  isCollapsed ? 'h-[52px] justify-center' : 'px-2 ml-2'
                )}
              >
                <Image
                  src={'/logos/Headpat_Logo_web_128x128_240518-05.png'}
                  width={32}
                  height={32}
                  alt={'Headpat logo'}
                  className={'rounded-full'}
                />
                <span className={cn('ml-2', isCollapsed && 'hidden')}>
                  Headpat
                </span>
              </div>
              <Separator />
            </div>
            <ScrollArea className={'h-full overflow-auto'}>
              {/* Make the children scrollable */}
              <div>
                <Nav
                  isCollapsed={isCollapsed}
                  links={Nav1(translations)}
                  translations={translations}
                />
                <Separator />
                <Nav
                  isCollapsed={isCollapsed}
                  links={Nav2(accountData, translations)}
                  translations={translations}
                />
                <Separator />
                <Nav
                  isCollapsed={isCollapsed}
                  links={Nav3(translations)}
                  translations={translations}
                />
              </div>
            </ScrollArea>
            <div className={'mt-auto relative bottom-0 block'}>
              {accountData ? (
                <>
                  <Separator />
                  <DropdownMenu>
                    <DropdownMenuTrigger className={'w-full focus:outline-0'}>
                      <div
                        className={
                          'flex items-center justify-between my-4 mx-4 hover:bg-white/5 rounded-xl p-2'
                        }
                      >
                        {isCollapsed ? (
                          <Avatar className="size-10 rounded-xl">
                            <AvatarImage
                              className={'rounded-xl'}
                              src={userImage}
                            />
                            <AvatarFallback className={'rounded-xl'}>
                              {userData?.displayName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <>
                            <div>
                              <span className="flex min-w-0 items-center gap-3">
                                <Avatar className="size-10 rounded-xl">
                                  <AvatarImage
                                    className={'rounded-xl'}
                                    src={userImage}
                                  />
                                  <AvatarFallback className={'rounded-xl'}>
                                    {userData?.displayName
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                                    {userData?.displayName || 'Unknown'}
                                  </span>
                                </span>
                              </span>
                            </div>
                            <div>
                              <ChevronUpIcon />
                            </div>
                          </>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={'w-24'}>
                      <DropdownMenuItem onClick={() => router.push('/account')}>
                        My Account
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/profile')}>
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/logout')}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div>
                  <Separator />
                  <Nav
                    isCollapsed={isCollapsed}
                    links={NavFooter(accountData, translations)}
                    translations={translations}
                  />
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <ScrollArea className={'h-full w-full'}>{children}</ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  )
}
