import Client from './page.client'

export const metadata = {
  title: 'Badge request',
}

export const runtime = 'edge'

export default function AccountBadgePage() {
  return (
    <>
      <Client/>
    </>
  )
}
