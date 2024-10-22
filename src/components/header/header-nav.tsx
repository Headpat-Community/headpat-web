'use client'

import { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Link, usePathname } from '@/i18n/routing'
import { Badge } from '@/components/ui/badge'

interface NavProps {
  isCollapsed: boolean
  links: {
    title: string
    label?: string
    icon: LucideIcon
    variant: 'default' | 'ghost'
    href: string
  }[]
  setIsOpen?: any
  translations: any
}

export function Nav({ isCollapsed, links, setIsOpen, translations }: NavProps) {
  const currentPath = usePathname()

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => {
          const isActive =
            link.title === translations.home
              ? currentPath === link.href.replace(/\/$/, '')
              : currentPath.startsWith(link.href)

          const variant = isActive ? 'default' : 'ghost'

          return isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  // @ts-ignore
                  href={link.href}
                  onClick={() => {
                    if (window.innerWidth <= 768) {
                      // 768px is a common breakpoint for mobile devices
                      setIsOpen(false)
                    }
                  }}
                  className={cn(
                    buttonVariants({ variant, size: 'icon' }),
                    'h-9 w-9',
                    variant === 'default' &&
                      'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="flex items-center gap-4 z-20"
              >
                {link.title}
                {link.label && <Badge className="ml-auto">{link.label}</Badge>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              // @ts-ignore
              href={link.href}
              onClick={() => {
                if (window.innerWidth <= 768) {
                  // 768px is a common breakpoint for mobile devices
                  setIsOpen(false)
                }
              }}
              className={cn(
                buttonVariants({ variant, size: 'sm' }),
                variant === 'default' &&
                  'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white',
                'justify-start'
              )}
            >
              <link.icon className="mr-2 h-4 w-4" />
              {link.title}
              {link.label && (
                <Badge variant={'secondary'} className={'ml-auto'}>
                  {link.label}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
