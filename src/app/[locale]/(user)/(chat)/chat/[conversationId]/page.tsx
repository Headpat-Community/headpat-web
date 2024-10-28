import ChatClient from './page.client'

export const runtime = 'edge'

export default async function Chat({ params }) {
  const paramsResponse = await params
  return <ChatClient conversationId={paramsResponse.conversationId} />
}
