'use client'

import { type LucideIcon } from 'lucide-react'

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function NavList({
  projects
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}) {
  const { toggleSidebar, isMobile } = useSidebar()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                onClick={isMobile ? toggleSidebar : undefined}
              >
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
