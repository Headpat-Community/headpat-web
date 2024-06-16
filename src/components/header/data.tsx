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

export const Nav1 = (lang: string, translations) => [
  {
    title: 'Home',
    label: '',
    icon: HomeIcon,
    variant: 'ghost' as const,
    href: `/${lang}/`,
  },
  {
    title: 'Gallery',
    label: '',
    icon: LayoutPanelLeftIcon,
    variant: 'ghost' as const,
    href: `/${lang}/gallery`,
  },
  {
    title: 'Announcements',
    label: '',
    icon: MegaphoneIcon,
    variant: 'ghost' as const,
    href: `/${lang}/announcements`,
  },
  {
    title: 'Events',
    label: '',
    icon: CalendarIcon,
    variant: 'ghost' as const,
    href: `/${lang}/events`,
  },
  {
    title: 'Users',
    label: '',
    icon: UserSearchIcon,
    variant: 'ghost' as const,
    href: `/${lang}/users`,
  },
]

export const Nav2 = (account: UserAccountType, lang: string, translations) => {
  return [
    {
      title: 'My Profile',
      label: '',
      icon: File,
      variant: 'ghost' as const,
      href: account ? `/${lang}/profile` : `/${lang}/login`,
    },
    {
      title: 'Friends',
      label: '',
      icon: UsersIcon,
      variant: 'ghost' as const,
      href: `/${lang}/friends`,
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

export const Nav3 = (lang: string, translations) => [
  {
    title: 'Legal',
    label: '',
    icon: FileCheckIcon,
    variant: 'ghost' as const,
    href: `/${lang}/legal`,
  },
]

export const NavFooter = (
  account: UserAccountType,
  lang: string,
  translations
) => {
  return [
    {
      title: account ? 'Account' : 'Login',
      label: '',
      icon: CircleUserIcon,
      variant: 'ghost' as const,
      href: account ? `/${lang}/account` : `/${lang}/login`,
    },
  ]
}
