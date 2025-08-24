"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

export type team = {
  name: string
  activeName?: string
  logo: string
  activeLogo?: string
  plan?: string
  href: string
}

export function TeamSwitcher({ teams }: { teams: team[] }) {
  const { isMobile } = useSidebar()
  const activeTeam = teams[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Image
                src={activeTeam.logo}
                width={150}
                height={30}
                alt={"Headpat Place logo"}
                draggable={false}
              />
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Sites
            </DropdownMenuLabel>
            {teams
              .filter((team) => team.name !== activeTeam.name)
              .map((team) => (
                <Link href={team.href} key={team.name}>
                  <DropdownMenuItem
                    key={team.name}
                    className="focus:bg-muted focus-visible:ring-0"
                  >
                    <div className="flex items-center justify-center">
                      <Image
                        src={team.logo}
                        width={150}
                        height={30}
                        alt={`${team.name} logo`}
                        draggable={false}
                      />
                    </div>
                  </DropdownMenuItem>
                </Link>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
