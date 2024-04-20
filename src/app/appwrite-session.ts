import {
  Client,
  Account,
  Teams,
  Functions,
  Databases,
  Storage,
  Messaging,
  Locale,
  Avatars,
} from 'node-appwrite'
import { headers } from 'next/headers'

const createSessionServerClient = async () => {
  const headersList = headers()
  const cookieHeader = headersList.get('cookie')
  const cookies = cookieHeader ? cookieHeader.split('; ') : []
  const sessionCookie = cookies.find((cookie) => cookie.startsWith('a_session'))

  const client = new Client()
    .setEndpoint(`${process.env.NEXT_PUBLIC_API_URL}/v1`)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

  if (sessionCookie) {
    client.setSession(sessionCookie.split('=')[1])
  } else {
    throw new Error('No session cookie found')
  }

  return {
    get account() {
      return new Account(client)
    },
    get teams() {
      return new Teams(client)
    },
    get databases() {
      return new Databases(client)
    },
    get storage() {
      return new Storage(client)
    },
    get functions() {
      return new Functions(client)
    },
    get messaging() {
      return new Messaging(client)
    },
    get locale() {
      return new Locale(client)
    },
    get avatars() {
      return new Avatars(client)
    },
  }
}

const createSessionClient = async (request: any) => {
  const client = new Client()
    .setEndpoint(`${process.env.NEXT_PUBLIC_API_URL}/v1`)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

  const session = request.cookies.get(
    `a_session_${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  )

  if (session) {
    client.setSession(session.value)
  }

  return {
    get account() {
      return new Account(client)
    },
    get teams() {
      return new Teams(client)
    },
    get databases() {
      return new Databases(client)
    },
    get storage() {
      return new Storage(client)
    },
    get functions() {
      return new Functions(client)
    },
    get messaging() {
      return new Messaging(client)
    },
    get locale() {
      return new Locale(client)
    },
    get avatars() {
      return new Avatars(client)
    },
  }
}

const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(`${process.env.NEXT_PUBLIC_API_URL}/v1`)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY)

  return {
    get account() {
      return new Account(client)
    },
    get teams() {
      return new Teams(client)
    },
    get databases() {
      return new Databases(client)
    },
    get storage() {
      return new Storage(client)
    },
    get functions() {
      return new Functions(client)
    },
    get messaging() {
      return new Messaging(client)
    },
    get locale() {
      return new Locale(client)
    },
    get avatars() {
      return new Avatars(client)
    },
  }
}

export { createSessionClient, createAdminClient, createSessionServerClient }
