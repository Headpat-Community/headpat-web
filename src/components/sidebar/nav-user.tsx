'use client'

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { useUser } from '@/components/contexts/UserContext'
import Link from 'next/link'

const getAvatar = (id: string) => {
  if (!id) return

  return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${id}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=250&height=250&quality=50`
}

export function NavUser() {
  const { isMobile, toggleSidebar } = useSidebar()
  const { userData, current } = useUser()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={getAvatar(userData?.avatarId)}
                  alt={userData?.displayName || userData?.$id}
                />
                <AvatarFallback className="rounded-lg">
                  {userData?.displayName?.charAt(0) || 'HI'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {userData?.displayName || userData?.$id || 'Login'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={getAvatar(userData?.avatarId)}
                    alt={userData?.displayName || userData?.$id}
                  />
                  <AvatarFallback className="rounded-lg">
                    {userData?.displayName?.charAt(0) || 'HI'}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {userData?.displayName || userData?.$id || 'Login'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link
                href="/account"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </Link>
              <Link
                href="/notifications"
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <DropdownMenuItem>
                  <Bell />
                  Notifications
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <Link
              href={current ? '/logout' : '/login'}
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <DropdownMenuItem>
                <LogOut />
                {current ? 'Log out' : 'Log in'}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
