'use client'

import {
  BadgeHelpIcon,
  BellIcon,
  BracesIcon,
  CalendarIcon,
  FileCheckIcon,
  FileIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LayoutPanelLeftIcon,
  MapIcon,
  MegaphoneIcon,
  PencilIcon,
  ServerIcon,
  UserSearchIcon,
  UsersIcon,
} from 'lucide-react'
import * as React from 'react'

import { NavSecondary } from '@/components/sidebar/nav-secondary'
import { NavUser } from '@/components/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'
import { useDict } from 'gt-next/client'
import { NavList } from './nav-list'
import { TeamSwitcher } from './team-switcher'
import { Separator } from '../ui/separator'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pageNames = useDict('PageNames')

  const data = {
    navMain: [
      {
        name: pageNames('home'),
        url: '/',
        icon: HomeIcon,
      },
      {
        name: pageNames('gallery'),
        url: '/gallery',
        icon: LayoutPanelLeftIcon,
      },
      {
        name: pageNames('announcements'),
        url: '/announcements',
        icon: MegaphoneIcon,
      },
      {
        name: pageNames('notifications'),
        url: '/notifications',
        icon: BellIcon,
      },
      {
        name: pageNames('events'),
        url: '/events',
        icon: CalendarIcon,
      },
      {
        name: pageNames('map'),
        url: '/map',
        icon: MapIcon,
      },
      {
        name: pageNames('users'),
        url: '/users',
        icon: UserSearchIcon,
      },
    ],
    secondMain: [
      {
        name: pageNames('myprofile'),
        url: '/profile',
        icon: FileIcon,
      },
      {
        name: pageNames('communities'),
        url: '/community',
        icon: HeartHandshakeIcon,
      },
    ],
    navSecondary: [
      {
        title: 'Discord',
        url: 'https://discord.gg/EaQTEKRg2A',
        icon: SiDiscord,
      },
      {
        title: 'GitHub',
        url: 'https://github.com/headpat-community/',
        icon: SiGithub,
      },
    ],
    thirdMain: [
      {
        name: pageNames('legal'),
        url: '/legal',
        icon: FileCheckIcon,
      },
      {
        name: 'Support',
        url: '/support',
        icon: BadgeHelpIcon,
      },
      {
        name: pageNames('changelog'),
        url: '/changelog',
        icon: PencilIcon,
      },
    ],
    teams: [
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
    ],
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavList projects={data.navMain} />
        <Separator />
        <NavList projects={data.secondMain} />
        <Separator />
        <NavList projects={data.thirdMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
