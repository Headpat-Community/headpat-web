'use client'
import * as React from 'react'

import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '../ui/navigation-menu'
import Link from 'next/link'

export function NavigationMenuExport() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <ul>
            <ListItem href="/" title="Home" />
          </ul>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ul>
            <ListItem href="/gallery" title="Gallery" />
          </ul>
        </NavigationMenuItem>
        {/*
        <NavigationMenuItem>
          <ul>
            <ListItem href="/pawcraft" title="Pawcraft" />
          </ul>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ul>
            <ListItem href="/community" title="Community" />
          </ul>
        </NavigationMenuItem>
        */}
        <NavigationMenuItem>
          <ul>
            <ListItem href="/users" title="Users" />
          </ul>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ul>
            <ListItem href="/events" title="Events" />
          </ul>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          //ref={ref}
          href={props.href}
          className={cn(
            'block rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
