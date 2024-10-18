import { useEffect, useState } from 'react'
import { RealtimeResponseEvent } from 'appwrite'
import { Messaging, UserData } from '@/utils/types/models'
import { client, databases } from '@/app/appwrite-client'
import { Query } from 'node-appwrite'
import { useUser } from '@/components/contexts/UserContext'

export function useRealtimeChat() {
  const [contacts, setContacts] = useState<
    Messaging.MessageContactsDocumentsType[]
  >([])
  const [messages, setMessages] = useState<Messaging.MessagesDocumentsType[]>(
    []
  )
  const { current } = useUser()

  useEffect(() => {
    const unsubscribe = client.subscribe(
      [
        'databases.hp_db.collections.messages-contacts.documents',
        'databases.hp_db.collections.messages.documents',
      ],
      (response: RealtimeResponseEvent<any>) => {
        const { events, payload } = response

        if (
          events.some((event) => event.includes('messages-contacts.documents'))
        ) {
          handleContactEvent(events, payload).then()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleContactEvent = async (
    events: string[],
    payload: Messaging.MessageContactsDocumentsType
  ) => {
    if (events.some((event) => event.endsWith('.create'))) {
      // Ensure userdata is present
      if (!payload.userdata) {
        payload.userdata = await fetchUserData(payload.targetUserId)
      }
      setContacts((prevContacts) => [...prevContacts, payload])
    } else if (events.some((event) => event.endsWith('.update'))) {
      // Ensure userdata is present
      if (!payload.userdata) {
        payload.userdata = await fetchUserData(payload.targetUserId)
      }
      setContacts((prevContacts) => {
        const index = prevContacts.findIndex(
          (contact) => contact.$id === payload.$id
        )
        if (index !== -1) {
          const newContacts = [...prevContacts]
          newContacts[index] = payload
          return newContacts
        }
        return prevContacts
      })
    } else if (events.some((event) => event.endsWith('.delete'))) {
      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact.$id !== payload.$id)
      )
    }
  }

  const fetchUserData = async (
    contactId: string
  ): Promise<UserData.UserDataDocumentsType> => {
    // Fetch user data based on contactId
    return await databases.getDocument('hp_db', 'userdata', contactId)
  }

  const handleMessageEvent = (
    events: string[],
    payload: Messaging.MessagesDocumentsType
  ) => {
    if (events.some((event) => event.endsWith('.create'))) {
      setMessages((prevMessages) => [...prevMessages, payload])
    } else if (events.some((event) => event.endsWith('.update'))) {
      setMessages((prevMessages) => {
        const index = prevMessages.findIndex(
          (message) => message.$id === payload.$id
        )
        if (index !== -1) {
          const newMessages = [...prevMessages]
          newMessages[index] = payload
          return newMessages
        }
        return prevMessages
      })
    } else if (events.some((event) => event.endsWith('.delete'))) {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.$id !== payload.$id)
      )
    }
  }

  const fetchInitialData = async () => {
    const initialContacts: Messaging.MessageContactsType =
      await databases.listDocuments('hp_db', 'messages-contacts', [
        Query.limit(5000),
      ])
    setContacts(initialContacts.documents)

    const initialMessages: Messaging.MessagesType =
      await databases.listDocuments('hp_db', 'messages', [
        Query.or([
          Query.equal('fromUserId', current.$id),
          Query.equal('targetUserId', current.$id),
        ]),
        Query.limit(25),
      ])
    setMessages(initialMessages.documents)
  }

  return { contacts, messages }
}
