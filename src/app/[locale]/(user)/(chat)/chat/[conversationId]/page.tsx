import ChatClient from './page.client'
import { Metadata } from 'next'

export const runtime = 'edge'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default async function Chat({ params }) {
  const paramsResponse = await params
  return <ChatClient conversationId={paramsResponse.conversationId} />
}
