import {
  BoxesIcon,
  CalendarIcon,
  CircleUserIcon,
  File,
  FileCheckIcon,
  HomeIcon,
  LayoutPanelLeftIcon,
  MegaphoneIcon,
  UserSearchIcon,
  UsersIcon,
} from 'lucide-react'
import { UserAccountType } from '@/utils/types'

export const Nav1 = () => [
  {
    title: 'Home',
    label: '',
    icon: HomeIcon,
    variant: 'ghost' as const,
    href: '/',
  },
  {
    title: 'Gallery',
    label: '',
    icon: LayoutPanelLeftIcon,
    variant: 'ghost' as const,
    href: '/gallery',
  },
  {
    title: 'Announcements',
    label: '',
    icon: MegaphoneIcon,
    variant: 'ghost' as const,
    href: '/announcements',
  },
  {
    title: 'Events',
    label: '',
    icon: CalendarIcon,
    variant: 'ghost' as const,
    href: '/events',
  },
  {
    title: 'Users',
    label: '',
    icon: UserSearchIcon,
    variant: 'ghost' as const,
    href: '/users',
  },
]

export const Nav2 = (account: UserAccountType) => {
  return [
    {
      title: 'My Profile',
      label: '',
      icon: File,
      variant: 'ghost' as const,
      href: account ? '/profile' : '/login',
    },
    {
      title: 'Friends',
      label: '',
      icon: UsersIcon,
      variant: 'ghost' as const,
      href: '#',
    },
    {
      title: 'Communities',
      label: '',
      icon: BoxesIcon,
      variant: 'ghost' as const,
      href: '#',
    },
  ]
}

export const Nav3 = () => [
  {
    title: 'Legal',
    label: '',
    icon: FileCheckIcon,
    variant: 'ghost' as const,
    href: '/legal',
  },
]

export const NavFooter = (account: UserAccountType) => {
  return [
    {
      title: account ? 'Account' : 'Login',
      label: '',
      icon: CircleUserIcon,
      variant: 'ghost' as const,
      href: account ? '/account' : '/login',
    },
  ]
}
