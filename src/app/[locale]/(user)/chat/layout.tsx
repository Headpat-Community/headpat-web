'use client'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import PageLayout from '@/components/pageLayout'
import UserCard from '@/components/user/userCard'
import { getAvatarImageUrlPreview } from '@/components/getStorageItem'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { contacts } = useRealtimeChat()

  return (
    <PageLayout title={'Chat'}>
      <div className="flex">
        {/* Contacts Sidebar */}
        <div className="w-[500px] border-r border-gray-200">
          <div className="p-3 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Contacts</h2>
          </div>
          <ScrollArea className="h-[calc(95vh-5rem)]">
            {contacts.map((contact) => (
              <Link key={contact.$id} href={`/chat/${contact.$id}`}>
                <div className="flex items-center p-4 cursor-pointer hover:bg-foreground/10">
                  <UserCard user={contact?.userdata} isChild={true}>
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          getAvatarImageUrlPreview(
                            contact?.userdata?.avatarId,
                            'width=250&height=250'
                          ) || null
                        }
                        alt={contact.userdata?.displayName}
                      />
                      <AvatarFallback>
                        {contact?.userdata?.displayName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </UserCard>
                  <div className="ml-4">
                    <p className="font-semibold">
                      {contact?.userdata?.displayName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contact?.lastMessage}
                    </p>
                  </div>
                  <div
                    className={`ml-auto w-2 h-2 rounded-full ${
                      contact.status === 'online'
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                </div>
              </Link>
            ))}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1">{children}</div>
      </div>
    </PageLayout>
  )
}
