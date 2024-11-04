'use client'
import {
  BadgeHelpIcon,
  BellIcon,
  CalendarIcon,
  CircleUserIcon,
  File,
  FileCheckIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LayoutPanelLeftIcon,
  LogOutIcon,
  MapIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  PencilIcon,
  UserSearchIcon,
} from 'lucide-react'
import { Account } from '@/utils/types/models'
import { SiDiscord, SiGithub } from '@icons-pack/react-simple-icons'

export const Nav1 = (translations: any) => [
  {
    title: translations.home,
    label: '',
    icon: HomeIcon,
    variant: 'ghost' as const,
    href: `/`,
  },
  {
    title: translations.chat,
    label: '',
    icon: MessagesSquareIcon,
    variant: 'ghost' as const,
    href: `/chat`,
  },
  {
    title: translations.gallery,
    label: '',
    icon: LayoutPanelLeftIcon,
    variant: 'ghost' as const,
    href: `/gallery`,
  },
  {
    title: translations.announcements,
    label: '',
    icon: MegaphoneIcon,
    variant: 'ghost' as const,
    href: `/announcements`,
  },
  {
    title: translations.notifications,
    label: '',
    icon: BellIcon,
    variant: 'ghost' as const,
    href: `/notifications`,
  },
  {
    title: translations.events,
    label: '',
    icon: CalendarIcon,
    variant: 'ghost' as const,
    href: `/events`,
  },
  {
    title: translations.map,
    label: '',
    icon: MapIcon,
    variant: 'ghost' as const,
    href: `/map`,
  },
  {
    title: translations.users,
    label: '',
    icon: UserSearchIcon,
    variant: 'ghost' as const,
    href: `/users`,
  },
]

export const Nav2 = (account: Account.AccountPrefs, translations: any) => {
  return [
    {
      title: translations.myprofile,
      label: '',
      icon: File,
      variant: 'ghost' as const,
      href: account ? `/profile` : `/login`,
    },
    {
      title: translations.communities,
      label: '',
      icon: HeartHandshakeIcon,
      variant: 'ghost' as const,
      href: `/community`,
    },
  ]
}

export const Nav3 = (translations: any) => [
  {
    title: translations.legal,
    label: '',
    icon: FileCheckIcon,
    variant: 'ghost' as const,
    href: `/legal`,
  },
  {
    title: 'Support',
    label: '',
    icon: BadgeHelpIcon,
    variant: 'ghost' as const,
    href: `/support`,
  },
  {
    title: translations.changelog,
    label: '',
    icon: PencilIcon,
    variant: 'ghost' as const,
    href: `/changelog`,
  },
]

export const Nav4 = () => [
  {
    title: 'Discord',
    label: '',
    icon: SiDiscord,
    variant: 'ghost' as const,
    href: `https://discord.gg/EaQTEKRg2A`,
    target: '_blank',
  },
  {
    title: 'GitHub',
    label: '',
    icon: SiGithub,
    variant: 'ghost' as const,
    href: `https://github.com/headpat-community/`,
    target: '_blank',
  },
]

export const NavFooter = (account: Account.AccountPrefs, translations: any) => {
  const navItems = [
    {
      title: account ? translations.account : translations.login,
      label: '',
      icon: CircleUserIcon,
      variant: 'ghost' as const,
      href: account ? `/account` : `/login`,
    },
  ]

  if (account) {
    navItems.unshift({
      title: translations.logout,
      label: '',
      icon: LogOutIcon,
      variant: 'ghost' as const,
      href: `/logout`,
    })
  }

  return navItems
}
