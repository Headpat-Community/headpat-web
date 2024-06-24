import {
  BoxesIcon,
  CalendarIcon,
  CircleUserIcon,
  File,
  FileCheckIcon,
  HomeIcon,
  LayoutPanelLeftIcon,
  LogOutIcon,
  MegaphoneIcon,
  UserSearchIcon,
} from 'lucide-react'
import { Account } from '@/utils/types/models'

export const Nav1 = (translations) => [
  {
    title: 'Home',
    label: '',
    icon: HomeIcon,
    variant: 'ghost' as const,
    href: `/`,
  },
  {
    title: 'Gallery',
    label: '',
    icon: LayoutPanelLeftIcon,
    variant: 'ghost' as const,
    href: `/gallery`,
  },
  {
    title: 'Announcements',
    label: '',
    icon: MegaphoneIcon,
    variant: 'ghost' as const,
    href: `/announcements`,
  },
  {
    title: 'Events',
    label: '',
    icon: CalendarIcon,
    variant: 'ghost' as const,
    href: `/events`,
  },
  {
    title: 'Users',
    label: '',
    icon: UserSearchIcon,
    variant: 'ghost' as const,
    href: `/users`,
  },
]

export const Nav2 = (account: Account.AccountPrefs, translations) => {
  return [
    {
      title: 'My Profile',
      label: '',
      icon: File,
      variant: 'ghost' as const,
      href: account ? `/profile` : `/login`,
    },
    {
      title: 'Communities',
      label: '',
      icon: BoxesIcon,
      variant: 'ghost' as const,
      href: '/community',
    },
  ]
}

export const Nav3 = (translations) => [
  {
    title: 'Legal',
    label: '',
    icon: FileCheckIcon,
    variant: 'ghost' as const,
    href: `/legal`,
  },
]

export const NavFooter = (account: Account.AccountPrefs, translations) => {
  const navItems = [
    {
      title: account ? 'Account' : 'Login',
      label: '',
      icon: CircleUserIcon,
      variant: 'ghost' as const,
      href: account ? `/account` : `/login`,
    },
  ]

  if (account) {
    navItems.unshift({
      title: 'Logout',
      label: '',
      icon: LogOutIcon,
      variant: 'ghost' as const,
      href: `/logout`,
    })
  }

  return navItems
}
