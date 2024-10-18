'use client'
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Button } from '@/components/ui/button'
import {
  CornerDownLeftIcon,
  MicIcon,
  PaperclipIcon,
  SendIcon,
} from 'lucide-react'
import { formatDate } from '@/components/calculateTimeLeft'
import { useUser } from '@/components/contexts/UserContext'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import React from 'react'

export default function ChatClient() {
  const { current } = useUser()
  const { messages } = useRealtimeChat()

  const actionIcons = [
    {
      icon: SendIcon,
      type: 'send',
    },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="p-3 border-b border-gray-200">
        <h2 className="text-xl font-semibold">veve</h2>
      </div>
      <ChatMessageList className="overflow-y-auto">
        {messages.map((message, index) => {
          const variant =
            message.fromUserId === current.$id ? 'sent' : 'received'
          return (
            <ChatBubble key={message.$id} variant={variant}>
              <ChatBubbleAvatar fallback={variant === 'sent' ? 'F' : 'V'} />
              <ChatBubbleMessage isLoading={message.isLoading}>
                {message.body}
                <ChatBubbleTimestamp timestamp={formatDate(new Date())} />
              </ChatBubbleMessage>

              {/* Action Icons */}
              <ChatBubbleActionWrapper>
                {actionIcons.map(({ icon: Icon, type }) => (
                  <ChatBubbleAction
                    className="size-7"
                    key={type}
                    icon={<Icon className="size-4" />}
                    onClick={() =>
                      console.log(
                        'Action ' + type + ' clicked for message ' + index
                      )
                    }
                  />
                ))}
              </ChatBubbleActionWrapper>
            </ChatBubble>
          )
        })}
      </ChatMessageList>
      <form className="flex-none w-full p-1 border-t bg-background focus-within:ring-1 focus-within:ring-ring">
        <ChatInput
          placeholder="Type your message here..."
          className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button variant="ghost" size="icon">
            <PaperclipIcon className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>

          <Button variant="ghost" size="icon">
            <MicIcon className="size-4" />
            <span className="sr-only">Use Microphone</span>
          </Button>

          <Button size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeftIcon className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
