'use client'
import { Bubble } from '@typebot.io/nextjs'
import { useUser } from '@/components/contexts/UserContext'
import { getJwt } from '@/utils/actions/user/getJwt'
import React from 'react'

export default function PageClient() {
  const [asc, setAsc] = React.useState<string | null>(null)
  const { current } = useUser()

  React.useEffect(() => {
    const fetchJwt = async () => {
      const jwt = await getJwt()
      setAsc(jwt)
    }
    fetchJwt().then()
  }, [])

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
          userId: current?.$id,
          userJWT: asc,
        }}
      />
    </div>
  )
}
