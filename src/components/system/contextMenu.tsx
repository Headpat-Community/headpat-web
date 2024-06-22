'use client'
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu'
import * as React from 'react'

export default function ContextMenuProvider({ children }) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
    </ContextMenu>
  )
}
