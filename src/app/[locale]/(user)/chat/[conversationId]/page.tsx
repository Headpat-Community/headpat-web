import ChatClient from './page.client'

export const runtime = 'edge'

export default function Chat({
  params,
}: {
  params: { conversationId: string }
}) {
  return <ChatClient conversationId={params.conversationId} />
}
