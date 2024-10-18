import { User } from 'lucide-react'
import React from 'react'

export const runtime = 'edge'

export default function ChatPage() {
  return (
    <>
      <div className="p-3 border-b border-gray-200 mb-8">
        <h2 className="text-xl font-semibold">No user selected</h2>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <User className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-sm font-medium">No chat selected</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a contact to start chatting.
          </p>
        </div>
      </div>
    </>
  )
}
