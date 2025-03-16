'use client'
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from '@/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/components/ui/chat/chat-message-list'
import { Button } from '@/components/ui/button'
import { CornerDownLeftIcon, FlagIcon, Trash2Icon, Users } from 'lucide-react'
import { useUser } from '@/components/contexts/UserContext'
import { ChatInput } from '@/components/ui/chat/chat-input'
import { useRealtimeChat } from '@/hooks/useRealtimeChat'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { databases, functions, storage } from '@/app/appwrite-client'
import { ExecutionMethod, ID, Query } from 'node-appwrite'
import { Community, Messaging, UserData } from '@/utils/types/models'
import { useDataCache } from '@/components/contexts/DataCacheContext'
import { z } from 'zod'
import { toast } from 'sonner'
import {
  getAvatarImageUrlPreview,
  getCommunityAvatarUrlPreview,
} from '@/components/getStorageItem'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import ReportMessageModal from '@/components/user/moderation/ReportMessageModal'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

const schema = z.object({
  message: z
    .string()
    .trim()
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
  const { getCache, saveCache, getCacheSync } = useDataCache()
  const [participants, setParticipants] = useState<string[]>([])
  const [communityId, setCommunityId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [attachments, setAttachments] = useState<File[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const messageListRef = useRef<HTMLDivElement>(null)
  const [pendingMessages, setPendingMessages] = useState<
    Messaging.MessagesDocumentsType[]
  >([])
  const [messageText, setMessageText] = useState('')
  const [reportMessageOpen, setReportMessageOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] =
    useState<Messaging.MessagesDocumentsType | null>(null)

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

        // Fetch user data for any new message senders
        const newParticipants = newMessages.map((msg) => msg.senderId)
        const participantPromises = newParticipants.map(async (userId) => {
          if (!(await getCache('users', userId))) {
            await databases
              .getDocument('hp_db', 'userdata', userId)
              .then((userData) => {
                saveCache('users', userId, userData)
              })
          }
        })
        await Promise.all(participantPromises)

        setMessages((prevMessages) =>
          reset ? newMessages : [...prevMessages, ...newMessages]
        )
        setHasMore(newMessages.length === limit)
        setPage((prevPage) => (reset ? 1 : prevPage + 1))
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    },
    [conversationId, hasMore, page, setMessages, getCache, saveCache]
  )

  const fetchConversation = useCallback(async () => {
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
        if (!(await getCache('communities', conversationData.communityId))) {
          await databases
            .getDocument('hp_db', 'community', conversationData.communityId)
            .then((communityData) => {
              saveCache(
                'communities',
                conversationData.communityId,
                communityData
              )
            })
        }
      }

      const messageParticipants = messages.map((msg) => msg.senderId)
      const conversationParticipants = conversationData.participants || []
      const allParticipants = [
        ...new Set([...messageParticipants, ...conversationParticipants]),
      ]

      const participantPromises = allParticipants.map(async (userId) => {
        if (!(await getCache('users', userId))) {
          await databases
            .getDocument('hp_db', 'userdata', userId)
            .then((userData) => {
              saveCache('users', userId, userData)
            })
        }
      })

      await Promise.all(participantPromises)

      setParticipants(
        conversationData.communityId
          ? messageParticipants
          : conversationData.participants || []
      )
    } catch (error) {
      console.error('Error fetching conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchMessages, conversationId, messages, getCache, saveCache])

  useEffect(() => {
    fetchConversation().then()
  }, [conversationId])

  useEffect(() => {
    const fetchParticipantsData = async () => {
      const promises = participants.map((userId) => {
        if (!getCache('users', userId)) {
          return databases
            .getDocument('hp_db', 'userdata', userId)
            .then((userData) => {
              saveCache('users', userId, userData)
            })
        }
        return Promise.resolve()
      })
      await Promise.all(promises)
    }

    if (participants.length > 0) {
      fetchParticipantsData().then()
    }
  }, [participants])

  const sendMessage = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) {
      event.preventDefault()
    }

    try {
      // Validate the message and attachments
      schema.parse({ message: messageText, attachments })

      // Create a pending message
      const pendingMessage: Messaging.MessagesDocumentsType = {
        $id: `pending_${Date.now()}`,
        body: messageText,
        senderId: current.$id || '',
        conversationId,
        messageType: 'text',
        attachments: [],
        $collectionId: 'messages',
        $databaseId: 'hp_db',
        $permissions: [],
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
      }
      setPendingMessages((prev) => [...prev, pendingMessage])

      // Upload attachments
      const uploadedAttachments = await Promise.all(
        attachments.map((file) =>
          storage.createFile('messaging-attachments', ID.unique(), file)
        )
      )

      // Prepare the endpoint URL
      let endpointUrl = `/user/chat/message?conversationId=${conversationId}`
      if (!communityId) {
        const recipientId = participants.find((id) => id !== current.$id)
        if (recipientId) {
          endpointUrl += `&recipientId=${recipientId}`
        }
      }

      const data = await functions.createExecution(
        'user-endpoints',
        JSON.stringify({
          message: messageText,
          attachments: uploadedAttachments.map((file) => file.$id) || [],
          messageType: uploadedAttachments.length > 0 ? 'file' : 'text',
        }),
        false,
        endpointUrl,
        ExecutionMethod.POST
      )

      // After successful send, remove the pending message
      setPendingMessages((prev) =>
        prev.filter((msg) => msg.$id !== pendingMessage.$id)
      )

      // Clear the message and attachments
      setMessageText('')
      setAttachments([])

      const response = JSON.parse(data.responseBody)
      if (response.code === 500) {
        toast.error('An error occurred while sending the message')
        return
      } else if (response.type === 'userchat_user_not_in_conversation') {
        toast.error('You are not in this conversation')
        return
      } else if (response.type === 'userchat_message_sent') {
        toast.success('Message sent', {
          position: 'bottom-left',
        })
      }
    } catch (error) {
      // Remove the pending message in case of error
      setPendingMessages((prev) =>
        prev.filter((msg) => msg.$id !== `pending_${Date.now()}`)
      )
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

  const handleScroll = useCallback(async () => {
    if (messageListRef.current) {
      const { scrollTop } = messageListRef.current
      if (scrollTop === 0 && hasMore) {
        await fetchMessages()
      }
    }
  }, [fetchMessages, hasMore])

  const getUserAvatar = (userId: string) => {
    if (!userId) return undefined
    const userCache = getCacheSync<UserData.UserDataDocumentsType>(
      'users',
      userId
    )
    return getAvatarImageUrlPreview(
      userCache?.data?.avatarId,
      'width=100&height=100'
    )
  }

  const getConversationAvatar = () => {
    if (communityId) {
      const communityCache = getCacheSync<Community.CommunityDocumentsType>(
        'communities',
        communityId
      )

      return getCommunityAvatarUrlPreview(
        communityCache?.data?.avatarId,
        'width=100&height=100'
      )
    }
    return getUserAvatar(participants.find((id) => id !== current.$id) || '')
  }

  const getConversationName = () => {
    if (communityId) {
      const communityCache = getCacheSync<Community.CommunityDocumentsType>(
        'communities',
        communityId
      )

      return communityCache?.data?.name
    }
    const userCache = getCacheSync<UserData.UserDataDocumentsType>(
      'users',
      participants.find((id) => id !== current.$id) || ''
    )
    return userCache?.data?.displayName
  }

  const deleteMessage = async (messageId: string) => {
    try {
      await databases.deleteDocument('hp_db', 'messages', messageId)
      return toast.success('Message deleted', {
        position: 'bottom-left',
      })
    } catch (error) {
      if (error.code === 401) {
        return toast.error('You are not authorized to delete this message', {
          position: 'bottom-left',
        })
      } else {
        return toast.error('An error occurred while deleting the message', {
          position: 'bottom-left',
        })
      }
    }
  }

  const reportMessage = async (message: Messaging.MessagesDocumentsType) => {
    setSelectedMessage(message)
    setReportMessageOpen(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage().then()
    }
  }

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight
    }
  }, [messages])

  return (
    <>
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
              {communityId && (
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
                  <Users size={12} />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xl font-semibold">
                {isLoading ? 'Loading...' : getConversationName()}
              </h4>
            </div>
          </div>
        </div>

        <ChatMessageList
          className="grow overflow-y-auto"
          ref={messageListRef}
          onScroll={handleScroll}
        >
          {[...messages, ...pendingMessages].map((message) => {
            const variant =
              message.senderId === current.$id ? 'sent' : 'received'
            const user = getCacheSync<UserData.UserDataDocumentsType>(
              'users',
              message.senderId
            )
            const isPending = message.$id.startsWith('pending_')

            return (
              <ChatBubble key={message.$id} variant={variant}>
                <Link href={`/user/${user?.data?.profileUrl}`}>
                  <ChatBubbleAvatar
                    src={getUserAvatar(message.senderId)}
                    fallback={user?.data?.displayName?.charAt(0) || '...'}
                  />
                </Link>
                {!isPending ? (
                  <ChatBubbleMessage>{message.body}</ChatBubbleMessage>
                ) : (
                  <ChatBubbleMessage className="animate-pulse text-muted-foreground">
                    {message.body}
                  </ChatBubbleMessage>
                )}
                {/* Action Icons */}
                <ChatBubbleActionWrapper>
                  {!isPending && (
                    <ChatBubbleAction
                      className="size-7"
                      icon={<FlagIcon className="size-4" />}
                      onClick={() => reportMessage(message)}
                    />
                  )}
                  {!isPending &&
                    (message.senderId === current.$id || communityId) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <ChatBubbleAction
                            className="size-7"
                            icon={<Trash2Icon className="size-4" />}
                          />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogTitle>Delete message</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this message? This
                            action cannot be undone
                          </AlertDialogDescription>
                          <AlertDialogFooter>
                            <AlertDialogAction
                              onClick={() => {
                                deleteMessage(message.$id).then()
                              }}
                              className={
                                'bg-destructive hover:bg-destructive/80'
                              }
                            >
                              Delete
                            </AlertDialogAction>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
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
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center p-3">
            {/*
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
            */}
            <Button size="sm" className="ml-auto gap-1.5" type="submit">
              Send Message
              <CornerDownLeftIcon className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
      <ReportMessageModal
        open={reportMessageOpen}
        setOpen={setReportMessageOpen}
        message={selectedMessage}
      />
    </>
  )
}
