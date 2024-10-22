import PageClient from './page.client'

export const runtime = 'edge'

export default async function FollowerPage(
  props: {
    params: Promise<{ locale: string; communityId: string }>
  }
) {
  const params = await props.params;

  const {
    locale,
    communityId
  } = params;

  return <PageClient communityId={communityId} />
}
