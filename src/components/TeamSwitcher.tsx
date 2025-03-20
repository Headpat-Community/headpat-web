'use client'
import * as React from 'react'
import { ChevronsUpDown } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useIsMobile } from '@/hooks/use-mobile'
import Link from 'next/link'
import Image from 'next/image'

export type team = {
  name: string
  activeName?: string
  logo: React.ComponentType<React.SVGProps<SVGSVGElement>>
  activeLogo?: React.ComponentType
  plan?: string
  href: string
}

export function TeamSwitcher({ teams }: { teams: team[] }) {
  const isMobile = useIsMobile()
  const activeTeam = teams[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          'peer/menu-button ring-ring flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! hover:bg-zinc-900/10 hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground dark:hover:bg-white/10 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0'
        }
      >
        <Image
          src={'/logos/Headpat_Logo_web_128x128_240518-05.png'}
          width={32}
          height={32}
          alt={'Headpat logo'}
          className={'rounded-full'}
          draggable={false}
        />
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">
            {activeTeam.activeName}
          </span>
          <span className="truncate text-xs">{activeTeam.plan}</span>
        </div>
        <ChevronsUpDown className="ml-auto" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-white dark:bg-zinc-900"
        align="start"
        side={isMobile ? 'bottom' : 'right'}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Sites
        </DropdownMenuLabel>
        <hr className="my-1 mb-3 border-zinc-900/10 dark:border-white/10" />
        {teams.map((team) => (
          <Link href={team.href} key={team.name}>
            <DropdownMenuItem
              key={team.name}
              className="gap-2 p-2 hover:bg-zinc-900/10 dark:hover:bg-white/10"
            >
              <div className="flex size-6 items-center justify-center rounded-sm border">
                <team.logo className="size-4 shrink-0" />
              </div>
              {team.name}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
