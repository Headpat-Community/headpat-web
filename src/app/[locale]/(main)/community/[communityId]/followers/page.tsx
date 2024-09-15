import PageClient from './page.client'

export const runtime = 'edge'

export default async function FollowerPage({
  params: { locale, communityId },
}: {
  params: { locale: string; communityId: string }
}) {
  return <PageClient communityId={communityId} />
}
