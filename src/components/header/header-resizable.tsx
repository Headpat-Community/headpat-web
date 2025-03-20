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
import { Nav1, Nav2, Nav3, Nav4, NavFooter } from '@/components/header/data'
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BracesIcon, ChevronsUpDown, ServerIcon, UsersIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { useUser } from '@/components/contexts/UserContext'
import { databases } from '@/app/appwrite-client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { team, TeamSwitcher } from '@/components/TeamSwitcher'
import { UserDataDocumentsType } from '@/utils/types/models'

const getAvatar = (id: string) => {
  if (!id) return

  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=250&height=250&quality=50`
}

export default function SidebarResizable({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  translations,
  children,
}: {
  defaultLayout: number[]
  defaultCollapsed: boolean
  navCollapsedSize: number
  translations: any
  children: React.ReactNode
}) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed)
  const [userData, setUserData] = useState<UserDataDocumentsType | null>(null)
  const [userImage, setUserImage] = useState<string | null>(null)
  const router = useRouter()
  const { current } = useUser()

  const teams: team[] = [
    {
      name: 'Place',
      activeName: 'Headpat Place',
      logo: UsersIcon,
      href: 'https://headpat.place',
    },
    {
      name: 'Space',
      logo: ServerIcon,
      href: 'https://headpat.space',
    },
    {
      name: 'Developer',
      logo: BracesIcon,
      plan: 'Documentation for developers',
      href: 'https://headpat.dev',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      if (current) {
        try {
          await databases
            .getDocument('hp_db', 'userdata', `${current.$id}`)
            .then((data: UserDataDocumentsType) => {
              setUserData(data)
              const image = getAvatar(data.avatarId)
              setUserImage(image)
            })
        } catch {
          toast.error('Failed to fetch user data')
        }
      }
    }

    fetchData().then()
  }, [current])

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
              <Link href={'/'}>
                <div
                  className={cn(
                    'flex h-[52px] items-center',
                    isCollapsed ? 'h-[52px] justify-center' : 'px-2 ml-2'
                  )}
                >
                  <TeamSwitcher teams={teams} />
                </div>
              </Link>
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
                  links={Nav2(current, translations)}
                  translations={translations}
                />
                <Separator />
                <Nav
                  isCollapsed={isCollapsed}
                  links={Nav3(translations)}
                  translations={translations}
                />
                <Separator />
                <Nav
                  isCollapsed={isCollapsed}
                  links={Nav4()}
                  translations={translations}
                />
              </div>
            </ScrollArea>
            <div className={'mt-auto relative bottom-0 block'}>
              <Separator />
              <span className={'my-1 flex justify-center'}>BETA</span>
              {current ? (
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
                              <ChevronsUpDown className="ml-auto size-4" />
                            </div>
                          </>
                        )}
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                      side="bottom"
                      align="end"
                      sideOffset={4}
                    >
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
                    links={NavFooter(current, translations)}
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
