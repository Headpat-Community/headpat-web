import {
  CalendarIcon,
  CircleUserIcon,
  File,
  FileCheckIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LayoutPanelLeftIcon,
  LogOutIcon,
  MegaphoneIcon,
  UserSearchIcon,
} from 'lucide-react'
import { Account } from '@/utils/types/models'

export const Nav1 = (translations: any) => [
  {
    title: translations.home,
    label: '',
    icon: HomeIcon,
    variant: 'ghost' as const,
    href: `/`,
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
    title: translations.events,
    label: '',
    icon: CalendarIcon,
    variant: 'ghost' as const,
    href: `/events`,
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
      href: '/community',
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
