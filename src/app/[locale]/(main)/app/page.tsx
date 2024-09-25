import PageClient from './page.client'

export const runtime = 'edge'

export default async function Home() {
  return <PageClient />
}
