import { User } from 'lucide-react'
import React from 'react'

export default function ChatPage() {
  return (
    <>
      <div className="flex-1 flex items-center justify-center mt-6">
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
