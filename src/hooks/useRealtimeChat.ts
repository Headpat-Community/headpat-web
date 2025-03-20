import { useEffect, useState } from 'react'
import { RealtimeResponseEvent } from 'appwrite'
import { client, databases } from '@/app/appwrite-client'
import { Query } from 'node-appwrite'
import {
  MessageConversationsDocumentsType,
  MessageConversationsType,
  MessagesDocumentsType,
} from '@/utils/types/models'

export function useRealtimeChat() {
  const [conversations, setConversations] = useState<
    MessageConversationsDocumentsType[]
  >([])
  const [messages, setMessages] = useState<MessagesDocumentsType[]>([])

  useEffect(() => {
    const unsubscribe = client.subscribe(
      [
        'databases.hp_db.collections.messages-conversations.documents',
        'databases.hp_db.collections.messages.documents',
      ],
      (response: RealtimeResponseEvent<any>) => {
        const { events, payload } = response

        if (
          events.some((event) =>
            event.includes('messages-conversations.documents')
          )
        ) {
          handleConversationEvent(events, payload).then()
        }

        if (events.some((event) => event.includes('messages.documents'))) {
          handleMessageEvent(events, payload)
        }
      }
    )

    // Fetch initial data
    fetchInitialData().then()

    return () => {
      unsubscribe()
    }
  }, [])

  const handleConversationEvent = async (
    events: string[],
    payload: MessageConversationsDocumentsType
  ) => {
    if (events.some((event) => event.endsWith('.create'))) {
      // Ensure userdata is present
      setConversations((prevConversations) => [...prevConversations, payload])
    } else if (events.some((event) => event.endsWith('.update'))) {
      // Ensure userdata is present
      setConversations((prevConversations) => {
        const index = prevConversations.findIndex(
          (conversation) => conversation.$id === payload.$id
        )
        if (index !== -1) {
          const newConversations = [...prevConversations]
          newConversations[index] = payload
          return newConversations
        }
        return prevConversations
      })
    } else if (events.some((event) => event.endsWith('.delete'))) {
      setConversations((prevConversations) =>
        prevConversations.filter(
          (conversation) => conversation.$id !== payload.$id
        )
      )
    }
  }

  const handleMessageEvent = (
    events: string[],
    payload: MessagesDocumentsType
  ) => {
    setMessages((prevMessages) => {
      let updatedMessages = [...prevMessages]

      if (events.some((event) => event.endsWith('.create'))) {
        updatedMessages.push(payload)
      } else if (events.some((event) => event.endsWith('.update'))) {
        const index = updatedMessages.findIndex(
          (message) => message.$id === payload.$id
        )
        if (index !== -1) {
          updatedMessages[index] = payload
        }
      } else if (events.some((event) => event.endsWith('.delete'))) {
        updatedMessages = updatedMessages.filter(
          (message) => message.$id !== payload.$id
        )
      }

      return updatedMessages
    })
  }

  const fetchInitialData = async () => {
    const initialConversations: MessageConversationsType =
      await databases.listDocuments('hp_db', 'messages-conversations', [
        Query.orderDesc('$updatedAt'),
        Query.limit(500),
      ])
    setConversations(initialConversations.documents)
  }

  return {
    conversations,
    messages,
    setConversations,
    setMessages,
  }
}
