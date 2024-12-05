'use client'
import { Bubble } from '@typebot.io/nextjs'

export default function PageClient({
  asc,
  userId,
}: {
  asc: string
  userId: string
}) {
  return (
    <div>
      <h1>Chatbot test</h1>
      <p className={'mt-2'}>
        I see you found this page.. who knows what&apos;s happening 👀
      </p>
      <Bubble
        typebot="hp-bot-1"
        apiHost={'https://typebot-viewer.sites.fayevr.dev'}
        prefilledVariables={{
          userId: userId,
          userJWT: asc,
        }}
      />
    </div>
  )
}
