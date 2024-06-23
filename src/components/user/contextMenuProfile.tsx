'use client'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import * as React from 'react'
import { useRouter } from '@/navigation'

export default function ContextMenuProfile({ children }) {
  const router = useRouter()
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className={'w-[200px]'}>
        <ContextMenuItem onClick={() => router.back()}>Back</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Add friend</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
