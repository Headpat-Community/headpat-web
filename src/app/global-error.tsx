'use client'

import * as Sentry from '@sentry/nextjs'
import Error from 'next/error'
import { useEffect } from 'react'

export default function GlobalError({ error }: { error: any }) {
  useEffect(() => {
    // Only capture non-stream errors
    if (error?.code !== 'ERR_STREAM_ALREADY_FINISHED') {
      Sentry.captureException(error)
    } else {
      console.error('Stream error caught and handled:', error)
    }
  }, [error])

  return (
    <html>
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  )
}
