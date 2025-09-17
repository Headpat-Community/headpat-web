"use client"

import {
  BadgeHelpIcon,
  BellIcon,
  CalendarIcon,
  FileCheckIcon,
  FileIcon,
  HeartHandshakeIcon,
  HomeIcon,
  LayoutPanelLeftIcon,
  MapIcon,
  MegaphoneIcon,
  PencilIcon,
  RocketIcon,
  UserSearchIcon,
} from "lucide-react"
import * as React from "react"

import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons"
import { useTranslations } from "gt-next/client"
import { useTheme } from "next-themes"
import { Separator } from "../ui/separator"
import { NavList } from "./nav-list"
import { TeamSwitcher } from "./team-switcher"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pageNames = useTranslations("PageNames")
  const { theme, systemTheme } = useTheme()

  const getLogo = (name: string) => {
    const isDarkMode =
      theme === "dark" || (theme === "system" && systemTheme === "dark")
    return `/logos/${name}_${isDarkMode ? "dark" : "light"}_x250.webp`
  }

  const data = {
    navMain: [
      {
        name: pageNames("home"),
        url: "/",
        icon: HomeIcon,
      },
      {
        name: pageNames("gallery"),
        url: "/gallery",
        icon: LayoutPanelLeftIcon,
      },
      {
        name: pageNames("announcements"),
        url: "/announcements",
        icon: MegaphoneIcon,
      },
      {
        name: pageNames("notifications"),
        url: "/notifications",
        icon: BellIcon,
      },
      {
        name: pageNames("events"),
        url: "/events",
        icon: CalendarIcon,
      },
      {
        name: pageNames("map"),
        url: "/map",
        icon: MapIcon,
      },
      {
        name: pageNames("users"),
        url: "/users",
        icon: UserSearchIcon,
      },
    ],
    secondMain: [
      {
        name: pageNames("myprofile"),
        url: "/profile",
        icon: FileIcon,
      },
      {
        name: pageNames("communities"),
        url: "/community",
        icon: HeartHandshakeIcon,
      },
    ],
    navSecondary: [
      {
        title: "Discord",
        url: "https://discord.gg/EaQTEKRg2A",
        icon: SiDiscord,
      },
      {
        title: "GitHub",
        url: "https://github.com/headpat-community/",
        icon: SiGithub,
      },
    ],
    thirdMain: [
      {
        name: pageNames("legal"),
        url: "/legal",
        icon: FileCheckIcon,
      },
      {
        name: "Support",
        url: "/support",
        icon: BadgeHelpIcon,
      },
      {
        name: pageNames("changelog"),
        url: "/changelog",
        icon: PencilIcon,
      },
    ],
    teams: [
      {
        name: "Place",
        activeName: "Headpat Place",
        logo: getLogo("place"),
        href: "https://headpat.place",
      },
      {
        name: "Space",
        logo: getLogo("space"),
        href: "https://headpat.space",
      },
      {
        name: "Developer",
        logo: getLogo("developer"),
        href: "https://headpat.dev",
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
        <Separator />
        <span className="text-muted-foreground text-center text-sm">
          BETA 0.8.14 <RocketIcon className="inline-block size-4" />
        </span>
        <Separator />
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
