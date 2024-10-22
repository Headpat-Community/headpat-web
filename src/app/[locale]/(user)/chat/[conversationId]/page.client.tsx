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
  PaperclipIcon,
  SendIcon,
  Users,
  XIcon,
} from 'lucide-react'
import { formatDate } from '@/components/calculateTimeLeft'
import { useUser } from '@/components/contexts/UserContext'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { databases, functions, storage } from '@/app/appwrite-client'
import { ExecutionMethod, ID, Query } from 'node-appwrite'
import { Messaging } from '@/utils/types/models'
import { useDataCache } from '@/components/contexts/DataCacheContext'
import { z } from 'zod'
import { toast } from 'sonner'
import { getCommunityAvatarUrlPreview } from '@/components/getStorageItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link } from '@/i18n/routing'
import { Label } from '@/components/ui/label'
import { FileIcon } from 'lucide-react'

const schema = z.object({
  message: z
    .string()
    .max(2048, 'Message: Max length is 2048')
    .min(1, 'Message: Min length is 1'),
  attachments: z.array(z.instanceof(File)).optional(),
})

export default function ChatClient({
  conversationId,
}: {
  conversationId: string
}) {
  const { current } = useUser()
  const { messages, setMessages } = useRealtimeChat()
  const { userCache, communityCache, fetchUserData, fetchCommunityData } =
    useDataCache()
  const [participants, setParticipants] = useState<string[]>([])
  const [communityId, setCommunityId] = useState<string | null>(null)
  const [conversation, setConversation] =
    useState<Messaging.MessageConversationsDocumentsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attachments, setAttachments] = useState<File[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const messageListRef = useRef<HTMLDivElement>(null)

  const fetchMessages = useCallback(
    async (reset = false) => {
      if (!hasMore && !reset) return

      const limit = 25
      const offset = reset ? 0 : page * limit

      try {
        const result = await databases.listDocuments('hp_db', 'messages', [
          Query.equal('conversationId', conversationId),
          Query.orderAsc('$createdAt'),
          Query.limit(limit),
          Query.offset(offset),
        ])

        const newMessages =
          result.documents as Messaging.MessagesType['documents']
        setMessages((prevMessages) =>
          reset ? newMessages : [...prevMessages, ...newMessages]
        )
        setHasMore(newMessages.length === limit)
        setPage((prevPage) => (reset ? 1 : prevPage + 1))
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    },
    [conversationId, hasMore, page, setMessages]
  )

  const fetchConversation = async () => {
    setIsLoading(true)
    try {
      await fetchMessages(true)

      const conversationData: Messaging.MessageConversationsDocumentsType =
        await databases.getDocument(
          'hp_db',
          'messages-conversations',
          conversationId
        )

      if (conversationData.communityId) {
        setCommunityId(conversationData.communityId)
        if (!communityCache[conversationData.communityId]) {
          await fetchCommunityData(conversationData.communityId)
        }
      }

      setConversation(conversationData)
      setParticipants(conversationData.participants || [])
    } catch (error) {
      console.error('Error fetching conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchConversation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId])

  useEffect(() => {
    participants.forEach((userId) => {
      if (!userCache[userId]) {
        fetchUserData(userId)
      }
    })
  }, [participants, fetchUserData, userCache])

  const getUserAvatar = (userId: string) => {
    const user = userCache[userId]
    if (!user || !user.avatarId) return
    return `${process.env.NEXT_PUBLIC_API_URL}/v1/storage/buckets/avatars/files/${user.avatarId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}&width=100&height=100`
  }

  const sendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const message = formData.get('message') as string

    try {
      // Validate the message and attachments
      schema.parse({ message, attachments })

      // Upload attachments
      const uploadedAttachments = await Promise.all(
        attachments.map((file) =>
          storage.createFile('messaging-attachments', ID.unique(), file)
        )
      )

      const data = await functions.createExecution(
        'user-endpoints',
        JSON.stringify({
          message,
          attachments: uploadedAttachments.map((file) => file.$id) || [],
          messageType: uploadedAttachments.length > 0 ? 'file' : 'text',
        }),
        false,
        `/user/chat/message?conversationId=${conversationId}`,
        ExecutionMethod.POST
      )
      const response = JSON.parse(data.responseBody)
      if (response.code === 500) {
        toast.error('An error occurred while sending the message')
        return
      } else if (response.type === 'userchat_user_not_in_conversation') {
        toast.error('You are not in this conversation')
        return
      } else if (response.type === 'userchat_message_sent') {
        toast.success('Message sent')
      }

      // Clear the form and attachments after sending
      form.reset()
      setAttachments([])
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      } else {
        console.error('Error sending message:', error)
        toast.error('An error occurred while sending the message')
      }
    }
  }

  const handleAttachmentChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files)
      setAttachments((prevAttachments) => {
        const updatedAttachments = [...prevAttachments, ...newFiles]
        console.log('Updated attachments:', updatedAttachments)
        return updatedAttachments
      })
    }
    // Reset the file input
    event.target.value = ''
  }

  const removeAttachment = (index: number) => {
    setAttachments((prevAttachments) => {
      const updatedAttachments = prevAttachments.filter((_, i) => i !== index)
      console.log('Attachments after removal:', updatedAttachments)
      return updatedAttachments
    })
  }

  const handleScroll = useCallback(() => {
    if (messageListRef.current) {
      const { scrollTop } = messageListRef.current
      if (scrollTop === 0 && hasMore) {
        fetchMessages()
      }
    }
  }, [fetchMessages, hasMore])

  const getConversationAvatar = () => {
    if (communityId && communityCache[communityId]) {
      return getCommunityAvatarUrlPreview(
        communityCache[communityId].avatarId,
        'width=100&height=100'
      )
    }
    return getUserAvatar(participants.find((id) => id !== current.$id) || '')
  }

  const getConversationName = () => {
    if (communityId && communityCache[communityId]) {
      return communityCache[communityId].name
    }
    return userCache[participants.find((id) => id !== current.$id) || '']
      ?.displayName
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 md:p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="relative mr-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={getConversationAvatar()}
                alt={getConversationName()}
              />
              <AvatarFallback>
                {getConversationName()?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            {communityId && communityCache[communityId] && (
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                <Users size={12} />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold">
              {isLoading ? 'Loading...' : getConversationName()}
            </h2>
          </div>
        </div>
      </div>

      <ChatMessageList
        className="flex-grow overflow-y-auto"
        ref={messageListRef}
        onScroll={handleScroll}
      >
        {messages.map((message, index) => {
          const variant = message.senderId === current.$id ? 'sent' : 'received'
          const user = userCache[message.senderId]

          return (
            <ChatBubble key={message.$id} variant={variant}>
              <Link
                href={{
                  pathname: '/user/[profileUrl]',
                  params: {
                    profileUrl: user?.profileUrl,
                  },
                }}
              >
                <ChatBubbleAvatar
                  src={getUserAvatar(message.senderId)}
                  fallback={user?.displayName?.charAt(0) || '?'}
                />
              </Link>
              <ChatBubbleMessage isLoading={message.isLoading}>
                {message.body}
              </ChatBubbleMessage>
              {/* Action Icons */}
              <ChatBubbleActionWrapper>
                <ChatBubbleAction
                  className="size-7"
                  icon={<SendIcon className="size-4" />}
                  onClick={() =>
                    console.log('Action send clicked for message ' + index)
                  }
                />
              </ChatBubbleActionWrapper>
            </ChatBubble>
          )
        })}
        {isLoading && <div>Loading...</div>}
      </ChatMessageList>
      <form
        className="flex-none w-full p-1 border-t bg-background focus-within:ring-1 focus-within:ring-ring"
        onSubmit={sendMessage}
      >
        <ChatInput
          name="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none rounded-lg bg-background p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <PaperclipIcon className="size-4" />
            <span className="sr-only">Attach files</span>
          </Button>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleAttachmentChange}
          />
          {attachments.length > 0 && (
            <div className="ml-2 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded p-1"
                >
                  <FileIcon className="size-4 mr-1" />
                  <span className="text-sm text-gray-500 truncate max-w-[100px]">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1"
                    onClick={() => removeAttachment(index)}
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <Button size="sm" className="ml-auto gap-1.5" type="submit">
            Send Message
            <CornerDownLeftIcon className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
